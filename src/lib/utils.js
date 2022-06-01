const DEFAULT_PRECISION = Math.ceil(Math.abs(Math.log10(Number.EPSILON))) - 1

/**
 * Add the values in an array, reading `item.value` where present.
 * @private
 * @param {Array} array
 * @returns {number} total
 */
const sum = (array, precision = DEFAULT_PRECISION) => {
  const f = Math.pow(10, precision)
  return array.reduce((m, v = 0) => (f * m + f * ((v && v.value || +v) || 0))
}

/**
 * Convert a value between 0 and 1 to a percentage string.
 * @private
 * @param {number} value
 * @param {string} [units]
 * @returns {string} percent
 */
const percent = (value, units = "%") => +(value * 100).toFixed(2) + units

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
const decimalPlaces = (value) => {
  const s = (+value).toString()
  const ie = s.indexOf("e")
  const id = s.indexOf(".")

  // Get exponent in exponential notation eg "1e-6"
  const e = ie > -1 ? s.slice(ie + 2) * (s[ie + 1] === "-" ? 1 : -1) : 0

  // Subtract index of period from length of string, excluding exponent
  const d = id > -1 ? (ie > -1 ? ie : s.length) - id - 1 : 0

  return Math.max(0, e + d)
}

export default {
  sum,
  percent,
  toPrecision,
  decimalPlaces,
}
