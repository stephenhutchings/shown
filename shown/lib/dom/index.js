import svg from "./svg.js"
import html from "./html.js"
import wrap from "./wrap.js"

export default [...svg, ...html].reduce((memo, key) => {
  memo[key] = wrap(key)
  return memo
}, {})
