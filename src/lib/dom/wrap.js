import join from "./join.js"

// Only render truthy values, or zero. This ignores undefined, null, NaN, false,
// and empty strings, but will naively stringify arrays and objects.
const shouldRender = (arg) => arg === 0 || arg

export default (type) => {
  return (attrs) => {
    attrs = join(attrs)

    if (attrs) attrs = " " + attrs

    return (children = "") => {
      if (!Array.isArray(children)) children = [children]

      const contents = children
        .filter(shouldRender)
        .map((child) => (typeof child === "function" ? child() : child))
        .join("")

      return `<${type}${attrs}>${contents}</${type}>`
    }
  }
}
