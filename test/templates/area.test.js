import area from "../../src/templates/area.js"

describe("area", () => {
  test("is a function", () => {
    expect(typeof area).toBe("function")
  })

  test("renders basic chart", () => {
    expect(area({ data: [1, 2, 3] })).toMatch(
      '<div class="shown"><div class="chart chart-area'
    )
  })

  test("handles empty lines", () => {
    expect(area({ data: [] })).toMatch(
      '<div class="shown"><div class="chart chart-area'
    )
  })

  test("handles discontinuities", () => {
    const data = [
      [1, 2, null, NaN, 3, false],
      [1, 2, null, NaN, 3, false, 0],
    ]

    expect(area({ data, map: { curve: "monotone" } })).toMatch(
      'd="M0 83.33C5.56 77.78 11.11 72.22 16.67 66.67"'
    )
  })

  test("does ignore gaps", () => {
    const data = [0.1, null, 2]

    expect(area({ data })).toMatch('d="M0 95L100 0L100,100L0,100Z"')
  })

  test("handles multiple curve types", () => {
    const data = [1, 3, 2]

    expect(
      area({
        data,
        map: { curve: (d, i) => (i > data.length / 2 ? "linear" : "stepX") },
      })
    ).toMatch('d="M0 100h50v-100h50v50L100,100L0,100Z"')
  })

  test("mirrors step functions", () => {
    const data = [
      [1, 3, 2],
      [1, 3, 2],
    ]

    expect(
      area({
        data,
        map: { curve: ["stepX", "stepY"] },
      })
    ).toMatch('d="M0 100h50v-40h50v20L100,100L0,100Z"')
  })

  test("handles curve parameters", () => {
    const data = [1, 3, 2]

    expect(
      area({
        data,
        map: { curve: () => ["bump", 1 / 2] },
      })
    ).toMatch(
      'd="M0 100c25 0 25-100 50-100M50 0c25 0 25 50 50 50M100 50L100,100L0,100Z"'
    )
  })

  test("handles shapes", () => {
    const data = [1, 2, 3, 4]
    const make = area({
      data,
      map: { shape: (v, j, i) => ["circle", "diamond", "triangle", false][i] },
    })

    expect(make).toMatch("symbol-circle")
    expect(make).toMatch("symbol-diamond")
    expect(make).toMatch("symbol-triangle")
  })
})
