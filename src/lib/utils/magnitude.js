/**
 * Calculate the magnitude of a number (power of 10)
 * @private
 * @param {number} n
 * @returns {number}
 */
export default (n) => Math.floor(Math.log10(Math.abs(n)))
