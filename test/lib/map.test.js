import { jest } from "@jest/globals"

import map from "../../src/lib/map.js"
import utils from "../../src/lib/utils.js"

describe("map", () => {
  test("to return a converter function", () => {
    expect(typeof map()).toBe("function")
  })

  test("to convert nested data", () => {
    const m = { label: (v) => v + "" }
    const d = [[[1]]]
    const o = { minValue: 0 }

    expect(map(m, d.flat(2), o)(d)).toStrictEqual([
      [[{ color: ["#0036b0", "#fff"], label: "1", tally: false, value: 1 }]],
    ])
  })

  test("to wrap non-functions", () => {
    const d = [1]

    expect(map({ a: [0], b: 0, c: "0" }, d)(d)).toStrictEqual([
      {
        a: 0,
        b: 0,
        c: "0",
        color: ["#0036b0", "#fff"],
        label: "1",
        tally: false,
        value: 1,
      },
    ])
  })

  test("to sum and respect `minValue`", () => {
    const d = [[1, 2]]
    const o = { minValue: 0.34 }

    expect(
      map(
        {},
        d.map((d) => utils.sum(d)),
        o
      )(d)
    ).toStrictEqual([
      [
        {
          color: ["#0036b0", "#fff"],
          label: false,
          value: 1,
          tally: false,
        },
        {
          color: ["#0036b0", "#fff"],
          label: "2",
          value: 2,
          tally: false,
        },
      ],
    ])
  })

  test("warns about nested data", () => {
    const d = [[]]

    console.warn = jest.fn()
    map({}, d)(d)

    expect(console.warn).toHaveBeenCalled()
  })
})
