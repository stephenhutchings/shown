import { default as axis, setup } from "../../src/templates/axis.js"

const opts = setup({ label: (i) => i, min: 0, max: 2, ticks: 3, inset: 0 })

describe("axis", () => {
  test("is a function", () => {
    expect(typeof axis).toBe("function")
  })

  test("renders x-axis with arguments", () => {
    expect(axis("x", opts)).toEqual(
      expect.stringContaining(`<svg class=\"axis axis-x\"`)
    )
  })

  test("renders y-axis with arguments", () => {
    expect(axis("y", opts)).toEqual(
      expect.stringContaining(`<svg class=\"axis axis-y\"`)
    )
  })

  test("renders with inset and spine", () => {
    expect(axis("x", setup({ inset: 0.1, spine: true }, [0, 1]))).toEqual(
      expect.stringContaining(`class=\"axis-spine\"`)
    )
    expect(axis("y", setup({ inset: 0.1, spine: true }, [0, 1]))).toEqual(
      expect.stringContaining(`class=\"axis-spine\"`)
    )
  })

  test("ignores spine when not needed", () => {
    expect(axis("x", setup({ spine: true }, [0, 1]))).toEqual(
      expect.not.stringContaining(`class=\"axis-spine\"`)
    )
    expect(axis("y", setup({ spine: true }, [0, 1]))).toEqual(
      expect.not.stringContaining(`class=\"axis-spine\"`)
    )
  })

  test("renders no text without a label", () => {
    expect(axis("x", setup({ label: false }))).toEqual(
      expect.not.stringContaining("<text")
    )
  })
})

describe("setup", () => {
  test("is a function", () => {
    expect(typeof setup).toBe("function")
  })

  test("infers correct values from data", () => {
    expect(setup({}, [0, 5])).toEqual(
      expect.objectContaining({
        min: 0,
        max: 5,
        ticks: 6,
      })
    )
  })

  test("ignores non-numeric values in data", () => {
    expect(setup({ min: 0 }, [null, undefined, NaN, 5])).toEqual(
      expect.objectContaining({
        min: 0,
        max: 5,
        ticks: 6,
      })
    )
  })

  test("creates keys with no data", () => {
    expect(setup({})).toEqual(
      expect.objectContaining({
        min: expect.any(Number),
        max: expect.any(Number),
        ticks: expect.any(Number),
        inset: 0,
      })
    )
  })

  test("wraps label array to function", () => {
    expect(setup({ label: [0, 1, 2] })).toEqual(
      expect.objectContaining({
        label: expect.any(Function),
      })
    )
  })

  test("will use absolute bounds with argument", () => {
    expect(setup({ min: 1 }, [1.2], false)).toEqual(
      expect.objectContaining({
        min: 1,
        max: 1.2,
      })
    )
  })

  test("will keep bounds within sensible range", () => {
    expect(setup({}, [1988, 2023])).toEqual(
      expect.objectContaining({
        min: 1980,
        max: 2030,
      })
    )
  })

  test("will increase bounds for better tick count", () => {
    const testBounds = (vmin, vmax, amin, amax) => {
      expect(setup({}, [vmin, vmax])).toEqual(
        expect.objectContaining({
          min: amin,
          max: amax,
        })
      )
    }

    testBounds(-0.51, 0.69, -0.6, 0.8)
    testBounds(-0.59, 0.61, -0.7, 0.7)
    testBounds(-6.9, 5.6, -7, 6)
    testBounds(-0.41, 0.55, -0.5, 0.7)
    testBounds(0.55, 0.55, 0, 0.6)
  })

  test("will calculate expected tick count", () => {
    const testTicks = (min, max, ticks) => {
      expect(setup({ min, max })).toEqual(expect.objectContaining({ ticks }))
    }

    testTicks(-0.59, 0.61, 3)
    testTicks(-0.51, 0.69, 4)
    testTicks(-6.9, 5.6, 5)
    testTicks(0.41, 0.55, 8)
    testTicks(41, 44, 4)
  })
})
