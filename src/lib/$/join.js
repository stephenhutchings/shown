// Maps an object to a string of key="val" pairs
// Falsy values (except zero) will be ignored,
// Explicitly true values don't include right-hand declarations

export default (attrs = false) =>
  attrs
    ? Object.entries(attrs)
        .filter(([key, val]) => val || val === 0)
        .map(([key, val]) => (val === true ? key : `${key}="${val}"`))
        .join(" ")
    : ""
