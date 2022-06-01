import $ from "../lib/dom/index.js"
import utils from "../lib/utils.js"
import Map from "../lib/map.js"
import legendTemplate from "./legend.js"
import symbolTemplate from "./symbol.js"
import { default as axisTemplate, setup as setupAxis } from "./axis.js"
import wrap from "./wrap.js"

/**
 * Generate a scatter chart.
 * @param {Object} options - Data and display options for the chart.
 * @param {Array[]} options.data - The data for this chart. Data can
 * be passed either as an array of `[x, y]` points, or nested arrays
 * for multiple series.
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
 * shown.scatter({
 *   data: [
 *     [[ 77,  67], [389, 416], [352, 319], [190, 147], [228, 240], [ 25,  39]],
 *     [[422, 450], [292, 278], [108, 126], [461, 453], [425, 392], [226, 205]],
 *     [[113, 141], [317, 291], [356, 357], [349, 302], [161, 192], [424, 419]],
 *     [[137, 130], [400, 430], [377, 322], [ 30,  48], [131,  56], [268, 258]],
 *     [[357, 361], [251, 192], [175, 187], [404, 352], [128, 109], [120, 157]],
 *     [[ 65,  99], [235, 170], [204, 161], [220, 214], [252, 244], [ 44,  97]]
 *   ]
 * })
 *
 * @example
 * shown.scatter({
 *   data: [
 *     {x: 11, y: 14}, {x: 32, y: 23}, {x: 25, y: 34}, {x: 45, y: 43},
 *     {x: 31, y: 24}, {x: 31, y: 28}, {x: 29, y: 19}, {x: 40, y: 33},
 *     {x: 21, y: 34}, {x: 21, y: 38}, {x: 39, y: 29}, {x: 30, y: 33}
 *   ],
 *   map: {
 *     x: (d) => d.x,
 *     y: (d) => d.y,
 *   },
 *   xAxis: { min: 0, line: (v) => v === 0 || v === 50 },
 *   yAxis: { min: 0, line: (v) => v === 0 || v === 50 },
 * })
 *
 */

export default ({ data, title, description, map, xAxis, yAxis }) => {
  data = Array.isArray(data[0][0]) ? data : [data]

  map = new Map(
    {
      shape: () => "circle",
      x: (d) => d[0],
      y: (d) => d[1],
      r: 1,
      ...map,
    },
    data,
    { minValue: -Infinity, maxDepth: 2 }
  )

  data = map(data)

  // prettier-ignore
  const axes = {
    x: setupAxis( xAxis, data.flat().map((d) => d.x) ),
    y: setupAxis( yAxis, data.flat().map((d) => d.y) )
  }

  const axisX = axisTemplate("x", axes.x)
  const axisY = axisTemplate("y", axes.y)

  const symbols = $.svg({
    class: "symbols",
  })(
    data.map((data, j) =>
      $.svg({
        "class": ["series", "series-" + j],
        "width": "100%",
        "height": "100%",
        "text-anchor": "middle",
      })(
        data.map(
          (d) =>
            d.r > 0 &&
            d.shape &&
            $.use({
              x: utils.percent(axes.x.scale(d.x)),
              y: utils.percent(1 - axes.y.scale(d.y)),
              href: `#symbol-${d.shape}`,
              fill: d.color[0],
              width: `${d.r}em`,
              height: `${d.r}em`,
              class: "symbol",
            })
        )
      )
    )
  )

  const defs = symbolTemplate(data)

  return wrap(
    $.div({
      class: [
        "chart",
        "chart-scatter",
        axes.x.label && "has-xaxis xaxis-w" + axes.x.width,
        axes.y.label && "has-yaxis yaxis-w" + axes.y.width,
      ],
    })([
      $.div({
        style: {
          "flex-grow": 1,
          "height": 0,
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
          axisY,
          axisX,
          symbols,
        ])
      ),
      legendTemplate(data),
    ])
  )
}
