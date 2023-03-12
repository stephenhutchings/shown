import $ from "../lib/dom/index.js"
import utils from "../lib/utils.js"

// The number of ticks to use, in preferential order.
const TICKCOUNT_ORDER = [5, 6, 7, 8, 4, 9, 3, 10, 11, 12, 13]
const MAX_PRECISION = 7

// Primes under 10 are used to calculate divisions
const LOW_PRIMES = [7, 5, 3, 2]

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
 * value to a label. The function is passed the current value, index and axis as
 * arguments. When supplying an array, the item at the corresponding index will
 * be selected
 * @property {function|array} [line] - A function to toggle an axis
 * line. The function is passed the current value, index and axis as
 * arguments. When supplying an array, the item at the corresponding index will
 * be selected
 * @property {number} [inset=0] - The amount to inset the first and last tick
 * from the sides of the axis. The value is relative to the width of the chart
 * and should fall between 0 and 1.
 * @property {boolean} [spine=true] - Whether to render lines at the extreme
 * ends of the axis. This value is only used with a non-zero inset.
 */

/**
 * Calculate the scale to use when calculating bounds or ticks.
 * @private
 * @param {number} min
 * @param {number} max
 * @returns {number} scale
 */
const getScale = (min, max) => {
  let m = Math.max(utils.magnitude(min), utils.magnitude(max))

  // The magnitude should be no greater than the difference
  m = Math.min(m, utils.magnitude(max - min))

  // Deal with integers from here
  let scale = Math.pow(10, m)

  // If both values are integers and min is positive,
  // all ticks should only occur at integer positions
  if (
    Number.isInteger(max) &&
    Number.isInteger(min) &&
    min > 0 &&
    scale === 1
  ) {
    return 1
  }

  min /= scale
  max /= scale

  let d = max - min

  // Increase the scale when the difference is too small
  // For example, min=0 and max=1 should have more than 2 ticks
  if (d < 2) {
    d *= 10
    scale /= 10
  } else if (d <= 3) {
    d *= 5
    scale /= 5
  }

  // Reduce by primes that neatly fit to help ensure tick counts
  // in preferential order are not chosen when others fit better
  LOW_PRIMES.forEach((p) => {
    if (min > 0 || max < 0 ? d % p === 0 : min % p === 0 && max % p === 0) {
      scale /= p
    }
  })

  return scale
}

/**
 * Calculate the min and max bounds to contain the values. The precision
 * of the values is used to calculate appropriate containing bounds.
 * @private
 * @param {number[]} values
 * @returns {number[]} bounds
 */
const getBounds = (values) => {
  if (values.length === 0) return [0, 1]

  let min = utils.toPrecision(Math.min(...values), MAX_PRECISION)
  let max = utils.toPrecision(Math.max(...values), MAX_PRECISION)

  if (min === max) {
    // All values are zero
    if (max === 0) return [0, 1]

    // The bounds should be between zero and max
    if (min < 0) max = 0
    else min = 0
  }

  const f = getScale(min, max)

  min = Math.floor(min / f)
  max = Math.ceil(max / f)

  const d = max - min

  // The distance should be divisible by a low prime number
  // to produce a sensible number of ticks. If it isn't, adding
  // one will ensure it is divisible by two.
  if (d % 2 > 0 && !LOW_PRIMES.some((p) => d % p === 0)) {
    if (Math.abs(max) % 2 === 1) {
      max += 1
    } else {
      min -= 1
    }
  }

  return [
    utils.toPrecision(min * f, MAX_PRECISION),
    utils.toPrecision(max * f, MAX_PRECISION),
  ]
}

/**
 * Find the first tick count from the preferred options that can
 * divide the difference between min and max without requiring more
 * precision when cast as a string.
 * @private
 * @param {number} min
 * @param {number} max
 * @returns {number} count
 */
const getTicks = (min, max) => {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return 0
  if (min === max) return 0

  const f = getScale(min, max)

  min = utils.toPrecision(min / f, MAX_PRECISION)
  max = utils.toPrecision(max / f, MAX_PRECISION)

  let d = max - min

  if (min >= 0 || max <= 0) {
    LOW_PRIMES.forEach((p) => {
      if (d > Math.max(10, 10 * f) && d % p === 0) {
        d /= p
      }
    })
  }

  const maxDecimals = utils.decimalPlaces(utils.toPrecision(d, MAX_PRECISION))

  return (
    TICKCOUNT_ORDER.find((n) => {
      const mod = utils.toPrecision(d / (n - 1), MAX_PRECISION)
      const dec = utils.toPrecision(mod, MAX_PRECISION)

      return (
        utils.decimalPlaces(dec) <= maxDecimals &&
        (min > 0 || max < 0 || (min % mod === 0 && max % mod === 0))
      )
    }) || 2
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
      const values = [min, max, ...data].filter(Number.isFinite)

      // Unless every number is an integer, assume zero should
      // appear on either end of the scale
      if (values.some((n) => !Number.isInteger(n))) {
        values.push(0)
      }

      ;[_min, _max] = getBounds(values)
    } else {
      _min = Math.min(...data.filter(Number.isFinite))
      _max = Math.max(...data.filter(Number.isFinite))
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
    // Labels will only show if their length is the same or shorter
    // than the min and max label lengths. If there are many ticks,
    // only every second tick will be labeled.
    const length = Math.max(Math.abs(max), Math.abs(min)).toString().length

    label = (v, i) =>
      (ticks < 8 || i % 2 === 0) &&
      Math.abs(v).toString().length <= length &&
      utils.toPrecision(v, MAX_PRECISION)
  }

  // If the label is an array, wrap in a function
  if (Array.isArray(line)) {
    const arr = line
    line = (v, i) => arr[i]
  } else if (line !== undefined && typeof line !== "function") {
    const val = line
    line = () => val
  } else if (!line) {
    line = () => true
  }

  let grid = Array.from({ length: ticks }, (n, i) => i / (ticks - 1))

  // If the axis displays groups, the inset shifts inwards
  if (axis.group) inset = (0.5 + inset) / ticks

  if (max === min) {
    grid = [0.5]
    inset = 0.5
  }

  const scale = (v) => (max === min ? 0.5 : pad((v - min) / (max - min), inset))

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
    const v = utils.toPrecision(
      axis.min + (axis.max - axis.min) * t,
      MAX_PRECISION
    )
    const lines = []

    if (axis.label) {
      const label = axis.label(v, i, axis)
      if (label || label === 0)
        lines.push($.text({ class: "axis-label", ...txtProps })(label))
    }

    if (axis.line(v, i, axis)) {
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
    if (!axis.line(axis.min, 0, axis) || pad(axis.grid[0], axis.inset) > 0) {
      if (type === "x") {
        children.unshift($.line(spineProps))
      } else {
        children.push($.line({ y1: "100%", y2: "100%", ...spineProps }))
      }
    }

    // Add a final line if the last line is inset
    if (
      !axis.line(axis.max, axis.ticks - 1, axis) ||
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
