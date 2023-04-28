import monotone from "./curve/monotone.js"
import bump from "./curve/bump.js"
import linear from "./curve/linear.js"
import { stepX, stepY, stepMidX, stepMidY } from "./curve/step.js"
import { isFinite } from "./utils/math.js"

const FIXED = 2

const filter = (p) => isFinite(p[0]) && isFinite(p[1])

const wrap =
  (fn) =>
  (p, ...args) =>
    fn(p.filter(filter), ...args)
      .map(
        (v, i, a) =>
          (isFinite(v) && isFinite(a[i - 1]) ? " " : "") +
          (isFinite(v) ? +v.toFixed(FIXED) : v)
      )
      .join("")

export default {
  linear: wrap(linear),
  stepX: wrap(stepX),
  stepY: wrap(stepY),
  stepMidX: wrap(stepMidX),
  stepMidY: wrap(stepMidY),
  monotone: wrap(monotone),
  bump: wrap(bump),
}
