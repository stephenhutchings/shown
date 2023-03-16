import $ from "../lib/dom/index.js"

const symbol = (type) => {
  let symbol = ""

  if (type === "circle") {
    symbol = $.circle({
      r: 4.5,
    })
  }

  if (type === "square") {
    symbol = $.path({
      d: "M-4-4h8v8h-8Z",
    })
  }

  if (type === "triangle") {
    symbol = $.path({
      d: "M0-5L5,4H-5Z",
    })
  }

  if (type === "diamond") {
    symbol = $.path({
      d: "M0-5L5,0L0,5L-5,0Z",
    })
  }

  if (type === "cross") {
    symbol = $.path({
      d: "M-6,0H6M0,-6V6",
    })
  }

  // Increase the hit area of the marker by including a transparent
  // circle that extends beyond the bounds of the marker.
  // This may be useful, for example, to activate a tooltip on hover.
  const hitArea = $.circle({
    class: "touch",
    r: 15,
  })

  return $.symbol({
    class: "symbol shown",
    id: `symbol-${type}`,
    viewBox: "0 0 10 10",
  })([hitArea, symbol])
}

export default (data) => {
  const keys = [
    ...new Set(
      data
        .flat()
        .filter((d) => d.shape)
        .map((d) => d.shape)
    ),
  ]

  if (keys && keys.length) {
    return keys.map(symbol)
  }
}
