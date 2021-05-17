import fs from "fs"
import pug from "pug"

import colors from "./colors.js"

const src = ["donut", "legend"]

const templates = src.reduce((m, key) => {
  const src = fs.readFileSync(`./src/templates/${key}.pug`).toString()
  const str = pug.compileClient(src, { compileDebug: false, doctype: "xml" })

  m[key] = pug.compile(src, { pretty: true, doctype: "xml" })

  fs.writeFileSync(`./src/${key}.js`, `${str};\nexport default template;`)

  return m
}, {})

const data = [50, 25, 15, 10]

const svg = templates.donut({
  data: data,
  title: "Donut Chart",
  colors: data.map((v, i, a) => colors(i / (a.length - 1))),
})

fs.writeFileSync("./examples/donut.svg", svg)
