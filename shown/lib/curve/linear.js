export default (points) =>
  points.reduce((m, p1, i) => {
    if (i > 0) {
      const p0 = points[i - 1]
      if (p0[0] === p1[0] && p0[1] === p1[1]) return m
    }
    return m.concat(i === 0 ? "M" : "L", p1)
  }, [])
