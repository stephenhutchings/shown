import { DEFAULT_PRECISION } from "./constants.js"
import { pow } from "./math.js"

/**
 * Add the values in an array, reading `item.value` where present.
 * @private
 * @param {Array} array
 * @returns {number} total
 */
export default (array, precision = DEFAULT_PRECISION) => {
  const f = pow(10, precision)
  return array.reduce(
    (m, v = 0) => (f * m + f * ((v && v.value) || +v || 0)) / f,
    0
  )
}
