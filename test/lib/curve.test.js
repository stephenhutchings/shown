import curve from "../../src/lib/curve.js"

const points = [
  // Include empty points to test for removal
  [null, 0],
  [0, 0],
  // Include duplicate points to test for removal
  [0, 0],
  [1, 0],
  [2, 3],
  [null, 3],
  // Include point with no adjacent data to test for removal
  [2, 2],
]

describe("curve", () => {
  test("renders linear curve", () => {
    expect(curve.linear(points)).toBe("M0 0L1 0L2 3L2 2")
  })

  test("renders stepX curve", () => {
    expect(curve.stepX(points)).toBe("M0 0h1h1v3v-1")
  })

  test("renders stepY curve", () => {
    expect(curve.stepY(points)).toBe("M0 0h1v3h1v-1")
  })

  test("renders stepMidX curve", () => {
    expect(curve.stepMidX(points)).toBe("M0 0h0.5h0.5h0.5v3h0.5v-1")
  })

  test("renders stepMidY curve", () => {
    expect(curve.stepMidY(points)).toBe("M0 0h1v1.5h1v1.5v-0.5v-0.5")
  })

  test("renders monotone curve", () => {
    expect(curve.monotone(points)).toBe(
      "M0 0C0.33 0 0.67 0 1 0C1.33 0 1.67 3 2 3C2 3 2 2 2 2"
    )
  })

  test("renders bump curve", () => {
    expect(curve.bump(points)).toBe(
      "M0 0c0.4 0 0.6 0 1 0c0.4 0 0.6 3 1 3c0 0 0 -1 0 -1"
    )
  })
})
