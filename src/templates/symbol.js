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

  return $.symbol({
    class: "symbol",
    id: `symbol-${type}`,
    viewBox: "-50 -50 100 100",
    x: "-0.5em",
    y: "-0.5em",
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
