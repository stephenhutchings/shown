import $ from "../lib/$/index.js"
import { map as mapColors } from "../lib/colors.js"

const shape = (type, color) => {
  let symbol = ""

  if (type === "solid") {
    symbol = $.rect({
      width: "100%",
      height: "100%",
      fill: color,
    })
  }

  if (type === "line") {
    symbol = $.line({
      x2: "100%",
      y1: "50%",
      y2: "50%",
      stroke: color,
    })
  }

  return $.svg({
    role: "presentation",
    width: "1.5em",
    height: "0.75em",
  })(symbol)
}

export default ({ keys, type, colors } = {}) => {
  if (keys && keys.length) {
    return $.ul()(
      keys.map((key, i) =>
        $.li()([type && shape(type, colors[i]), $.span()(key)])
      )
    )
  } else {
    return ""
  }
}
