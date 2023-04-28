import monotone from "./curve/monotone.js"
import bump from "./curve/bump.js"
import linear from "./curve/linear.js"
import { stepX, stepY, stepMidX, stepMidY } from "./curve/step.js"
import { isFinite } from "./utils/math.js"

const FIXED = 2

const finite = (line) => line.filter(([x, y]) => isFinite(x) && isFinite(y))

const toPath = (path, d) =>
  path +
  // Add spaces between consecutive numbers (unless negative)
  (d >= 0 && isFinite(+path.slice(-1)[0]) ? " " : "") +
  // Limit decimals in the path string
  (isFinite(d) ? +d.toFixed(FIXED) : d)

const wrap =
  (curve) =>
  (line, ...args) =>
    curve(finite(line), ...args).reduce(toPath, "")

export default {
  linear: wrap(linear),
  stepX: wrap(stepX),
  stepY: wrap(stepY),
  stepMidX: wrap(stepMidX),
  stepMidY: wrap(stepMidY),
  monotone: wrap(monotone),
  bump: wrap(bump),
}
