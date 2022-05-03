import legend from "../../src/templates/legend.js"

describe("legend", () => {
  test("is a function", () => {
    expect(typeof legend).toBe("function")
  })

  test("renders with no argument", () => {
    expect(legend()).toBe(undefined)
  })

  test("renders with arguments", () => {
    expect(
      legend([
        { color: [], key: 1 },
        { color: [], key: 2 },
      ])
    ).toEqual(expect.stringContaining(`<ul class="legend"><li>`))
  })
})
