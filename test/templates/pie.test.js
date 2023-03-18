import pie from "../../src/templates/pie.js"

const data = [1, 2, 3]

describe("pie", () => {
  test("is a function", () => {
    expect(typeof pie).toBe("function")
  })

  test("renders with no data", () => {
    expect(pie({})).toBe(undefined)
  })

  test("renders with arguments", () => {
    expect(pie({ data })).toMatch(`chart-pie`)
  })

  test("renders correct angles", () => {
    expect(pie({ data, startAngle: -0.3 })).toMatch(
      `stroke-dashoffset="86.39%"`
    )
  })

  test("includes a11y elements", () => {
    expect(pie({ data, title: "A" })).toMatch(`<title>A`)
    expect(pie({ data, description: "A" })).toMatch(`<desc>A`)
  })

  test("handles the sort argument", () => {
    // The smallest segment shouldn't be the last one
    expect(pie({ data, sorted: false })).toMatch(
      `1</text></g><g class=\"segment`
    )
  })
})
