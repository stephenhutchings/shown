import scatter from "../../src/templates/scatter.js"

describe("scatter", () => {
  test("is a function", () => {
    expect(typeof scatter).toBe("function")
  })

  test("renders basic chart", () => {
    expect(scatter({ data: [1, 2, 3] })).toEqual(
      expect.stringContaining(
        '<div class="shown"><div class="chart chart-scatter'
      )
    )
  })

  test("guesses bounds", () => {
    expect(scatter({ data: [[45, 45]] })).toEqual(
      expect.stringContaining(
        '<text class="axis-label" y="100%" dy="1.5em">50</text>'
      )
    )
  })
})
