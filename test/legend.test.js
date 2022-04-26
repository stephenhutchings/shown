import { legend } from "../src/index.js"

describe("legend", () => {
  test("is a function", () => {
    expect(typeof legend).toBe("function")
  })

  test("renders with no argument", () => {
    expect(legend()).toBe("")
  })

  test("renders with arguments", () => {
    expect(legend({ keys: [1, 2] })).toBe(
      "<ul><li><span>1</span></li><li><span>2</span></li></ul>"
    )
  })
})
