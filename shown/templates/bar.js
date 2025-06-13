import $ from "../lib/dom/index.js"
import { get as getColor } from "../lib/color.js"
import sum from "../lib/utils/sum.js"
import percent from "../lib/utils/percent.js"
import Map from "../lib/map.js"
import legendTemplate from "./legend.js"
import { default as axisTemplate, setup as setupAxis } from "./axis.js"
import { max } from "../lib/utils/math.js"
import wrap from "./wrap.js"

/**
 * Generate a bar chart.
 * @alias module:shown.bar
 * @param {Object} options - Data and display options for the chart.
 * @param {any[]} options.data - The data for this chart. Data can
 * be passed either as a flat array of numbers, or a array of arrays for a
 * stacked bar chart.
 * @param {string} [options.title] - The title for this chart, set to the
 * `<title>` element for better accessibility.
 * @param {string} [options.description] - The description for this chart, set
 * to the `<desc>` element for better accessibility.
 * @param {MapOptions} [options.map]
 * Controls for transforming data. See {@link MapOptions} for more details.
 * @param {Boolean} [options.stack]
 * Whether to stack nested values or render them side-by-side. If values are
 * nested three-levels deep, items will always be stacked.
 * @param {AxisOptions} [options.xAxis]
 * Overrides for the x-axis. See {@link AxisOptions} for more details.
 * @param {AxisOptions} [options.yAxis]
 * Overrides for the y-axis. See {@link AxisOptions} for more details.
 * @returns {string} Rendered chart
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
 *   map: { key: ["A", "B"] },
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
 *     width: (v) => v === 30.64 ? 0.8 : 0.6,
 *     label: (v) => v === 30.64 ? v.toFixed(1) : false,
 *     key: ["A", "B", "C", "D", "E"],
 *   },
 *   stack: true,
 *   xAxis: { label: ["I", "II", "III"] }
 * })
 *
 * @example
 * shown.bar({
 *   title: "Stacked Series",
 *   data: [
 *     [
 *       [10.65, 14.54],
 *       [18.53, 11.71],
 *       [14.79, 30.64],
 *     ], [
 *       [10.09, 21.86],
 *       [17.85, 19.94],
 *       [18.31, 11.82],
 *     ]
 *   ],
 *   map: {
 *     key: ["In", "Out"],
 *     series: ["A", "B", "C"],
 *     value: Math.round,
 *     tally: true,
 *     label: true,
 *     attrs: (d) => ({ "data-value": d })
 *   },
 *   xAxis: { label: ["I", "II"] }
 * })
 */

export default ({
  data,
  title,
  description,
  map,
  stack = false,
  xAxis,
  yAxis,
}) => {
  // If the data is only one-level deep, it needs an initial wrapper
  data = data.map((v) => (Array.isArray(v) ? v : [v]))

  // If the data is only two-levels deep, wrap based on the `stack` option
  if (data.length && !Array.isArray(data[0][0])) {
    data = stack ? data.map((d) => [d]) : data.map((d) => d.map((d) => [d]))
  } else {
    stack = true
  }

  const maxStack = max(...data.flat(1).map((d) => d.length))
  const maxSeries = max(...data.map((d) => d.length))

  // For unstacked charts, tally results rather than label.
  if (maxStack === 1 && (!map || !map.label)) {
    map = {
      label: false,
      tally: true,
      ...map,
    }
  }

  // Being triple-nested, bar charts need help to make an intuitive choice about
  // which index to use when picking an item from an array.
  if (Array.isArray(map?.key)) {
    const arr = map.key
    map.key = (v, k, j, i) => arr[maxStack > 1 ? i : j]
  }

  if (Array.isArray(map?.series)) {
    const arr = map.series
    map.series = (v, k, j) => arr[j]
  }

  if (Array.isArray(map?.color)) {
    const arr = map.color
    map.color = (v, k, j, i) => arr[maxStack > 1 ? i : j]
  }

  map = new Map(
    {
      // Other charts use the shallow index, but bar charts select a color
      // from the deepest index, or second deepest if unstacked.
      color: (v, k, j, i) => {
        return getColor(
          maxStack === 1 ? j / (maxSeries - 1) : i / (maxStack - 1)
        )
      },
      width: 0.6,
      ...map,
    },
    stack ? data.flat().map((d) => sum(d)) : data.flat(2),
    { minValue: 0.05 }
  )

  data = map(data)

  const maxWidth = max(...data.flat(2).map((d) => d.width))
  const values = data.flat().map((d) => sum(d))

  xAxis = {
    ticks: data.length,
    hasSeries: data
      .flat(2)
      .map((d) => d.series)
      .some((f) => f),
    group: true,
    line: maxSeries > 1,
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

  const bars = $.svg({ class: "values" })(
    data.map((series, k) =>
      $.svg({
        x: data.length > 1 && percent(axes.x.scale(k - 0.5)),
        width: percent(data.length > 1 ? axes.x.scale(1) - axes.x.scale(0) : 1),
        class: ["group", "group-" + k],
      })(
        series.map((stack, j) => {
          const g = (1 - maxWidth) / (maxSeries + 2)
          const w = maxWidth / maxSeries
          const x = g * (j + 1.5) + w * (j + 0.5)

          const tally = map.tally(sum(stack))

          return $.svg({
            class: ["series", "series-" + j],
            x: percent(x),
            width: percent(w),
          })([
            ...stack.map((d, i) => {
              if (!d.value) return

              const w = d.width / maxWidth
              const h = axes.y.scale(d.value)
              const y = axes.y.scale(axes.y.max - sum(stack.slice(0, i + 1)))

              const rect = $.rect({
                x: percent(-w / 2),
                y: percent(y),
                height: percent(h),
                width: percent(w),
                fill: d.color[0],
              })

              const text =
                d.label &&
                $.text({
                  y: percent(y + h / 2),
                  color: d.color[1],
                })(d.label)

              return $.svg({
                "class": ["value", "value-" + i],
                "attrs": d.attrs,
                "dominant-baseline": "central",
              })([rect, text])
            }),
            tally &&
              $.text({
                y: percent(axes.y.scale(axes.y.max - sum(stack))),
                dy: "-0.5em",
              })(tally),
            stack[0] &&
              stack[0].series &&
              $.text({
                class: "series-label",
                y: "100%",
                dy: "1.5em",
              })(stack[0].series),
          ])
        })
      )
    )
  )

  return wrap(
    $.div({
      class: [
        "chart",
        "chart-bar",
        axes.x.label && "has-xaxis xaxis-w" + axes.x.width,
        axes.y.label && "has-yaxis yaxis-w" + axes.y.width,
        axes.x.hasSeries && "has-series",
      ],
    })([
      $.div({
        style: {
          "flex-grow": 1,
          "height": 0,
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
      legendTemplate({ data: data.flat() }),
    ])
  )
}
