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
})
