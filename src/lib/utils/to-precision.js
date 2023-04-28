import { DEFAULT_PRECISION } from "./constants.js"

/**
 * Convert a value to a specified precision to avoid floating point errors
 * @private
 * @param {number} value
 * @param {number} [precision]
 * @returns {number} value
 */
export default (value, precision = DEFAULT_PRECISION) => {
  const f = Math.pow(10, precision)
  const n = precision < 0 ? value : 0.01 / f + value
  return Math.round(n * f) / f
}
