import line from "../../src/templates/line.js"

describe("line", () => {
  test("is a function", () => {
    expect(typeof line).toBe("function")
  })

  test("renders basic chart", () => {
    expect(line({ data: [1, 2, 3] })).toMatch(
      '<div class="shown"><div class="chart chart-line'
    )
  })

  test("handles empty lines", () => {
    expect(line({ data: [] })).toMatch(
      '<div class="shown"><div class="chart chart-line'
    )
  })

  test("handles discontinuities", () => {
    const data = [1, 2, null, NaN, 3, false, 0]

    expect(line({ data, map: { curve: "monotone" } })).toMatch(
      '<div class="shown"><div class="chart chart-line'
    )
  })

  test("can ignore gaps", () => {
    const data = [0.1, null, 2]

    expect(line({ data, showGaps: false })).toMatch('d="M0 95L100 0"')
  })

  test("handles multiple curve types", () => {
    const data = [1, 3, 2]

    expect(
      line({
        data,
        map: { curve: (d, i) => (i > data.length / 2 ? "linear" : "stepX") },
      })
    ).toMatch('d="M0 100h50v-100h50v50"')
  })

  test("handles curve parameters", () => {
    const data = [1, 3, 2]

    expect(
      line({
        data,
        map: { curve: () => ["bump", 1 / 2] },
      })
    ).toMatch('d="M0 100c25 0 25-100 50-100M50 0c25 0 25 50 50 50M100 50"')
  })

  test("handles labels", () => {
    const data = [1, 2, -3, -2, 3, false, 4]
    const make = line({
      data,
      smartLabels: true,
      map: { label: true },
    })

    expect(make).toMatch('<text class="label"')
  })

  test("handles shapes", () => {
    const data = [1, 2, 3, 4]
    const make = line({
      data,
      map: { shape: (v, j, i) => ["circle", "diamond", "triangle", false][i] },
    })

    expect(make).toMatch("symbol-circle")
    expect(make).toMatch("symbol-diamond")
    expect(make).toMatch("symbol-triangle")
  })

  test("sorts lines", () => {
    const data = [
      [3, 4],
      [1, 2],
    ]
    const make = line({
      data,
      sorted: true,
    })

    expect(make).toMatch(
      '<path class="series series-0" vector-effect="non-scaling-stroke" stroke="#ffca01" fill="none" d="M0 100L100 66.67"></path>'
    )
  })
})
