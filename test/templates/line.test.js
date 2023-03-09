import line from "../../src/templates/line.js"

describe("line", () => {
  test("is a function", () => {
    expect(typeof line).toBe("function")
  })

  test("renders basic chart", () => {
    expect(line({ data: [1, 2, 3] })).toEqual(
      expect.stringContaining('<div class="shown"><div class="chart chart-line')
    )
  })

  test("handles empty lines", () => {
    expect(line({ data: [] })).toEqual(
      expect.stringContaining('<div class="shown"><div class="chart chart-line')
    )
  })

  test("handles discontinuities", () => {
    const data = [1, 2, null, NaN, 3, false, 0]

    expect(line({ data, map: { curve: "monotone" } })).toEqual(
      expect.stringContaining('<div class="shown"><div class="chart chart-line')
    )
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
})
