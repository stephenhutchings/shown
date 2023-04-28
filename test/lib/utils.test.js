import sum from "../../src/lib/utils/sum.js"
import percent from "../../src/lib/utils/percent.js"
import toPrecision from "../../src/lib/utils/to-precision.js"
import decimalPlaces from "../../src/lib/utils/decimal-places.js"

describe("utils", () => {
  test("to sum an array", () => {
    expect(sum([1, 2, 3])).toBe(6)
    expect(sum([0, 1, 2])).toBe(3)
    expect(sum([{ value: 2 }])).toBe(2)
    expect(sum([{ value: 2 }, { value: 0 }])).toBe(2)
    expect(sum([undefined, { value: false }, 1])).toBe(1)
  })

  test("to convert to a percent", () => {
    expect(percent(0.1)).toBe("10%")
    expect(percent(0)).toBe("0")
    expect(percent(-0.1111111)).toBe("-11.11%")
  })

  test("to convert to a precision", () => {
    expect(toPrecision(0.1111, 1)).toBe(0.1)
    expect(toPrecision(111.1, -2)).toBe(100)
    expect(toPrecision(1)).toBe(1)
  })

  test("to count decimal places", () => {
    expect(decimalPlaces(0.1111)).toBe(4)
    expect(decimalPlaces(1111)).toBe(0)
    expect(decimalPlaces(1.2e-8)).toBe(9)
    expect(decimalPlaces(1.2e24)).toBe(0)
  })
})
