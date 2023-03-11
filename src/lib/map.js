import { get as getColor, wrap } from "./colors.js"
import utils from "./utils.js"

/**
 * To render a chart, the data you supply is mapped to various
 * properties. `MapOptions` provides a flexible way to define how these
 * properties, like `value`, `label` and `color`, will be selected.
 *
 * Each option can be declared as a function. The function is passed the
 * original datum and indices that correspond to how deeply the datum is nested.
 *
 * However, it's often useful to use a shorthand syntax instead. If the
 * property is an array, the array item at the index corresponding to the
 * value's index is used. If the property is a string or number, that value is
 * used for all items in the data.
 *
 * For example, both of these declarations will return `"black"` for the first
 * item in the data and `"white"` for the second item.
 *
 * ```javascript
 * {
 *   color: function(d, i) { return ["black", "white"][i] },
 *   color: ["black", "white"]
 * }
 * ```
 *
 * @typedef {Object} MapOptions
 * @property {Function|number[]|number} [value]
 * Parse the raw value from the supplied data. This function is useful if your
 * data structure wraps each value in an object.
 * The default function returns the value unchanged.
 * @property {Function|number[]|number} [x]
 * Parse the x-axis value from the data. This function is useful if your
 * data structure wraps each value in an object.
 * The default function returns the index of the item, scaled between the `min`
 * and `max` value on the x-axis.
 * **Line and Scatter Chart only**
 * @property {Function|number[]|number} [y]
 * Parse the y-axis value from the data. This function is useful if your
 * data structure wraps each value in an object.
 * The default function returns the value of the item.
 * **Line and Scatter Chart only**
 * @property {Function|number[]|number} [r]
 * Parse the radial size from the data. This function is useful if you want to
 * visualise another dimension in the data. If the radius is not greater
 * than zero, the item isn't be rendered.
 * The default function returns a radial size of 1.
 * **Scatter Chart only**
 * @property {Function|string[]|string} [label]
 * Convert the data into a formatted string.
 * The default function returns the value fixed to the same number of decimals
 * as the most precise value in the dataset. Return `false` to prevent this
 * label from being rendered.
 * @property {Function|string[]|string} [tally]
 * Add an additional label summing the total values into a formatted string.
 * If true, the default function returns the value fixed to the same number of
 * decimals as the most precise value in the dataset. Return `false` to prevent
 * the tally from being rendered. When only a single series is present, the bar
 * chart defaults to using a tally rather than a label.
 * **Bar Chart only**
 * @property {Function|string[]|string} [color]
 * Select a color for the supplied data.
 * The default function returns evenly distributed colors from the default
 * palette. Return an array of two colors to change the color of the label.
 * @property {Function|string[]|string} [shape]
 * Select a shape for the supplied data.
 * Supported shapes include `circle | square | triangle`.
 * @property {Function|string[]|string} [curve]
 * Select a curve for the current line. Lines can include multiple curve types.
 * Supported curves include `linear | stepX | stepY | stepXMid | stepYMid |
 * monotone | bump`.
 * @property {Function|number[]|number} [width]
 * Change the size of the object. Return values should fall between 0 and 1.
 * @property {Function|string[]|string} [key]
 * Select the legend key for the supplied data. A legend is only rendered when
 * there is more than one unique key.
 * @property {Function|string[]|string} [series]
 * Select the series key for the supplied data.
 * **Bar Chart only**
 */

const defaults = {
  value: (v) => (v > 0 ? v : 0),
  tally: false,
}

// Recur down the tree, mapping each datum to an object with keys from the map.
const recur = (map, data, depth, indices = []) => {
  if (Array.isArray(data[0]) && (!depth || indices.length < depth - 1)) {
    return data.map((list, i) => recur(map, list, depth, [...indices, i]))
  } else {
    return data.map((d, i) =>
      Object.fromEntries(
        Object.entries(map).map(([k, v]) => [k, v(d, ...indices, i)])
      )
    )
  }
}

/**
 * @private
 * @param {MapOptions} options
 * @param {any[]} data
 * @param {Object} [overrides]
 * @param {number} [overrides.minValue]
 * @param {boolean} [overrides.sum]
 * @param {number} [overrides.maxDepth]
 * @returns {Function} converter
 */
const Map = function (
  options,
  data = [],
  { minValue = 0, sum = false, maxDepth } = {}
) {
  const map = Object.assign({}, defaults, options)

  // Maps may use a shorthand syntax by providing an array rather than a
  // function. In this case, the function is wrapped to ensure the map has
  // a consistent shape. Any other value that is not a function is also
  // wrapped in the same way, and simply returns the value.
  Object.entries(map).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      map[k] = (d, i) => v[i]
    } else if (typeof v !== "function") {
      map[k] = () => v
    }
  })

  const values = data.map((v) => (Array.isArray(v) ? v : [v]).map(map.value))
  const places = Math.min(
    Math.max(...values.flat().map(utils.decimalPlaces)),
    2
  )

  // A color function can return a background color, or an array of background
  // and foreground color. This wrapper ensures an array is always returned by
  // the color function.
  const base = map.color || ((v, i) => getColor(i / (data.length - 1)))
  map.color = wrap(base)

  // By default, a label will only show when it exceeds the minimum value
  // specified by a chart. It uses the largest number of decimal places found
  // across all values in the provided data.
  if (!map.label) {
    const max = Math.max(...(sum ? values.map(utils.sum) : values.flat()))

    map.label = (v) =>
      (v = map.value(v)) &&
      Number.isFinite(v) &&
      v / max >= minValue &&
      v.toFixed(places)
  }

  // The class returns a function which maps each datum to an object with
  // key/val pairs matching those found in the map options. If the value is
  // a function, it will be called with the datum and relevant indices. If
  // the value is an array, the item matching the first index is used.
  const convert = (data) => recur(map, data, maxDepth)

  // By default, a tally is formatted using the largest number of decimal
  // places found across all values in the provided data.
  if (map.tally() === true) {
    map.tally = (v) =>
      (v = map.value(v)) && Number.isFinite(v) && v.toFixed(places)
  }

  // The return function contains references to each mapping function in cases
  // where the defaults need to be accessed at other times
  Object.entries(map).forEach(([k, v]) => {
    convert[k] = v
  })

  return convert
}

export default Map
