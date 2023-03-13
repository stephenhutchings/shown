import $ from "../lib/dom/index.js"
import wrap from "./wrap.js"
import symbolTemplate from "./symbol.js"

/**
 * Create a shape marker for a legend item
 * @private
 * @param {string} [type]
 * @param {string} color
 * @param {boolean} includeLine
 * @returns {Function}
 */
const shape = (type, color, includeLine) => {
  let symbol = ""

  if (type) {
    symbol = [
      includeLine &&
        $.line({
          x2: "100%",
          y1: "50%",
          y2: "50%",
        }),
      type !== "line" &&
        $.use({
          x: "50%",
          y: "50%",
          width: "1em",
          height: "1em",
          href: `#symbol-${type}`,
          class: "symbol",
        }),
    ]
  } else {
    symbol = $.rect({
      width: "100%",
      height: "100%",
    })
  }

  return $.svg({
    role: "presentation",
    class: "legend-marker",
    style: { color },
  })(symbol)
}

/**
 * Generate a chart legend.
 * @alias module:shown.legend
 * @param {Object} options
 * @param {LegendItem[]} options.data - Mapped data. See {@link LegendItem} for more details.
 * @param {boolean} [options.line] - Include a line with each symbol, for use
 * alongside a line chart.
 * @param {boolean} [options.wrap] - Wrap the template with `<div class="shown"
 * />` element. This is required when the legend is rendered separately to
 * ensure scoped styles are applied.
 * @param {boolean} [options.defs] - Include `<symbol>` definitions for shapes.
 * If `undefined`, this defaults to the same value as `wrap`. Symbol definitions
 * only need to be included once on any page.
 * @returns {string} Rendered legend
 *
 * @example
 * shown.legend({
 *   data: [
 *     { key: "Item 1", color: "#ea84e1", shape: "circle" },
 *     { key: "Item 2", color: "#7bcbf0", shape: "square" }
 *   ],
 *   line: true,
 *   wrap: true,
 * });
 */
export default ({
  data,
  line: includeLine = false,
  wrap: includeWrap = false,
  defs: includeDefs,
} = {}) => {
  if (!data) return

  includeDefs ??= includeWrap

  const keys = Object.values(
    data.flat().reduce((m, d) => {
      if (d.key && !m[d.key]) m[d.key] = d
      return m
    }, {})
  )

  if (keys && keys.length > 1) {
    const res = $.ul({
      class: "legend",
    })(
      keys.map((d) =>
        $.li()([
          shape(
            d.shape,
            Array.isArray(d.color) ? d.color[0] : d.color,
            includeLine
          ),
          $.span()(d.key),
        ])
      )
    )

    if (includeWrap) {
      const defs = includeDefs && symbolTemplate(data)

      return wrap([res, defs && $.svg({ display: "none" })($.defs()(defs))])
    } else {
      return res
    }
  } else {
    return ""
  }
}

/**
 * Charts render a {@link #legend|Legend} when needed, passing their internally
 * mapped data. When supplying data for a standalone legend, each item should
 * define these properties.
 * @typedef {Object} LegendItem
 * @property {string} key - Select the legend key for this item. A legend is
 * only rendered when there is more than one unique key.
 * @property {string|string[]} color - Select a color for this item. When an
 * array is passed, the first item in the array is used.
 * @property {string} [shape] - Select a shape for the legend item. Supported
 * shapes include `circle | square | triangle | diamond | cross`.
 */
