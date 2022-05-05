import $ from "../lib/dom/index.js"
import { get as getColor } from "../lib/colors.js"
import utils from "../lib/utils.js"
import Map from "../lib/map.js"
import legendTemplate from "./legend.js"
import { default as axisTemplate, setup as setupAxis } from "./axis.js"
import wrap from "./wrap.js"

/**
 * Generate a bar chart.
 * @param {Object} options - Data and display options for the chart.
 * @param {number[]|Array[]} options.data - The data for this chart. Data can
 * be passed either as a flat array of numbers, or a array of arrays for a
 * stacked bar chart.
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
 *
 * @example
 * shown.bar({
 *   data: [
 *      0.357773343,
 *      0.572659784,
 *      0.093839406,
 *      0.413082349,
 *      0.312045823,
 *   ],
 * })
 *
 * @example
 * shown.bar({
 *   title: "Bar Chart",
 *   data: [
 *      [62.86, 10.65, 14.54, 10.09, 1.86],
 *      [41.97, 18.53, 11.71, 17.85, 9.94],
 *      [34.44, 14.79, 30.64, 18.31, 1.82],
 *   ],
 *   map: {
 *     width: (v, i) => v === 30.64 ? 0.8 : 0.6,
 *     label: (v, i) => v === 30.64 ? v.toFixed(1) : false,
 *     key: (v, i) => ["A", "B", "C", "D", "E"][i],
 *   },
 *   xAxis: { label: ["I", "II", "III"] }
 * })
 */

export default ({ data, title, description, map, xAxis, yAxis }) => {
  data = data.map((v) => (Array.isArray(v) ? v : [v]))
  map = new Map(
    {
      color: (v, i, j) => getColor(i / (data[0].length - 1)),
      width: () => 0.75,
      ...map,
    },
    data,
    { sum: true, minValue: 0.05 }
  )
  data = data.map(map)

  const maxWidth = Math.max(...data.flat().map((d) => d.width))
  const barWidth = (1 / data.length) * maxWidth
  const barGap = (1 - barWidth * data.length) / (data.length + 1)

  const values = data.map(utils.sum)
  yAxis = setupAxis(yAxis, values)
  const axisY = axisTemplate("y", yAxis)

  xAxis = setupAxis({
    ticks: values.length,
    inset: barGap + barWidth / 2,
    ...xAxis,
  })
  const axisX = axisTemplate("x", xAxis)

  const fx = (i) => barGap + i * (barWidth + barGap)
  const fy = (y) => (y - yAxis.min) / (yAxis.max - yAxis.min)

  const bars = $.g({ class: "series" })(
    data.map((data, j) =>
      $.svg({
        "x": utils.percent(fx(j)),
        "width": utils.percent(barWidth),
        "height": "100%",
        "text-anchor": "middle",
        "class": "stack",
      })(
        data.map((d, i) => {
          const h = fy(d.value)
          const y = fy(yAxis.max - utils.sum(data.slice(0, i + 1)))

          return $.g()([
            $.rect({
              width: utils.percent(d.width),
              height: utils.percent(h),
              x: utils.percent((1 - d.width) / 2),
              y: utils.percent(y),
              fill: d.color[0],
            }),
            d.label &&
              $.text({
                y: utils.percent(y + h / 2),
                x: "50%",
                dy: "0.33em",
                color: d.color[1],
              })(d.label),
          ])
        })
      )
    )
  )

  return wrap(
    $.div({
      class: "chart chart-bar",
    })([
      $.div({
        style: {
          "flex-grow": 1,
          "height": 0,
          "padding-top": "0.5em",
          "padding-left": "2em",
          "padding-bottom": axisX ? "1.5em" : "0.5em",
          "box-sizing": "border-box",
        },
      })(
        $.svg({
          xmlns: "http://www.w3.org/2000/svg",
          width: "100%",
          height: "100%",
        })([
          title && $.title()(title),
          description && $.desc()(description),
          axisX,
          axisY,
          bars,
        ])
      ),
      legendTemplate(data),
    ])
  )
}
