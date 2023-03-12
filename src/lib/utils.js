const DEFAULT_PRECISION = Math.ceil(Math.abs(Math.log10(Number.EPSILON))) - 1

/**
 * Add the values in an array, reading `item.value` where present.
 * @private
 * @param {Array} array
 * @returns {number} total
 */
const sum = (array, precision = DEFAULT_PRECISION) => {
  const f = Math.pow(10, precision)
  return array.reduce(
    (m, v = 0) => (f * m + f * ((v && v.value) || +v || 0)) / f,
    0
  )
}

/**
 * Convert a value between 0 and 1 to a percentage string. The suffix is ignored
 * for zero.
 * @private
 * @param {number} value
 * @param {string} [units]
 * @returns {string} percent
 */
const percent = (value, units = "%") =>
  value !== 0 ? +(value * 100).toFixed(2) + units : "0"

/**
 * Convert a value to a specified precision to avoid floating point errors
 * @private
 * @param {number} value
 * @param {number} [precision]
 * @returns {number} value
 */
const toPrecision = (value, precision = DEFAULT_PRECISION) => {
  const f = Math.pow(10, precision)
  const n = precision < 0 ? value : 0.01 / f + value
  return Math.round(n * f) / f
}

/**
 * Counts the number of decimal places specified by a number
 * @private
 * @param {number} value
 * @returns {number} decimals places
 */
const decimalPlaces = (n, precision = DEFAULT_PRECISION) => {
  let count = 0
  n = Math.abs(n)

  while (toPrecision(n % 1, precision) > 0 && count < precision) {
    count++
    n *= 10
  }

  return count
}

/**
 * Calculate the magnitude of a number (power of 10)
 * @private
 * @param {number} n
 * @returns {number}
 */
const magnitude = (n) => Math.floor(Math.log10(Math.abs(n)))

export default {
  sum,
  percent,
  toPrecision,
  decimalPlaces,
  magnitude,
}
