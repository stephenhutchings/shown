import $ from "../lib/dom/index.js"
import utils from "../lib/utils.js"

// The number of ticks to use, in preferential order.
const TICKCOUNT_ORDER = [5, 4, 6, 7, 8, 9, 3, 10, 11, 12, 13]

/**
 * Calculate the transformed position after including the offset
 * @private
 * @param {number} t
 * @param {number} inset
 * @returns {number}
 */
const pad = (t, inset = 0) => inset + (1 - inset * 2) * t

/**
 * For charts that feature an x- or y-axis, `shown` will automatically try to
 * guess the best way to display the axis based on the chart data. When you
 * need to, use axis options to override the way an axis is displayed. Any
 * settings you provide will always override the defaults.
 * @typedef {Object} AxisOptions
 * @property {number} [min] - The minimum value for this axis.
 * The default value is derived from `data`.
 * @property {number} [max] - The maximum value for this axis.
 * The default value is derived from `data`.
 * @property {number} [ticks] - The number of divisions to use for
 * this axis. The default value is a derived number between 2 and 13 that best
 * splits the difference between `min` and `max`.
 * @property {function|array} [label] - A function to map an axis
 * value to a label. The function is passed the current value and index as
 * arguments. When supplying an array, the item at the corresponding index will
 * be selected
 * @property {function|array} [line] - A function to toggle an axis
 * line. The function is passed the current value and index as
 * arguments. When supplying an array, the item at the corresponding index will
 * be selected
 * @property {number} [inset=0] - The amount to inset the first and last tick
 * from the sides of the axis. The value is relative to the width of the chart
 * and should fall between 0 and 1.
 * @property {boolean} [spine=true] - Whether to render lines at the extreme
 * ends of the axis. This value is only used with a non-zero inset.
 */

/**
 * Calculate the min and max bounds to contain the values. The precision
 * of the values is used to calculate appropriate containing bounds.
 * @private
 * @param {number[]} values
 * @returns {number[]} bounds
 */
const getBounds = (values) => {
  let _min = utils.toPrecision(Math.min(...values), 9)
  let _max = utils.toPrecision(Math.max(...values), 9)

  if (_min === _max) _min = 0

  let p = Math.max(
    Math.floor(Math.log10(Math.abs(_min))),
    Math.floor(Math.log10(Math.abs(_max)))
  )

  if (_max !== _min && _min !== 0) {
    p = Math.min(p, Math.floor(Math.log10(Math.abs(_max - _min))))
  }

  const f = Math.pow(10, p)

  let min = utils.toPrecision(_min, -p)
  let max = utils.toPrecision(_max, -p)

  if (max < _max) max += Math.ceil((_max - max) / f) * f
  if (min > _min) min -= Math.ceil((min - _min) / f) * f

  const d = utils.toPrecision((max - min) / f, 7)

  // The distance should be divisible by a low prime number
  // to produce a sensible number of ticks
  if (d > 1 && d % 2 > 0 && d % 3 > 0 && d % 5 > 0 && d % 7 > 0) {
    if (Math.abs(_max % f) > Math.abs(_min % f)) {
      max += Math.abs(max % f)
    } else {
      min -= Math.abs(min % f)
    }
  }

  return [utils.toPrecision(min), utils.toPrecision(max)]
}

/**
 * Find the first tick count from the preferred options that can
 * divide the difference between min and max without requiring more
 * precision when cast as a string.
 * @private
 * @param {number} min
 * @param {number} max
 * @returns {number} ticks
 */
const getTicks = (min, max) => {
  const d = max - min
  const l = max.toString().length

  const p = Math.max(
    Math.floor(Math.log10(Math.abs(min))),
    Math.floor(Math.log10(Math.abs(max)))
  )

  return (
    TICKCOUNT_ORDER.find(
      (n) =>
        utils.toPrecision(max % (d / (n - 1)), p) === 0 &&
        utils.toPrecision(min % (d / (n - 1)), p) === 0 &&
        l >= utils.toPrecision(d / (n - 1), 7).toString().length
    ) || 2
  )
}

/**
 * @private
 * @param {AxisOptions} axis - Default options to extend.
 * @param {Array} data - Flattened data from which to derive min, max and ticks.
 * @param {Boolean} guessBounds - Don't use absolute min/max, but a wider gamut.
 * @returns {AxisOptions}
 */
export const setup = (axis = {}, data, guessBounds = true) => {
  let { min, max, ticks, label, line, spine, inset } = axis
  let _min, _max, hasOverflow, width

  const showLabel =
    !!data || Number.isFinite(axis.min) || Number.isFinite(axis.max)

  if (data) {
    if (guessBounds) {
      ;[_min, _max] = getBounds([min, max, ...data].filter(Number.isFinite))
    } else {
      _min = Math.min(...data)
      _max = Math.max(...data)
    }
  } else {
    _min = 0
    _max = ticks - 1
  }

  hasOverflow = _min < min || _max > max
  min = min ?? _min
  max = max ?? _max
  ticks = ticks ?? getTicks(min, max)
  inset = inset ?? 0

  // If the label is an array, wrap in a function
  if (Array.isArray(label)) {
    const arr = label
    label = (v, i) => arr[i]
  } else if (label !== undefined && typeof label !== "function") {
    const val = label
    label = () => val
  } else if (showLabel && !label) {
    label = (v, i) => (ticks < 8 || i % 2 === 0) && utils.toPrecision(v, 7)
  }

  // If the label is an array, wrap in a function
  if (Array.isArray(line)) {
    const arr = line
    line = (v, i) => arr[i]
  } else if (line !== undefined && typeof line !== "function") {
    const val = line
    line = () => val
  } else if (!line) {
    line = (v, i) => true
  }

  let grid = Array.from({ length: ticks }, (n, i) => i / (ticks - 1))

  // If we cross zero, ensure zero is on the axis
  if (min < 0 && max > 0 && !axis.ticks) {
    const d = max - min
    const z = -min / d

    if (!grid.includes(z)) {
      const limit = Math.min(-min, max)
      const count = getTicks(-limit, limit)
      const base = z > 0.5 ? -1 + 2 * z : 0

      grid = Array.from({ length: count }, (n, i) => {
        const t = i / (count - 1)
        return base + ((t * limit) / d) * 2
      })

      while (utils.toPrecision(1 - grid[grid.length - 1], 7) >= grid[1]) {
        grid.push(grid[grid.length - 1] + grid[1])
      }

      ticks = grid.length
      spine = spine ?? true
    }
  }

  // If the axis displays groups, the inset shifts inwards
  if (axis.group) inset = (0.5 + inset) / ticks

  const scale = (v) => pad((v - min) / (max - min), inset)

  if (label) {
    width = Math.max(
      ...grid
        .map((t) => min + t * (max - min))
        .map(label)
        .filter((t) => t.length || Number.isFinite(t))
        .map((t) => t.toString().length)
    )
  }

  return {
    ...axis,
    grid,
    ticks,
    min,
    max,
    label,
    line,
    inset,
    scale,
    spine,
    hasOverflow,
    width,
  }
}

export default (type, axis) => {
  const svgProps =
    type === "x"
      ? { "width": "100%", "text-anchor": "middle" }
      : { "height": "100%", "text-anchor": "end" }

  const txtProps =
    type === "x" ? { y: "100%", dy: "1.5em" } : { x: "-0.5em", dy: "0.33em" }

  const lineProps = type === "x" ? { y2: "100%" } : { x2: "100%" }

  if (axis.hasSeries && type === "x") txtProps.dy = "3em"

  const children = axis.grid.map((t, i) => {
    const v = utils.toPrecision(axis.min + (axis.max - axis.min) * t, 7)
    const lines = []

    if (axis.label) {
      const label = axis.label(v, i)
      if (label || label === 0) lines.push($.text(txtProps)(label))
    }

    if (axis.line(v, i)) {
      if (axis.group) {
        if (axis.ticks !== 1) {
          const altOffset = (0.5 - axis.inset) / (axis.ticks - 1)

          const altLProps =
            type === "x"
              ? {
                  x1: utils.percent(-altOffset),
                  x2: utils.percent(-altOffset),
                }
              : {
                  y1: utils.percent(-altOffset),
                  y2: utils.percent(-altOffset),
                }
          const altRProps =
            type === "x"
              ? { x1: utils.percent(altOffset), x2: utils.percent(altOffset) }
              : { y1: utils.percent(altOffset), y2: utils.percent(altOffset) }

          lines.push(
            (axis.inset || i > 0) &&
              $.line({
                class: "axis-line",
                ...lineProps,
                ...altLProps,
              }),
            i === axis.grid.length - 1 &&
              $.line({
                class: "axis-line",
                ...lineProps,
                ...altRProps,
              })
          )
        }
      } else {
        lines.push(
          $.line({
            class: v == 0 ? "axis-base" : "axis-line",
            ...lineProps,
          })
        )
      }
    }

    return $.svg(
      type === "x"
        ? { x: utils.percent(pad(t, axis.inset)) }
        : { y: utils.percent(pad(1 - t, axis.inset)) }
    )(lines)
  })

  if (axis.spine) {
    const spineProps = { class: "axis-spine", ...lineProps }

    // Add an initial line if the first line is inset
    if (!axis.line(axis.min, 0) || pad(axis.grid[0], axis.inset) > 0) {
      if (type === "x") {
        children.unshift($.line(spineProps))
      } else {
        children.push($.line({ y1: "100%", y2: "100%", ...spineProps }))
      }
    }

    // Add a final line if the last line is inset
    if (
      !axis.line(axis.max, axis.ticks - 1) ||
      pad(axis.grid[axis.grid.length - 1], axis.inset) < 1
    ) {
      if (type === "x") {
        children.push($.line({ x1: "100%", x2: "100%", ...spineProps }))
      } else {
        children.unshift($.line(spineProps))
      }
    }
  }

  return $.svg({
    class: ["axis", "axis-" + type],
    ...svgProps,
  })(children)
}
