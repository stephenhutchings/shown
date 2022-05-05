import $ from "../lib/dom/index.js"
import utils from "../lib/utils.js"
import curve from "../lib/curve.js"
import Map from "../lib/map.js"
import legendTemplate from "./legend.js"
import symbolTemplate from "./symbol.js"
import { default as axisTemplate, setup as setupAxis } from "./axis.js"
import wrap from "./wrap.js"

const SVGLINE_VIEWPORT_W = 100
const SVGLINE_VIEWPORT_H = SVGLINE_VIEWPORT_W

// A line may include points with multiple curve types. This function
// groups the points by curve type, renders these groups using their
// respective curve functions, and joins them together into a path.
const linePath = (points, toPoint) =>
  points
    .reduce((m, d, i) => {
      const l = m[m.length - 1]
      const p = toPoint(d, i)

      if (!p) {
        // TODO: Get intersection with bounds
        return [...m, { curve: d.curve, points: [] }]
      }

      if (l) l.points.push(p)

      if (!l || l.curve !== d.curve) {
        return [...m, { curve: d.curve, points: [p] }]
      }

      return m
    }, [])
    .map((l) => {
      let args = []

      if (Array.isArray(l.curve)) {
        ;[l.curve, ...args] = l.curve
      }
      return curve[l.curve](l.points, ...args)
    })
    .join("")

/**
 * Generate a line chart.
 * @param {Object} options - Data and display options for the chart.
 * @param {number[]|Array[]} options.data - The data for this chart. Data can
 * be passed either as a flat array for a single line, or nested arrays
 * for multiple lines.
 * @param {string} [options.title] - The title for this chart, set to the
 * `<title>` element for better accessibility.
 * @param {string} [options.description] - The description for this chart, set
 * to the `<desc>` element for better accessibility.
 * @param {MapOptions} [options.map]
 * Controls for transforming data. See {@link MapOptions} for more details.
 * @param {AxisOptions} [options.xAxis]
 * Overrides for the x-axis. See {@link AxisOptions} for more details.
 * @param {AxisOptions} [options.yAxis]
 * Overrides for the y-axis. See {@link AxisOptions} for more details.
 * @returns {string} Rendered chart
 *
 * @example
 * shown.line({
 *   data: [
 *     -0.0327,  0.05811,  0.18046,  0.27504,  0.43335,  0.43815,
 *     0.54249,  0.57011,  0.54897,  0.60961,  0.58727,  0.53557,
 *     0.55060,      NaN,    null, undefined,    false,  0.02642,
 *     -0.0097,  -0.1826,  -0.2999,  -0.3352,  -0.4735,  -0.4642,
 *     -0.5720,  -0.6065,  -0.5761,  -0.5724,  -0.6096,  -0.5314,
 *     -0.4492,  -0.4007,  -0.3008,  -0.1924,  -0.0696,  0.00279,
 *   ],
 *   xAxis: { ticks: 6, min: 1988, max: 2023 },
 *   yAxis: { ticks: 15, label: v => (v * 10 % 2 === 0) && v.toFixed(1) },
 * })
 *
 * @example
 * shown.line({
 *   title: "Line Chart",
 *   data: [
 *      [52.86, 10.65, 14.54, 10.09, 41.86],
 *      [21.97, 31.71, 56.94, 17.85, 23.53],
 *      [ 6.73, 20.84, 37.62, 45.79, 53.32],
 *      [34.44, 54.79, 22.31, 31.82,  7.64],
 *   ],
 *   map: {
 *     curve: ["linear", "bump", "monotone", "stepX"],
 *     shape: ["circle", "square", "triangle", "diamond"],
 *     key: ["α", "β", "γ", "δ"]
 *   },
 *   xAxis: { label: ["A", "B", "C", "D", "E"], inset: 0.1 },
 * })
 */

export default ({ data, title, description, map, xAxis, yAxis }) => {
  data = Array.isArray(data[0]) ? data : [data]

  map = new Map(
    {
      curve: () => "linear",
      shape: () => false,
      ...map,
    },
    data,
    { minValue: -Infinity }
  )

  data = map(data)

  const length = data[0].length

  const values = data.flat().map((d) => d.value)
  yAxis = setupAxis(yAxis, values)
  const axisY = axisTemplate("y", yAxis)

  xAxis = setupAxis({ ticks: length, ...xAxis })
  const axisX = axisTemplate("x", xAxis)

  const padX = (t) => xAxis.inset + (1 - xAxis.inset * 2) * t
  const padY = (t) => yAxis.inset + (1 - yAxis.inset * 2) * t

  const fx = (i) => padX(i / (length - 1))
  const fy = (y) => padY((y - yAxis.min) / (yAxis.max - yAxis.min))

  const lines = $.svg({
    width: "100%",
    height: "100%",
    viewBox: `0 0 ${SVGLINE_VIEWPORT_W} ${SVGLINE_VIEWPORT_H}`,
    preserveAspectRatio: "none",
    style: "overflow: hidden;",
  })(
    data.map((line) =>
      $.path({
        "vector-effect": "non-scaling-stroke",
        "stroke": line[0].color[0],
        "fill": "none",
        "d": linePath(
          line,
          (d, i) =>
            Number.isFinite(d.value) && [
              SVGLINE_VIEWPORT_W * fx(i),
              SVGLINE_VIEWPORT_H * (1 - fy(d.value)),
            ]
        ),
      })
    )
  )

  const labels = data.map((data, j) =>
    $.svg({
      "class": "stack",
      "width": "100%",
      "height": "100%",
      "text-anchor": "middle",
    })(
      data.map((d, i) => {
        // d.label && $.text()(d.label),
        return (
          d.shape &&
          $.use({
            x: utils.percent(fx(i)),
            y: utils.percent(1 - fy(d.value)),
            href: `#symbol-${d.shape}`,
            fill: d.color[0],
            width: "1em",
            height: "1em",
            class: "symbol",
          })
        )
      })
    )
  )

  const defs = symbolTemplate(data)

  return wrap(
    $.div({
      class: "chart chart-line",
    })([
      $.div({
        style: {
          "flex-grow": 1,
          "height": 0,
          "padding-top": "0.5em",
          "padding-left": yAxis && "2em",
          "padding-bottom": xAxis ? "1.5em" : "0.5em",
          "box-sizing": "border-box",
        },
      })(
        $.svg({
          xmlns: "http://www.w3.org/2000/svg",
          width: "100%",
          height: "100%",
        })([
          defs && $.defs()(defs),
          title && $.title()(title),
          description && $.desc()(description),
          $.g()([axisY, axisX]),
          lines,
          labels,
        ])
      ),
      legendTemplate(data),
    ])
  )
}
