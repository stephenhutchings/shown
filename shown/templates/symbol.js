import $ from "../lib/dom/index.js"

const symbol = (type) => {
  let symbol = ""

  if (type === "circle") {
    symbol = $.circle({
      r: 45,
    })
  }

  if (type === "square") {
    symbol = $.rect({
      x: -40,
      y: -40,
      width: 80,
      height: 80,
    })
  }

  if (type === "triangle") {
    symbol = $.polygon({
      points: [0, -50, 50, 40, -50, 40].join(),
    })
  }

  if (type === "diamond") {
    symbol = $.polygon({
      points: [0, -50, 50, 0, 0, 50, -50, 0].join(),
    })
  }

  return $.symbol({
    class: "symbol",
    id: `symbol-${type}`,
    viewBox: "0 0 100 100",
  })(symbol)
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
