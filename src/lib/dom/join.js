// Maps an object to a string of key="val" pairs
// Falsy values (except zero) will be ignored,
// Explicitly true values don't include right-hand declarations

const mapSpecial = ([key, val]) => {
  // The "class" array is filtered and joined together
  if (key === "class" && Array.isArray(val)) {
    val = val.filter((f) => f).join(" ")
  }

  // The "style" object is mapped from an object to CSS attributes
  if (key === "style" && typeof val === "object") {
    val = Object.entries(val)
      .map((pair) => pair.join(":"))
      .join(";")
  }

  return [key, val]
}

// The "attrs" object allows user-set attributes, which overwrite defaults
const flattenAttrs = (attrs) => {
  const result = { ...attrs, ...attrs.attrs }

  delete result.attrs

  return result
}

const join = (attrs = false) =>
  attrs
    ? Object.entries(flattenAttrs(attrs))
        .filter(([key, val]) => val || val === 0)
        .map(mapSpecial)
        .map(([key, val]) => (val === true ? key : `${key}="${val}"`))
        .join(" ")
    : ""

export default join
