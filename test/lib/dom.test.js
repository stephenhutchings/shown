import join from "../../src/lib/dom/join.js"
import wrap from "../../src/lib/dom/wrap.js"

describe("join", () => {
  test("is a function", () => {
    expect(typeof join).toBe("function")
  })

  test("returns an empty string with no argument", () => {
    expect(join()).toBe("")
  })

  test("joins an object's key/val pairs", () => {
    expect(join({ attribute: "value" })).toBe('attribute="value"')
  })

  test("filters falsy values", () => {
    expect(join({ "is-rendered": false })).toBe("")
  })

  test("skips `true` declarations", () => {
    expect(join({ "is-rendered": true })).toBe("is-rendered")
  })

  test("joins array of classes", () => {
    expect(join({ class: ["a", "b"] })).toBe('class="a b"')
  })

  test("joins style object", () => {
    expect(join({ style: { color: "red" } })).toBe('style="color:red"')
  })
})

describe("wrap", () => {
  test("is a function", () => {
    expect(typeof wrap).toBe("function")
  })

  test("returns wrapped functions from a key", () => {
    expect(wrap("div")()()).toBe("<div></div>")
  })

  test("renders attributes", () => {
    expect(wrap("div")({ a: 1 })()).toBe('<div a="1"></div>')
  })

  test("renders children", () => {
    expect(
      wrap("div")()([0, "1", () => "2", false, null, undefined, NaN])
    ).toBe("<div>012</div>")
  })
})
