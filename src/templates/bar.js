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
 * @param {Boolean} [options.stack]
 * Whether to stack nested values or render them side-by-side.
 * @returns {string} Rendered chart
 *
 *
 * @example
 * shown.bar({
 *   data: [
 *      3.57773343,
 *      5.72659784,
 *      0.93839406,
 *      4.13082349,
 *      3.12045823,
 *   ],
 * })
 *
 * @example
 * shown.bar({
 *   title: "Bar Chart",
 *   data: [
 *      [6286, 1065],
 *      [4197, 1853],
 *      [3444, 1479],
 *   ],
 *   map: {
 *     key: ["A", "B"],
 *   },
 *   xAxis: { label: ["I", "II", "III"] }
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
 *   stack: true,
 *   xAxis: { label: ["I", "II", "III"] }
 * })
 */

export default ({
  data,
  title,
  description,
  map,
  xAxis,
  yAxis,
  stack = false,
}) => {
  data = data.map((v) => (Array.isArray(v) ? v : [v]))

  const maxLength = Math.max(...data.map((d) => d.length))

  map = new Map(
    {
      color: (v, i, j) => getColor(i / (maxLength - 1)),
      width: () => 0.75,
      ...map,
    },
    data,
    { sum: stack, minValue: 0.05 }
  )

  data = data.map(map)

  const maxWidth = Math.max(...data.flat().map((d) => d.width))
  const barWidth = (1 / data.length) * maxWidth
  const barGap = (1 - barWidth * data.length) / (data.length + 1)

  const values = stack ? data.map(utils.sum) : data.flat().map((d) => d.value)

  xAxis = {
    ticks: data.length,
    inset: barGap + barWidth / 2,
    group: true,
    ...xAxis,
  }

  yAxis = {
    min: 0,
    ...yAxis,
  }

  const axes = {
    x: setupAxis(xAxis),
    y: setupAxis(yAxis, values),
  }

  const axisX = axisTemplate("x", axes.x)
  const axisY = axisTemplate("y", axes.y)

  let bars

  if (stack) {
    bars = $.g({ class: "series" })(
      data.map((data, j) =>
        $.svg({
          x: utils.percent(axes.x.scale(j) - barWidth / 2),
          width: utils.percent(barWidth),
          height: "100%",
          class: "stack",
        })(
          data.map((d, i) => {
            const h = axes.y.scale(d.value)
            const y = axes.y.scale(axes.y.max - utils.sum(data.slice(0, i + 1)))

            const x = (1 - d.width) / 2
            const w = d.width

            return $.g()([
              $.rect({
                width: utils.percent(w),
                height: utils.percent(h),
                x: utils.percent(x),
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
  } else {
    bars = $.g({ class: "series" })(
      data.map((data, j) =>
        $.svg({
          x: utils.percent(axes.x.scale(j) - barWidth / 2),
          width: utils.percent(barWidth),
          height: "100%",
          class: "group",
        })(
          data.map((d, i) => {
            const h = axes.y.scale(d.value)
            const y = 1 - h

            const x = (i + 0.5) / data.length
            const w = d.width / data.length

            return $.svg({
              x: utils.percent(x),
            })([
              $.rect({
                x: utils.percent(-w / 2),
                y: utils.percent(y),
                width: utils.percent(w),
                height: utils.percent(h),
                fill: d.color[0],
              }),
              d.label &&
                $.text({
                  y: utils.percent(y),
                  dy: "-0.5em",
                })(d.label),
            ])
          })
        )
      )
    )
  }

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
          "text-anchor": "middle",
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
