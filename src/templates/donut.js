import $ from "../lib/$/index.js"
import { map as mapColors } from "../lib/colors.js"

const tau = Math.PI * 2

const arc = (v, r) => percent(v * tau * r)
const sum = (a) => a.reduce((m, v) => m + v, 0)
const format = (v) => +v.toFixed(0)
const percent = (v) => +(v * 100).toFixed(2) + "%"

/**
 * Create a donut chart. The donut will expand and contract based on the
 * container size. The thickness of the donut is configurable.
 * @param {Object} options - Data and display options for the chart.
 * @param {number[]} options.data - The data for this chart
 * @param {string} [options.title] - The title for this chart, set to the
 * `<title>` element for better accessibility.
 * @param {string} [options.description] - The description for this chart, set
 * to the `<desc>` element for better accessibility.
 * @param {function} [options.filterValues=(v) => v > 0.04] - The minimum value for which a label
 * is rendered. This value is a percentage, and defaults to 4%.
 * @param {number} [options.offset=-0.25] - The initial rotation of the chart.
 * By default, the chart starts at the vertical top of the circle.
 * @param {number} [options.thickness=0.4] - The width of the donut as a
 * percentage of the radius. A thickness of 1 will render as a pie chart.
 * @param {boolean} [options.sorted=true] - Whether to sort the values.
 * @param {string[]} [options.colors] - Colors to use for each data item
 * @returns {string} Rendered SVG
 *
 * @example
 * donut({ data: [60, 30, 10] });
 *
 * @example
 * donut({
 *    title: "Donut Chart",
 *    data: [145, 330, 192, 3],
 *    colors: ["darkcyan", "lightseagreen", "mediumturquoise", "darkslategrey"],
 *    thickness: 1
 *  })
 */
export default ({
  data,
  title,
  description,
  filterValues,
  offset,
  thickness,
  sorted,
  colors,
}) => {
  filterValues = filterValues || ((v) => v > 0.04)
  offset = offset || -0.25
  thickness = thickness || 0.4
  sorted = sorted ?? true

  colors = colors ?? mapColors(data)

  const values = sorted ? [...data].sort((a, b) => (a < b ? 1 : -1)) : data
  const radius = (2 - thickness) / 4
  const total = sum(data)

  const segments = values.map((value) => {
    const i = data.indexOf(value)
    const v = value / total
    const t = i / (data.length - 1)
    const dashoffset = arc(1 - offset, radius)
    const dasharray = [arc(v, radius), arc(1 - v, radius)].join(" ")

    const theta = tau * (offset + v / 2)
    const scale = thickness === 1 && v < 0.25 ? 1.2 : 1

    const x = Math.cos(theta) * scale * radius
    const y = Math.sin(theta) * scale * radius

    offset += v

    return $.g({
      "class": `segment segment-${i}`,
      "aria-label": format(value),
      "aria-description": `Item ${i + 1}`,
    })([
      $.circle({
        "class": "segment-arc",
        "role": "presentation",
        "r": percent(radius),
        "stroke-dasharray": dasharray,
        "stroke-dashoffset": dashoffset,
        "stroke": colors && colors[i],
        "fill": "none",
      }),
      "\n",
      filterValues(v) &&
        $.text({
          class: "segment-label",
          x: percent(x),
          y: percent(y),
          dy: "0.33em",
          role: "presentation",
        })(format(value)),
    ])
  })

  return $.svg({
    xmlns: "http://www.w3.org/2000/svg",
    width: "100%",
    height: "100%",
  })([
    title && $.title()(title),
    description && $.desc()(description),
    "\n",
    $.svg({
      "x": "50%",
      "y": "50%",
      "role": "presentation",
      "overflow": "visible",
      "stroke-width": percent(thickness / 2),
      "text-anchor": "middle",
    })(segments),
    "\n",
  ])
}
