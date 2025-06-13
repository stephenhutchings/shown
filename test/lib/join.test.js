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

  test("deduplicates attrs", () => {
    expect(
      join({
        key: "custom",
        attrs: { key: "override" },
      })
    ).toMatch('key="override"')
  })
})
