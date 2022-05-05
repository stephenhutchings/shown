import $ from "../lib/dom/index.js"

const shape = (type, color) => {
  let symbol = ""

  if (type) {
    symbol = [
      $.line({
        x2: "100%",
        y1: "50%",
        y2: "50%",
        stroke: color,
      }),
      type !== "line" &&
        $.use({
          x: "50%",
          y: "50%",
          width: "1em",
          height: "1em",
          href: `#symbol-${type}`,
          fill: color,
          class: "symbol",
        }),
    ]
  } else {
    symbol = $.rect({
      width: "100%",
      height: "100%",
      fill: color,
    })
  }

  return $.svg({
    role: "presentation",
    class: "legend-marker",
  })(symbol)
}

export default (data) => {
  if (!data) return

  const keys = Object.values(
    data.flat().reduce((m, d) => {
      if (d.key && !m[d.key]) m[d.key] = d
      return m
    }, {})
  )

  if (keys && keys.length > 1) {
    return $.ul({
      class: "legend",
    })(
      keys.map((d) =>
        $.li()([shape(d.shape, d.color && d.color[0]), $.span()(d.key)])
      )
    )
  } else {
    return ""
  }
}
