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
})
