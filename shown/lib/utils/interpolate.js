import { isFinite } from "./math.js"

/**
 * Interpolate non-finite values in an array
 * @private
 * @param {any[]} values
 * @returns {number[]}
 */
export default (values) => {
  let count = 0

  return values.reduce((stack, next, i) => {
    if (isFinite(next) || i === values.length - 1) {
      next = next ?? stack.at(-1)

      if (count > 0) {
        const prev = stack.at(-1) ?? next
        const delta = 1 / (count + 1)
        const index = stack.length

        while (count > 0) {
          const t = delta * count
          const v = prev + (next - prev) * t
          stack.splice(index, 0, v)
          count--
        }
      }

      stack.push(next)
    } else {
      count++
    }

    return stack
  }, [])
}
