import { DEFAULT_PRECISION } from "./constants.js"
import { pow, round } from "./math.js"

/**
 * Convert a value to a specified precision to avoid floating point errors
 * @private
 * @param {number} value
 * @param {number} [precision]
 * @returns {number} value
 */
export default (value, precision = DEFAULT_PRECISION) => {
  const f = pow(10, precision)
  const n = precision < 0 ? value : 0.01 / f + value
  return round(n * f) / f
}
