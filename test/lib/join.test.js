import join from "../../src/lib/dom/join.js"

describe("map", () => {
  test("handle special keys", () => {
    expect(
      join({
        class: [false, "active"],
        style: { color: "red" },
        attrs: { "data-value": "custom" },
      })
    ).toMatch('class="active" style="color:red" data-value="custom"')
  })
})
