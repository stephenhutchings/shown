import sum from "../../src/lib/utils/sum.js"
import percent from "../../src/lib/utils/percent.js"
import toPrecision from "../../src/lib/utils/to-precision.js"
import decimalPlaces from "../../src/lib/utils/decimal-places.js"
import interpolate from "../../src/lib/utils/interpolate.js"
import magnitude from "../../src/lib/utils/magnitude.js"

describe("utils", () => {
  test("sum an array", () => {
    expect(sum([1, 2, 3])).toBe(6)
    expect(sum([0, 1, 2])).toBe(3)
    expect(sum([{ value: 2 }])).toBe(2)
    expect(sum([{ value: 2 }, { value: 0 }])).toBe(2)
    expect(sum([undefined, { value: false }, 1])).toBe(1)
  })

  test("convert to a percent", () => {
    expect(percent(0.1)).toBe("10%")
    expect(percent(0)).toBe("0")
    expect(percent(-0.1111111)).toBe("-11.11%")
  })

  test("convert to a precision", () => {
    expect(toPrecision(0.1111, 1)).toBe(0.1)
    expect(toPrecision(111.1, -2)).toBe(100)
    expect(toPrecision(1)).toBe(1)
  })

  test("count decimal places", () => {
    expect(decimalPlaces(0.1111)).toBe(4)
    expect(decimalPlaces(1111)).toBe(0)
    expect(decimalPlaces(1.2e-8)).toBe(9)
    expect(decimalPlaces(1.2e24)).toBe(0)
  })

  test("calculate magnitude", () => {
    expect(magnitude(0.0123)).toBe(-2)
    expect(magnitude(0.123)).toBe(-1)
    expect(magnitude(1.23)).toBe(0)
    expect(magnitude(12.3)).toBe(1)
    expect(magnitude(123)).toBe(2)
    expect(magnitude(1.23e-8)).toBe(-8)
  })

  test("interpolate values", () => {
    expect(interpolate([1, null, 3])).toStrictEqual([1, 2, 3])
    expect(interpolate([1, 2, null])).toStrictEqual([1, 2, 2])
    expect(interpolate([1, NaN, NaN, 4])).toStrictEqual([1, 2, 3, 4])
    expect(interpolate([null, 1, -2])).toStrictEqual([1, 1, -2])
  })
})
