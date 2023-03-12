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

    testBounds(0, 11.068351843, 0, 12)
    testBounds(0, 12.5, 0, 14)
    testBounds(-0.51, 0.69, -0.6, 0.8)
    testBounds(...[-0.51, 0.69, -0.6, 0.8].map((n) => n * 1000000000))
    testBounds(-0.59, 0.61, -0.6, 0.8)
    testBounds(...[-0.59, 0.61, -0.6, 0.8].map((n) => n * 1000000000))
    testBounds(-6.9, 5.6, -8, 6)
    testBounds(-0.41, 0.55, -0.6, 0.6)
    testBounds(0.55, 0.55, 0, 0.6)
  })

  test("will calculate expected tick count from values", () => {
    const testTicks = (min, max, ticks) => {
      expect(setup({}, [min, max])).toEqual(expect.objectContaining({ ticks }))
    }

    testTicks(624, 912, 6)
    testTicks(-0.59, 0.61, 8)
    testTicks(0.59, -0.61, 8)
    testTicks(-0.51, 0.69, 8)
    testTicks(0.51, -0.69, 8)
    testTicks(-6.9, 5.6, 8)
    testTicks(0.41, 0.55, 7)
    testTicks(41, 44, 4)
  })

  test("will calculate expected tick count from explicit extremes", () => {
    const testTicks = (min, max, ticks) => {
      expect(setup({ min, max })).toEqual(expect.objectContaining({ ticks }))
    }

    testTicks(1821, 2001, 7)
    testTicks(1901, 2021, 5)
  })

  test("ignores line as specified", () => {
    expect(axis("x", setup({ line: (v, i) => i % 2 === 0 }, [0, 1]))).toMatch(
      /\d<\/text><\/svg>/
    )

    expect(axis("x", setup({ line: false }, [0, 1]))).toEqual(
      expect.not.stringContaining(`<line`)
    )

    expect(axis("x", setup({ line: [true, false] }, [0, 1]))).toEqual(
      expect.stringContaining(`1</text></svg>`)
    )
  })

  test("passes axis to functions", () => {
    const opts = setup(
      {
        custom: true,
        line: (v, i, axis) => axis.custom === false,
        label: (v, i, axis) => typeof axis,
      },
      [0, 1]
    )

    expect(axis("x", opts)).toEqual(expect.stringContaining(`object</text>`))
    expect(axis("x", opts)).toEqual(expect.not.stringContaining(`<line`))
  })

  test("offsets lines when grouped", () => {
    expect(axis("x", { ...opts, group: true })).toEqual(
      expect.stringContaining(`x1="25%" x2="25%"`)
    )
  })

  test("fails gracefully given bad input", () => {
    const testBounds = (...values) => {
      expect(setup({}, values)).toEqual(
        expect.objectContaining({
          min: 0,
          max: 1,
        })
      )
    }

    testBounds(0, null, false, NaN, undefined)
    testBounds()
    testBounds(1, 1, 1)
  })
})
