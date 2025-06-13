export const stepX = (points) =>
  points.reduce((m, p1, i) => {
    if (i === 0) return m.concat("M", p1)
    else {
      const p0 = points[i - 1]
      const dx = p1[0] - p0[0]
      const dy = p1[1] - p0[1]

      if (dx !== 0) m.push("h", dx)
      if (dy !== 0) m.push("v", dy)

      return m
    }
  }, [])

export const stepY = (points) =>
  points.reduce((m, p1, i) => {
    if (i === 0) return m.concat("M", p1)
    else {
      const p0 = points[i - 1]
      const dx = p1[0] - p0[0]
      const dy = p1[1] - p0[1]

      if (dy !== 0) m.push("v", dy)
      if (dx !== 0) m.push("h", dx)

      return m
    }
  }, [])

export const stepMidX = (points) =>
  points.reduce((m, p1, i) => {
    if (i === 0) return m.concat("M", p1)
    else {
      const p0 = points[i - 1]
      const dx = (p1[0] - p0[0]) / 2
      const dy = p1[1] - p0[1]

      if (dx !== 0) m.push("h", dx)
      if (dy !== 0) m.push("v", dy)
      if (dx !== 0) m.push("h", dx)

      return m
    }
  }, [])

export const stepMidY = (points) =>
  points.reduce((m, p1, i) => {
    if (i === 0) return m.concat("M", p1)
    else {
      const p0 = points[i - 1]
      const dx = p1[0] - p0[0]
      const dy = (p1[1] - p0[1]) / 2

      if (dy !== 0) m.push("v", dy)
      if (dx !== 0) m.push("h", dx)
      if (dy !== 0) m.push("v", dy)

      return m
    }
  }, [])
