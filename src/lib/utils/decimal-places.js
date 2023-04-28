import { DEFAULT_PRECISION } from "./constants.js"
import toPrecision from "./to-precision.js"

/**
 * Counts the number of decimal places specified by a number
 * @private
 * @param {number} value
 * @returns {number} decimals places
 */
export default (n, precision = DEFAULT_PRECISION) => {
  let count = 0
  n = Math.abs(n)

  while (toPrecision(n % 1, precision) > 0 && count < precision) {
    count++
    n *= 10
  }

  return count
}
