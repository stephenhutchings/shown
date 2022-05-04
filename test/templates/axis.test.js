import { default as axis, update } from "../../src/templates/axis.js"

const opts = { label: (i) => i, min: 0, max: 2, ticks: 3, inset: 0 }

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
    expect(axis("x", { inset: 0.1, spine: true, ...opts })).toEqual(
      expect.stringContaining(`class=\"axis-spine\"`)
    )
    expect(axis("y", { inset: 0.1, spine: true, ...opts })).toEqual(
      expect.stringContaining(`class=\"axis-spine\"`)
    )
  })
})

describe("update", () => {
  test("is a function", () => {
    expect(typeof update).toBe("function")
  })

  test("infers correct values from data", () => {
    expect(update({}, [0, 5])).toEqual(
      expect.objectContaining({
        min: 0,
        max: 5,
        ticks: 6,
      })
    )
  })

  test("creates keys with no data", () => {
    expect(update({})).toEqual(
      expect.objectContaining({
        min: expect.any(Number),
        max: expect.any(Number),
        ticks: expect.any(Number),
        inset: 0,
      })
    )
  })

  test("wraps label array to function", () => {
    expect(update({ label: [0, 1, 2] })).toEqual(
      expect.objectContaining({
        label: expect.any(Function),
      })
    )
  })
})