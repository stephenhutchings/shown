import symbol from "../../src/templates/symbol.js"

describe("symbol", () => {
  test("is a function", () => {
    expect(typeof symbol).toBe("function")
  })

  test("renders with no data", () => {
    expect(symbol([])).toBe(undefined)
  })

  test("renders with arguments", () => {
    expect(
      symbol([
        { key: 1, shape: "square" },
        { key: 1, shape: "triangle" },
        { key: 1, shape: "diamond" },
        { key: 1, shape: "circle" },
        { key: 1, shape: "cross" },
        { key: 1, shape: "asterisk" },
      ])[0]
    ).toMatch("square")
  })
})
