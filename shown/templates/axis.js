import $ from "../lib/dom/index.js"

import decimalPlaces from "../lib/utils/decimal-places.js"
import magnitude from "../lib/utils/magnitude.js"
import percent from "../lib/utils/percent.js"
import toPrecision from "../lib/utils/to-precision.js"
import {
  isFinite,
  isInteger,
  floor,
  ceil,
  abs,
  min,
  max,
  pow,
} from "../lib/utils/math.js"

// The number of ticks to use, in preferential order
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
 * @param {number} vmin
 * @param {number} vmax
 * @returns {number} scale
 */
const getScale = (vmin, vmax) => {
  let m = max(magnitude(vmin), magnitude(vmax))

  // The magnitude should be no greater than the difference
  m = min(m, magnitude(vmax - vmin))

  // Deal with integers from here
  let scale = pow(10, m)

  // If both values are integers and min is positive,
  // all ticks should only occur at integer positions
  if (isInteger(vmax) && isInteger(vmin) && vmin > 0 && scale === 1) {
    return 1
  }

  vmin /= scale
  vmax /= scale

  let d = vmax - vmin

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
    if (vmin > 0 || vmax < 0 ? d % p === 0 : vmin % p === 0 && vmax % p === 0) {
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

  let vmin = toPrecision(min(...values), MAX_PRECISION)
  let vmax = toPrecision(max(...values), MAX_PRECISION)

  if (vmin === vmax) {
    // All values are zero
    if (vmax === 0) return [0, 1]

    // The bounds should be between zero and max
    if (vmin < 0) vmax = 0
    else vmin = 0
  }

  const f = getScale(vmin, vmax)

  vmin = floor(vmin / f)
  vmax = ceil(vmax / f)

  const d = vmax - vmin

  // The distance should be divisible by a low prime number
  // to produce a sensible number of ticks. If it isn't, adding
  // one will ensure it is divisible by two.
  if (d % 2 > 0 && !LOW_PRIMES.some((p) => d % p === 0)) {
    if (abs(vmax) % 2 === 1) {
      vmax += 1
    } else {
      vmin -= 1
    }
  }

  return [
    toPrecision(vmin * f, MAX_PRECISION),
    toPrecision(vmax * f, MAX_PRECISION),
  ]
}

/**
 * Find the first tick count from the preferred options that can
 * divide the difference between min and max without requiring more
 * precision when cast as a string.
 * @private
 * @param {number} vmin
 * @param {number} vmax
 * @returns {number} count
 */
const getTicks = (vmin, vmax) => {
  if (!isFinite(vmin) || !isFinite(vmax)) return 0
  if (vmin === vmax) return 0

  const f = getScale(vmin, vmax)

  vmin = toPrecision(vmin / f, MAX_PRECISION)
  vmax = toPrecision(vmax / f, MAX_PRECISION)

  let d = vmax - vmin

  if (vmin >= 0 || vmax <= 0) {
    LOW_PRIMES.forEach((p) => {
      if (d > max(10, 10 * f) && d % p === 0) {
        d /= p
      }
    })
  }

  const maxDecimals = decimalPlaces(toPrecision(d, MAX_PRECISION))

  return (
    TICKCOUNT_ORDER.find((n) => {
      const mod = toPrecision(d / (n - 1), MAX_PRECISION)
      const dec = toPrecision(mod, MAX_PRECISION)

      return (
        decimalPlaces(dec) <= maxDecimals &&
        (vmin > 0 || vmax < 0 || (vmin % mod === 0 && vmax % mod === 0))
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
  let { min: vmin, max: vmax, ticks, label, line, spine, inset } = axis
  let bmin, bmax, hasOverflow, width

  const showLabel = !!data || isFinite(axis.min) || isFinite(axis.max)

  if (data) {
    if (guessBounds) {
      const values = [vmin, vmax, ...data].filter(isFinite)

      // Unless every number is an integer, assume zero should
      // appear on either end of the scale
      if (values.some((n) => !isInteger(n))) {
        values.push(0)
      }

      ;[bmin, bmax] = getBounds(values)
    } else {
      bmin = min(...data.filter(isFinite))
      bmax = max(...data.filter(isFinite))
    }
  } else {
    bmin = 0
    bmax = ticks - 1
  }

  hasOverflow = bmin < vmin || bmax > vmax
  vmin = vmin ?? bmin
  vmax = vmax ?? bmax
  ticks = ticks ?? getTicks(vmin, vmax)
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
    const length = max(abs(vmax), abs(vmin)).toString().length

    label = (v, i) =>
      (ticks < 8 || i % 2 === 0) &&
      abs(v).toString().length <= length &&
      toPrecision(v, MAX_PRECISION)
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

  if (vmax === vmin) {
    grid = [0.5]
    inset = 0.5
  }

  const scale = (v) =>
    vmax === vmin ? 0.5 : pad((v - vmin) / (vmax - vmin), inset)

  if (label) {
    width = max(
      ...grid
        .map((t) => vmin + t * (vmax - vmin))
        .map(label)
        .filter((t) => t.length || isFinite(t))
        .map((t) => t.toString().length)
    )
  }

  return {
    ...axis,
    min: vmin,
    max: vmax,
    grid,
    ticks,
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
      : {
          "height": "100%",
          "text-anchor": "end",
          "alignment-baseline": "central",
        }

  const txtProps = type === "x" ? { y: "100%", dy: "1.5em" } : { x: "-0.5em" }

  const line = (t, className, d) => {
    const props = { class: className }
    const v = t !== 0 && percent(t)

    if (type === "x") {
      props.x1 = v
      props.x2 = v
      props.y2 = percent(1)
    } else {
      props.y1 = v
      props.y2 = v
      props.x2 = percent(1)
    }

    if (d) {
      const offset = (type === "x" ? [d, 0] : [0, -d]).join(" ")
      props.transform = `translate(${offset})`
    }

    return $.line(props)
  }

  if (axis.hasSeries && type === "x") txtProps.dy = "3em"

  const children = axis.grid.map((t, i) => {
    const v = toPrecision(axis.min + (axis.max - axis.min) * t, MAX_PRECISION)
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

          lines.push(
            (axis.inset || t > 0) &&
              line(-altOffset, "axis-line", t === 0 && 0.5),
            t === 1 && line(altOffset, "axis-line", -0.5)
          )
        }
      } else {
        lines.push(
          line(
            0,
            v == 0 ? "axis-base" : "axis-line",
            t === 0 ? 0.5 : t === 1 ? -0.5 : 0
          )
        )
      }
    }

    return $.svg(
      type === "x"
        ? { x: percent(pad(t, axis.inset)) }
        : { y: percent(pad(1 - t, axis.inset)) }
    )(lines)
  })

  if (axis.spine) {
    // Add an initial line if the first line is inset
    if (!axis.line(axis.min, 0, axis) || pad(axis.grid[0], axis.inset) > 0) {
      children.unshift(line(0, "axis-spine", 0.5))
    }

    // Add a final line if the last line is inset
    if (
      !axis.line(axis.max, axis.ticks - 1, axis) ||
      pad(axis.grid[axis.grid.length - 1], axis.inset) < 1
    ) {
      children.push(line(1, "axis-spine", -0.5))
    }
  }

  return $.svg({
    class: ["axis", "axis-" + type],
    ...svgProps,
  })(children)
}
