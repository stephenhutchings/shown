import { floor, log10, abs } from "./math.js"
/**
 * Calculate the magnitude of a number (power of 10)
 * @private
 * @param {number} n
 * @returns {number}
 */
export default (n) => floor(log10(abs(n)))
