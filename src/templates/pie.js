import $ from "../lib/dom/index.js"
import utils from "../lib/utils.js"
import Map from "../lib/map.js"
import wrap from "./wrap.js"

const tau = Math.PI * 2

const arc = (t, r) => utils.percent((t % 1) * tau * r)

/**
 * Generate a pie chart.
 * @param {Object} options - Data and display options for the chart.
 * @param {number[]} options.data - The data for this chart. Values can sum to
 * any number, and percentages will be calculated as needed.
 * @param {string} [options.title] - The title for this chart, set to the
 * `<title>` element for better accessibility.
 * @param {string} [options.description] - The description for this chart, set
 * to the `<desc>` element for better accessibility.
 * @param {number} [options.offset] - The initial rotation of the chart.
 * By default, the chart starts at the vertical top of the circle.
 * @param {boolean} [options.sorted] - Whether to sort the values.
 * @param {MapOptions} [options.map]
 * Controls for transforming data. See {@link MapOptions} for more details.
 * @returns {string} Rendered chart
 *
 * @example
 * shown.pie({ data: [60, 30, 10] });
 *
 * @example
 * shown.pie({
 *    title: "Donut Chart",
 *    data: [{ n: 120 }, { n: 300 }, { n: 180 }],
 *    map: {
 *      value: (d, i) => d.n,
 *      label: (d, i) => "$" + d.n,
 *      color: ["#fc6", "#fa0", "#fb3"],
 *      width: 0.6
 *    },
 *  })
 */
export default ({
  data,
  title,
  description,
  offset = -0.25,
  sorted = true,
  map,
}) => {
  map = new Map({ width: () => 1, ...map }, data, { minValue: 0.05 })
  data = map(data)

  if (sorted) {
    data.sort((a, b) => (a.value < b.value ? 1 : -1))
  }

  const values = data.map((d) => d.value)
  const total = utils.sum(values)

  const segments = data.map((d, i) => {
    const t = d.value / total
    const o = offset + utils.sum(values.slice(0, i)) / total
    const radius = (1 - d.width / 2) / 2
    const dashoffset = arc(-o, radius)
    const dasharray = [arc(t, radius), arc(1 - t, radius)].join(" ")

    const theta = tau * (o + t / 2)
    const scale = d.width === 1 && t < 0.25 ? 1.2 : 1

    const x = Math.cos(theta) * scale * radius
    const y = Math.sin(theta) * scale * radius

    return $.g({
      "class": `segment segment-${i}`,
      "aria-label": `${d.label} (${utils.percent(t)})`,
    })([
      $.circle({
        "class": "segment-arc",
        "role": "presentation",
        "r": utils.percent(radius),
        "stroke": d.color[0],
        "stroke-dasharray": dasharray,
        "stroke-dashoffset": dashoffset,
        "stroke-width": utils.percent(d.width / 2),
        "fill": "none",
      }),
      d.label &&
        $.text({
          class: "segment-label",
          x: utils.percent(x),
          y: utils.percent(y),
          dy: "0.33em",
          role: "presentation",
          color: d.color[1],
        })(d.label),
    ])
  })

  return wrap(
    $.div({
      class: "chart chart-pie",
    })(
      $.svg({
        xmlns: "http://www.w3.org/2000/svg",
        width: "100%",
        height: "100%",
      })([
        title && $.title()(title),
        description && $.desc()(description),
        $.svg({
          "x": "50%",
          "y": "50%",
          "role": "presentation",
          "text-anchor": "middle",
        })(segments),
      ])
    )
  )
}
