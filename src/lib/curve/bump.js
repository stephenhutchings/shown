const TENSION = 0.4

export default (points, alpha = TENSION) =>
  points.reduce((m, p1, i) => {
    if (i === 0) return m.concat("M", p1)
    else {
      const p0 = points[i - 1]
      const dx = p1[0] - p0[0]
      const dy = p1[1] - p0[1]

      if (dx === 0 && dy === 0) return m
      return m.concat(["c", dx * alpha, 0, dx * (1 - alpha), dy, dx, dy])
    }
  }, [])
