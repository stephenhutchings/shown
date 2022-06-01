import bar from "../../src/templates/bar.js"

describe("bar", () => {
  test("is a function", () => {
    expect(typeof bar).toBe("function")
  })

  test("renders basic chart", () => {
    expect(bar({ data: [1, 2, 3] })).toEqual(
      expect.stringContaining('<div class="shown"><div class="chart chart-bar')
    )
  })
})
