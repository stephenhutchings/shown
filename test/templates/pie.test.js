import pie from "../../src/templates/pie.js"

describe("pie", () => {
  test("is a function", () => {
    expect(typeof pie).toBe("function")
  })

  test("renders with no data", () => {
    expect(pie({})).toBe(undefined)
  })

  test("renders with arguments", () => {
    expect(pie({ data: [1] })).toEqual(expect.stringContaining(`chart-pie`))
    expect(pie({ data: [1], startAngle: -0.3, endAngle: 0.9 })).toEqual(
      expect.stringContaining(`chart-pie`)
    )
    expect(
      pie({ data: [1], title: "A", description: "B", sorted: false })
    ).toEqual(expect.stringContaining(`chart-pie`))
  })
})
