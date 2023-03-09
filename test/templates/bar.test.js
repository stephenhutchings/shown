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

  test("renders custom keys", () => {
    expect(
      bar({
        data: [[[1, 2]], [[3, 4]]],
        map: {
          series: ["s1", "s2"],
          key: ["custom1", "custom2"],
          color: ["red", "blue"],
        },
      })
    ).toEqual(expect.stringContaining("custom"))
  })
})
