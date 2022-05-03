const sign = (x) => (x < 0 ? -1 : 1)

const slope = (x0, y0, x1, y1, x2, y2) => {
  const h0 = x1 - x0
  const h1 = x2 - x1
  const s0 = (y1 - y0) / (h0 || (h1 < 0 && -0))
  const s1 = (y2 - y1) / (h1 || (h0 < 0 && -0))
  const p = (s0 * h1 + s1 * h0) / (h0 + h1)

  return (
    (sign(s0) + sign(s1)) *
      Math.min(Math.abs(s0), Math.abs(s1), Math.abs(p) / 2) || 0
  )
}

const curve = (x0, y0, x1, y1, s0, s1) => {
  const dx0 = (x1 - x0) / 3
  const dx1 = (x1 - x0) / 3
  return ["C", x0 + dx0, y0 + dx0 * s0, x1 - dx1, y1 - dx1 * s1, x1, y1]
}

export default (points) => {
  const m = []

  let s0, s1
  let p0, p1, p2

  for (let i = 0; i < points.length; i++) {
    p0 = p1 || points[i - 1]
    p1 = p2 || points[i + 0]
    p2 = points[i + 1]

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
      m.push(...curve(x0, y0, x1, y1, s0, s1))
    }

    s0 = s1
  }

  return m
}
