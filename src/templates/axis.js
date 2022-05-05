import $ from "../lib/dom/index.js"
import utils from "../lib/utils.js"

const TICKCOUNT_ORDER = [5, 4, 6, 7, 8, 9, 3]

/**
 * For charts that feature an x- or y-axis, `shown` will automatically try to
 * guess the best way to display the axis based on the chart data. When you
 * need to, use axis options to override the way an axis is displayed.
 * @typedef {Object} AxisOptions
 * @property {number} [min] - The minimum value for this axis.
 * The default value is derived from `data`. When the lowest value is positive,
 * the default value is zero.
 * @property {number} [max] - The maximum value for this axis.
 * The default value is derived from `data`.
 * @property {number} [ticks] - The number of divisions to use for
 * this axis. The default value is a derived number between 2 and 9 that best
 * splits the difference between `min` and `max`.
 * @property {function|array} [labels] - A function to map an axis
 * value to a label. The function is passed the current value and index as
 * arguments. When supplying an array, the item at the corresponding index will
 * be selected.
 */

/**
 * Calculate the min and max bounds that contain the values. The precision
 * of the values is used to calculate appropriate containing bounds
 * @private
 * @param {number[]} values
 * @returns {number[]} bounds
 */
const getBounds = (values) => {
  let _min = utils.toPrecision(Math.min(...values), 8)
  let _max = utils.toPrecision(Math.max(...values), 8)

  if (_min > 0) _min = 0

  const p = Math.max(
    Math.floor(Math.log10(Math.abs(_min))),
    Math.floor(Math.log10(Math.abs(_max)))
  )

  const f = Math.pow(10, p)

  let min = +_min.toPrecision(1)
  let max = +_max.toPrecision(1)

  if (max < _max) max += Math.ceil((_max - max) / f) * f
  if (min > _min) min -= Math.ceil((min - _min) / f) * f

  return [min, max]
}

const getTicks = (min, max) => {
  const d = max - min
  const l = max.toString().length

  return (
    TICKCOUNT_ORDER.find(
      (n) => l >= utils.toPrecision(d / (n - 1), 8).toString().length
    ) || 2
  )
}

/**
 * @private
 * @param {AxisOptions} axis - Default options to extend.
 * @param {Array} data - Flattened data from which to derive min, max and ticks.
 * @returns {AxisOptions}
 */
export const setup = (axis = {}, data) => {
  let min, max, ticks, label

  if (data || axis.min || axis.max) {
    label = (v) => utils.toPrecision(v, 4)
  }

  if (data) {
    ;[min, max] = getBounds(data)
  } else {
    min = 0
    max = axis.ticks - 1
  }

  ticks = getTicks(axis.min ?? min, axis.max ?? max)

  // If the label is an array, wrap in a function
  if (Array.isArray(axis.label)) {
    const arr = axis.label
    axis.label = (v, i) => arr[i]
  }

  return Object.assign({ ticks, min, max, label, inset: 0 }, axis)
}

export default (type, axis) => {
  if (!axis.label) return

  const svgProps =
    type === "x"
      ? { "width": "100%", "text-anchor": "middle" }
      : { "height": "100%", "text-anchor": "end" }

  const txtProps =
    type === "x" ? { y: "100%", dy: "1.25em" } : { x: "-0.5em", dy: "0.33em" }

  const lineProps = type === "x" ? { y2: "100%" } : { x2: "100%" }

  const pad = (t) => axis.inset + (1 - axis.inset * 2) * t

  const children = Array.from({ length: axis.ticks }, (n, i) => {
    const t = i / (axis.ticks - 1)
    const v = axis.min + (axis.max - axis.min) * t

    const label = axis.label(utils.toPrecision(v, 7), i)
    const hasLabel = label || label === 0

    return $.svg(
      type === "x"
        ? { x: utils.percent(pad(t)) }
        : { y: utils.percent(pad(1 - t)) }
    )([
      hasLabel && $.text(txtProps)(label),
      $.line({
        class: v == 0 ? "axis-base" : "axis-line",
        ...lineProps,
      }),
    ])
  })

  if (axis.spine && !axis.inset) {
    const spineProps = { class: "axis-spine", ...lineProps }
    children.unshift($.line(spineProps))

    if (type === "x") {
      children.push($.line({ x1: "100%", x2: "100%", ...spineProps }))
    } else {
      children.push($.line({ y1: "100%", y2: "100%", ...spineProps }))
    }
  }

  return $.svg({
    class: ["axis", "axis-" + type],
    ...svgProps,
  })(children)
}
