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

  // The "attrs" object allows users to set their own attributes
  if (key === "attrs" && typeof val === "object") {
    return [join(val), true]
  }

  return [key, val]
}

const join = (attrs = false) =>
  attrs
    ? Object.entries(attrs)
        .filter(([key, val]) => val || val === 0)
        .map(mapSpecial)
        .map(([key, val]) => (val === true ? key : `${key}="${val}"`))
        .join(" ")
    : ""

export default join
