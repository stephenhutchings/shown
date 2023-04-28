import $ from "../lib/dom/index.js"
import percent from "../lib/utils/percent.js"
import sum from "../lib/utils/sum.js"
import interpolate from "../lib/utils/interpolate.js"
import { isFinite } from "../lib/utils/math.js"
import curve from "../lib/curve.js"
import Map from "../lib/map.js"
import legendTemplate from "./legend.js"
import symbolTemplate from "./symbol.js"
import { default as axisTemplate, setup as setupAxis } from "./axis.js"
import wrap from "./wrap.js"

const SVGLINE_VIEWPORT_W = 100
const SVGLINE_VIEWPORT_H = SVGLINE_VIEWPORT_W

/**
 * @private
 * @typedef {string[]} Color
 */

/**
 * @private
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 * @property {number} value
 * @property {boolean} tally
 * @property {string} curve
 * @property {string} shape
 * @property {string} key
 * @property {Color} color
 * @property {string} label
 */

/**
 * A line may include points with multiple curve types. This function
 * groups the points by curve type, renders these groups using their
 * respective curve functions, and joins them together into a path.
 * @private
 * @param {number[]} points
 * @param {Axis} xAxis
 * @param {Axis} yAxis
 * @param {boolean} showGaps
 * @returns {string} path
 */
const linePath = (points, xAxis, yAxis, showGaps) => {
  let path = points
    .reduce((m, d) => {
      const l = m[m.length - 1]

      if (!(isFinite(d.x) && isFinite(d.y))) {
        if (showGaps) {
          return [...m, { curve: d.curve, points: [] }]
        } else {
          return m
        }
      }

      const p = [
        SVGLINE_VIEWPORT_W * xAxis.scale(d.x),
        SVGLINE_VIEWPORT_H * (1 - yAxis.scale(d.y)),
      ]

      if (l) l.points.push(p)

      if (!l || l.curve !== d.curve) {
        return [...m, { curve: d.curve, points: [p] }]
      }

      return m
    }, [])
    .map((l) => {
      let args = []
      let path
      let type = l.curve

      // Some curve types allow other parameters to be passed to the curve
      // function. For example, setting the tension on "monotone" or "bump".
      if (Array.isArray(type)) {
        ;[type, ...args] = type
      }

      path = curve[type](l.points, ...args)

      return path
    })
    .join("")

  return path
}

/**
 * An area path is constructed using the linePath of the current and next line,
 * or the baseline when it is the final line.
 * @private
 * @param {number[]} line1
 * @param {number[]} line2
 * @param {Axis} xAxis
 * @param {Axis} yAxis
 * @returns {string} path
 */
const areaPath = (line1, line2, xAxis, yAxis) => {
  const path1 = linePath(line1, xAxis, yAxis, false)

  // The first path reverses along the baseline
  if (!line2) {
    return (
      path1 +
      `L${SVGLINE_VIEWPORT_W},${SVGLINE_VIEWPORT_H}L0,${SVGLINE_VIEWPORT_H}Z`
    )
  }

  // Some curves are asymmetric and need to be mirrored
  const mirror = {
    stepX: "stepY",
    stepY: "stepX",
  }

  line2 = line2
    .map((d) => ({
      ...d,
      curve: mirror[d.curve] || d.curve,
    }))
    .reverse()

  const path2 = linePath(line2, xAxis, yAxis, false)

  return path1 + "L" + path2.slice(1) + "Z"
}

/**
 * Generate a line chart.
 * @alias module:shown.line
 * @param {Object} options - Data and display options for the chart.
 * @param {any[]} options.data - The data for this chart. Data can
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
 * @param {Boolean} [options.showGaps]
 * Points in the line with non-finite values are rendered as broken lines
 * where data is unavailable. Set to `false` to skip missing values instead.
 * @param {Boolean} [options.area] Render the line chart as an area chart.
 * @param {boolean} [options.sorted] - Whether to sort the values.
 * @returns {string} Rendered chart
 *
 * @example
 * shown.line({
 *   title: "Custom axis",
 *   data: [
 *     -0.0327,  0.05811,  0.18046,  0.27504,  0.43335,  0.43815,
 *     0.54249,  0.57011,  0.54897,  0.60961,  0.58727,  0.53557,
 *     0.55060,      NaN,    null, undefined,    false,  0.02642,
 *     -0.0097,  -0.1826,  -0.2999,  -0.3352,  -0.4735,  -0.4642,
 *     -0.5720,  -0.6065,  -0.5761,  -0.5724,  -0.6096,  -0.5314,
 *     -0.4492,  -0.4007,  -0.3008,  -0.1924,  -0.0696,  0.00279,
 *   ],
 *   xAxis: { min: 1988, max: 2023 },
 *   yAxis: { ticks: 15, label: (v, i) => (i % 2 !== 0) && v.toFixed(1) },
 * })
 *
 * @example
 * shown.line({
 *   title: "Map x and y data",
 *   data: [{x: 0, y: 1}, {x: 1, y: -1}, {x: 2, y: 1}],
 *   map: {
 *     x: (d) => d.x,
 *     y: (d) => d.y,
 *     curve: "bump"
 *   }
 * })
 *
 * @example
 * shown.line({
 *   title: "Multiple lines, curves and shapes",
 *   data: [
 *      [52.86, 20.65, 14.54, 10.09, 41.86],
 *      [21.97, 31.71, 56.94, 17.85, 23.53],
 *      [ 6.73, 10.84, 37.62, 45.79, 53.32],
 *      [38.44, 50.79, 22.31, 31.82,  7.64],
 *   ],
 *   map: {
 *     curve: ["linear", "bump", "monotone", "stepX"],
 *     shape: ["circle", "square", "triangle", "diamond"],
 *     key: ["α", "β", "γ", "δ"],
 *   },
 *   xAxis: { label: ["A", "B", "C", "D", "E"], inset: 0.1 },
 * })
 */
export default ({
  data,
  title,
  description,
  map,
  showGaps = true,
  xAxis,
  yAxis,
  area = false,
  sorted = false,
}) => {
  data = Array.isArray(data[0]) ? data : [data]

  const maxLength = Math.max(...data.map((d) => d.length))

  map = new Map(
    {
      curve: () => "linear",
      shape: () => false,
      x: (d, i, j) => {
        const min = (xAxis || {}).min ?? 0
        const max = (xAxis || {}).max ?? min + (maxLength - 1)
        return min + (j / (maxLength - 1)) * (max - min)
      },
      y: (d) => d,
      ...map,
    },
    data.flat(),
    { minValue: -Infinity, colors: data.length }
  )

  data = map(data)

  if (sorted) {
    data.sort((al, bl) => {
      const a = sum(al)
      const b = sum(bl)

      return a === b ? 0 : a > b ? 1 : -1
    })
  }

  if (area) {
    const longest = data.find((line) => line.length === maxLength)

    // For lines with fewer points, continue along the baseline
    data.forEach((line) => {
      const curve = line.slice(-1)[0]?.curve

      while (line.length < maxLength) {
        line.push({
          x: longest[line.length]?.x,
          y: 0,
          curve,
        })
      }
    })

    // If a line is discontinuous at a point where the previous is not,
    // interpolate an average value for that point
    data.slice(1).forEach((next, j) => {
      const prev = data[j]

      const prevBase = interpolate(prev.map((d) => d.y))
      const nextBase = interpolate(next.map((d) => d.y))

      next.forEach((item, i) => {
        if (isFinite(prev[i]?.y) && !isFinite(item.y)) {
          item.y = nextBase[i]
        }

        if (isFinite(item.y)) {
          item.y += prevBase[i]
        }
      })
    })
  }

  // prettier-ignore
  const axes = {
    x: setupAxis( xAxis, data.flat().map((d) => d.x), false ),
    y: setupAxis( yAxis, data.flat().map((d) => d.y) )
  }

  const axisX = axisTemplate("x", axes.x)
  const axisY = axisTemplate("y", axes.y)
  const viewBox = `0 0 ${SVGLINE_VIEWPORT_W} ${SVGLINE_VIEWPORT_H}`

  const areas =
    area &&
    $.svg({
      class: "areas",
      viewBox,
      preserveAspectRatio: "none",
      style: (axes.x.hasOverflow || axes.y.hasOverflow) && "overflow: hidden;",
    })(
      data
        .filter((line) => line.length > 0)
        .reverse()
        .map((line, i, arr) =>
          $.path({
            "class": ["series", "series-" + i],
            "vector-effect": "non-scaling-stroke",
            "fill": line[0].color[0],
            "d": areaPath(line, arr[i + 1], axes.x, axes.y),
          })
        )
    )

  const lines = $.svg({
    class: "lines",
    viewBox,
    preserveAspectRatio: "none",
    style: (axes.x.hasOverflow || axes.y.hasOverflow) && "overflow: hidden;",
  })(
    data
      .filter((line) => line.length > 0)
      .map((line, i) =>
        $.path({
          "class": ["series", "series-" + i],
          "vector-effect": "non-scaling-stroke",
          "stroke": line[0].color[0],
          "fill": "none",
          "d": linePath(line, axes.x, axes.y, showGaps),
        })
      )
  )

  const symbols = $.svg({
    class: "symbols",
  })(
    data.map(
      (data, j) =>
        data.find((d) => d.shape) &&
        $.svg({
          class: ["series", "series-" + j],
          color: data[0]?.color[0],
        })(
          data.map((d) => {
            return (
              isFinite(d.x) &&
              isFinite(d.y) &&
              d.shape &&
              $.use({
                x: percent(axes.x.scale(d.x)),
                y: percent(1 - axes.y.scale(d.y)),
                href: `#symbol-${d.shape}`,
                width: "1em",
                height: "1em",
                class: "symbol",
                color: data[0].color[0] !== d.color[0] && d.color[0],
                attrs: d.attrs,
              })
            )
          })
        )
    )
  )

  const defs = symbolTemplate(data)

  return wrap(
    $.div({
      class: [
        "chart",
        area ? "chart-area" : "chart-line",
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
          areas,
          lines,
          symbols,
        ])
      ),
      legendTemplate({ data, line: true }),
    ])
  )
}
