import { get, wrap } from "../../src/lib/color.js"

describe("colors", () => {
  test("is a function", () => {
    expect(typeof get).toBe("function")
  })

  test("is a function", () => {
    expect(typeof wrap).toBe("function")
  })

  test("returns an array with foreground color", () => {
    expect(wrap(get)(0)).toEqual(expect.arrayContaining(["#fff"]))
  })

  test("returns an array without foreground color", () => {
    expect(wrap(get)(1)).toEqual(expect.arrayContaining([false]))
  })

  test("handles out of bounds arguments", () => {
    expect(wrap(get)(NaN)).toEqual(expect.arrayContaining(["#fff"]))
  })

  test("wraps arbitrary functions", () => {
    expect(wrap(() => "0")(NaN)).toEqual(expect.arrayContaining(["0"]))
  })
})
