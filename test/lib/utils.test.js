import utils from "../../src/lib/utils.js"

describe("utils", () => {
  test("to sum an array", () => {
    expect(utils.sum([1, 2, 3])).toBe(6)
    expect(utils.sum([0, 1, 2])).toBe(3)
    expect(utils.sum([{ value: 2 }])).toBe(2)
    expect(utils.sum([{ value: 2 }, { value: 0 }])).toBe(2)
    expect(utils.sum([undefined, { value: false }, 1])).toBe(1)
  })

  test("to convert to a percent", () => {
    expect(utils.percent(0.1)).toBe("10%")
    expect(utils.percent(0)).toBe("0")
    expect(utils.percent(-0.1111111)).toBe("-11.11%")
  })

  test("to convert to a precision", () => {
    expect(utils.toPrecision(0.1111, 1)).toBe(0.1)
    expect(utils.toPrecision(111.1, -2)).toBe(100)
    expect(utils.toPrecision(1)).toBe(1)
  })

  test("to count decimal places", () => {
    expect(utils.decimalPlaces(0.1111)).toBe(4)
    expect(utils.decimalPlaces(1111)).toBe(0)
    expect(utils.decimalPlaces(1.2e-8)).toBe(9)
    expect(utils.decimalPlaces(1.2e24)).toBe(0)
  })
})
