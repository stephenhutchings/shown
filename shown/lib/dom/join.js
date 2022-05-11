// Maps an object to a string of key="val" pairs
// Falsy values (except zero) will be ignored,
// Explicitly true values don't include right-hand declarations

const collapseClassesAndStyles = ([key, val]) => {
  if (key === "class" && Array.isArray(val)) {
    val = val.filter((f) => f).join(" ")
  }

  if (key === "style" && typeof val === "object") {
    val = Object.entries(val)
      .map((pair) => pair.join(":"))
      .join(";")
  }

  return [key, val]
}

export default (attrs = false) =>
  attrs
    ? Object.entries(attrs)
        .filter(([key, val]) => val || val === 0)
        .map(collapseClassesAndStyles)
        .map(([key, val]) => (val === true ? key : `${key}="${val}"`))
        .join(" ")
    : ""
