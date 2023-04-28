import { min, abs, clamp } from "../utils/math.js"

const TENSION = 1 / 3

const sign = (v) => (v < 0 ? -1 : 1)

const slope = (x0, y0, x1, y1, x2, y2) => {
  const h0 = x1 - x0
  const h1 = x2 - x1
  const s0 = (y1 - y0) / (h0 || (h1 < 0 && -0))
  const s1 = (y2 - y1) / (h1 || (h0 < 0 && -0))
  const p = (s0 * h1 + s1 * h0) / (h0 + h1)

  return (sign(s0) + sign(s1)) * min(abs(s0), abs(s1), abs(p) / 2) || 0
}

const curve = (x0, y0, x1, y1, s0, s1, alpha) => {
  const ratio = abs((y1 - y0) / (x1 - x0))
  const scale = clamp(ratio, 1, 1.5)
  const delta = (x1 - x0) * alpha * scale

  return ["C", x0 + delta, y0 + delta * s0, x1 - delta, y1 - delta * s1, x1, y1]
}

export default (points, alpha = TENSION) => {
  const m = []

  let s0, s1
  let p0, p1, p2

  for (let i = 0; i < points.length; i++) {
    p0 = p1 || points[i - 1]
    p1 = p2 || points[i + 0]
    p2 = points[i + 1]

    if (!p0 && !p2) {
      return m
    }

    if (!p0) {
      p0 = [p1[0] - (p2[0] - p1[0]) / 2, p1[1] - (p2[1] - p1[1]) / 2]
    }

    if (!p2) {
      p2 = [p1[0] + (p1[0] - p0[0]) / 2, p1[1] + (p1[1] - p0[1]) / 2]
    }

    const [x0, y0] = p0
    const [x1, y1] = p1
    const [x2, y2] = p2

    s1 = slope(x0, y0, x1, y1, x2, y2)

    if (i === 0) {
      m.push("M", x1, y1)
    } else if (x0 !== x1 || y0 !== y1) {
      m.push(...curve(x0, y0, x1, y1, s0, s1, alpha))
    }

    s0 = s1
  }

  return m
}
