export const stepX = (points) =>
  points.reduce((m, p1, i) => {
    if (i === 0) return m.concat("M", p1)
    else {
      const p0 = points[i - 1]
      const dx = p1[0] - p0[0]
      const dy = p1[1] - p0[1]
      if (dx === 0 && dy === 0) return m
      return m.concat(["h", dx, "v", dy])
    }
  }, [])

export const stepY = (points) =>
  points.reduce((m, p1, i) => {
    if (i === 0) return m.concat("M", p1)
    else {
      const p0 = points[i - 1]
      const dx = p1[0] - p0[0]
      const dy = p1[1] - p0[1]
      if (dx === 0 && dy === 0) return m
      return m.concat(["v", dy, "h", dx])
    }
  }, [])

export const stepMidX = (points) =>
  points.reduce((m, p1, i) => {
    if (i === 0) return m.concat("M", p1)
    else {
      const p0 = points[i - 1]
      const dx = p1[0] - p0[0]
      const dy = p1[1] - p0[1]
      if (dx === 0 && dy === 0) return m
      return m.concat(["h", dx / 2, "v", dy, "h", dx / 2])
    }
  }, [])

export const stepMidY = (points) =>
  points.reduce((m, p1, i) => {
    if (i === 0) return m.concat("M", p1)
    else {
      const p0 = points[i - 1]
      const dx = p1[0] - p0[0]
      const dy = p1[1] - p0[1]
      if (dx === 0 && dy === 0) return m
      return m.concat(["v", dy / 2, "h", dx, "v", dy / 2])
    }
  }, [])
