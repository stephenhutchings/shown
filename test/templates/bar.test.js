import bar from "../../src/templates/bar.js"

const simple = [1, 2, 3]
const nested = [[[1, 2]], [[3, 4]], [[5, 6]], [[7, 8]]]

describe("bar", () => {
  test("is a function", () => {
    expect(typeof bar).toBe("function")
  })

  test("renders basic chart", () => {
    expect(bar({ data: simple })).toMatch(
      '<div class="shown"><div class="chart chart-bar'
    )
  })

  test("handles the stack option correctly", () => {
    expect(bar({ data: [simple, simple], stack: false })).toMatch("series-1")
    expect(bar({ data: [simple, simple], stack: true })).not.toMatch("series-1")
  })

  test("renders a single datum", () => {
    expect(bar({ data: simple.slice(0, 1) })).not.toMatch('width="0"')
  })

  test("renders correct classes", () => {
    const result = bar({
      data: nested,
      map: { series: [1, 2] },
      xAxis: { label: (d, j, i) => j },
    })

    expect(result).toMatch("has-series")
    expect(result).toMatch("has-xaxis")
    expect(result).toMatch("has-yaxis")
  })

  test("renders custom keys", () => {
    expect(
      bar({
        data: nested,
        map: {
          series: ["s1", "s2"],
          key: ["custom1", "custom2"],
          color: ["red", "blue"],
        },
      })
    ).toMatch("custom")
  })
})
