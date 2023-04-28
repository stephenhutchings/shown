/**
 * Convert a value between 0 and 1 to a percentage string. The suffix is ignored
 * for zero. The precision is limited to reduce the size of the rendered SVG.
 * @private
 * @param {number} value
 * @param {string} [units]
 * @returns {string} percent
 */
export default (value, units = "%") =>
  value !== 0 ? +(value * 100).toFixed(2) + units : "0"
