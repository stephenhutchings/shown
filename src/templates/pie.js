import $ from "../lib/dom/index.js"
import utils from "../lib/utils.js"
import Map from "../lib/map.js"
import wrap from "./wrap.js"
import legendTemplate from "./legend.js"

const tau = Math.PI * 2

const arc = (t, r) => utils.percent((t % 1) * tau * r)

/**
 * Calculate the bounds based on the portion of the circle
 * @private
 * @param {number} t0 - Start angle (in turns)
 * @param {number} t1 - End angle (in turns)
 * @returns {object} Circle bounds { x, y, w, h }
 */
const getBounds = (t0, t1) => {
  const ts = [t0, t1]

  if (t0 < -0.5 && t1 > -0.5) ts.push(-0.5)
  if (t0 < -0.25 && t1 > -0.25) ts.push(-0.25)
  if (t0 < 0 && t1 > 0) ts.push(0)
  if (t0 < 0.25 && t1 > 0.25) ts.push(0.25)
  if (t0 < 0.5 && t1 > 0.5) ts.push(0.5)

  const xs = ts.map((t) => utils.toPrecision(Math.cos(t * tau) / 2))
  const ys = ts.map((t) => utils.toPrecision(Math.sin(t * tau) / 2))

  const maxX = Math.max(...xs)
  const minX = Math.min(...xs)
  const maxY = Math.max(...ys)
  const minY = Math.min(...ys)

  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
}

/**
 * Generate a pie chart.
 * @alias module:shown.pie
 * @param {Object} options - Data and display options for the chart.
 * @param {number[]} options.data - The data for this chart. Values can sum to
 * any number, and percentages will be calculated as needed.
 * @param {string} [options.title] - The title for this chart, set to the
 * `<title>` element for better accessibility.
 * @param {string} [options.description] - The description for this chart, set
 * to the `<desc>` element for better accessibility.
 * @param {boolean} [options.sorted] - Whether to sort the values.
 * @param {MapOptions} [options.map]
 * Controls for transforming data. See {@link MapOptions} for more details.
 * @param {number} [options.startAngle] - The initial rotation of the chart.
 * Angle values should fall between zero and one.
 * @param {number} [options.endAngle] - The final rotation of the chart.
 * Angle values should fall between zero and one.
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
 *
 * @example
 * shown.pie({
 *   title: "Gauge Chart",
 *   data: [60, 30, 10],
 *   startAngle: -0.33,
 *   endAngle: 0.33,
 *   map: {
 *     width: 0.4,
 *     key: ["Item 1", "Item 2", "Item 3"],
 *     attrs: (d) => ({ "data-value": d })
 *   }
 * });
 */
export default ({
  data,
  title,
  description,
  sorted = true,
  map,
  startAngle = 0,
  endAngle = 1,
}) => {
  if (!data || data.length === 0) return

  map = new Map({ width: () => 1, ...map }, data, { minValue: 0.05 })
  data = map(data)

  if (sorted) {
    data.sort((a, b) => (a.value === b.value ? 0 : a.value < b.value ? 1 : -1))
  }

  startAngle = (startAngle - 0.25) % 1
  endAngle = (endAngle - 0.25) % 1

  if (startAngle > endAngle) endAngle += 1

  const bounds = getBounds(startAngle, endAngle)

  const values = data.map((d) => d.value)
  const total = utils.sum(values)
  const scale = endAngle - startAngle

  const segments = data.map((d, i) => {
    const t = (d.value / total) * scale
    const o = startAngle + (utils.sum(values.slice(0, i)) / total) * scale

    const radius = (1 - d.width / 2) / 2
    const dashoffset = arc(-o, radius)
    const dasharray = [arc(t, radius), arc(1 - t, radius)].join(" ")

    const theta = tau * (o + t / 2)
    const shift = d.width === 1 && t < 0.25 ? 1.2 : 1

    const x = Math.cos(theta) * shift * radius
    const y = Math.sin(theta) * shift * radius

    return $.g({
      "class": `segment segment-${i}`,
      "aria-label": `${d.label} (${utils.percent(t)})`,
      "attrs": d.attrs,
    })([
      $.svg({
        viewBox: "0 0 100 100",
      })(
        $.circle({
          "class": "segment-arc",
          "role": "presentation",
          "r": utils.percent(radius),
          "stroke": d.color[0],
          "stroke-dasharray": dasharray,
          "stroke-dashoffset": dashoffset,
          "stroke-width": utils.percent(d.width / 2),
          "fill": "none",
        })
      ),
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
    })([
      $.div({
        class: "chart-pie-wrap",
        style: {
          "aspect-ratio": +(bounds.w / bounds.h).toFixed(3),
        },
      })(
        $.svg({
          class: "chart-pie-svg",
          xmlns: "http://www.w3.org/2000/svg",
          width: +bounds.w.toFixed(3),
          height: +bounds.h.toFixed(3),
        })([
          title && $.title()(title),
          description && $.desc()(description),
          $.svg({
            "x": utils.percent(0.5 - (bounds.x + bounds.w / 2) / bounds.w),
            "y": utils.percent(0.5 - (bounds.y + bounds.h / 2) / bounds.h),
            "width": utils.percent(1 / bounds.w),
            "height": utils.percent(1 / bounds.h),
            "role": "presentation",
            "text-anchor": "middle",
          })(segments),
        ])
      ),
      legendTemplate({ data }),
    ])
  )
}
