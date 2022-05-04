const fs = require("fs")
const pug = require("pug")
const path = require("path")
const File = require("vinyl")
const vfs = require("vinyl-fs")
const hljs = require("highlight.js")
const concat = require("concat-stream")
const documentation = require("documentation")
const GithubSlugger = require("github-slugger")
const remark = require("remark")
const html = require("remark-html")

const highlighter = require("documentation/src/output/highlighter")

function isFunction(section) {
  return (
    section.kind === "function" ||
    (section.kind === "typedef" &&
      section.type &&
      section.type.type === "NameExpression" &&
      section.type.name === "Function")
  )
}

const links = {
  npm: "https://www.npmjs.com/package/shown",
  github: "https://github.com/stephenhutchings/shown",
}

const formatter = (comments, config) => {
  const slug = (str) => {
    const slugger = new GithubSlugger()
    return slugger.slug(str)
  }

  const linkerStack = new documentation.util.LinkerStack(
    config
  ).namespaceResolver(comments, (namespace) => "#" + slug(namespace))

  const formatters = documentation.util.createFormatters(linkerStack.link)

  return {
    slug,
    isFunction,
    type: formatters.type,
    autolink: formatters.autolink,
    parameters: formatters.parameters,

    toUpperCase(s) {
      return s[0].toUpperCase() + s.slice(1)
    },

    md(ast, inline) {
      if (!ast) return ""

      if (
        inline &&
        ast &&
        ast.children.length &&
        ast.children[0].type === "paragraph"
      ) {
        ast = {
          type: "root",
          children: ast.children[0].children.concat(ast.children.slice(1)),
        }
      }

      return remark().use(html, { sanitize: false }).stringify(highlighter(ast))
    },

    highlight(example, language = "js", inline) {
      const value = hljs.highlight(example, { language }).value

      return inline ? value : `<pre class="hljs ${language}">${value}</pre>`
    },
  }
}

module.exports = function (comments, config) {
  const template = path.join(__dirname, "index.pug")
  const iframe = path.join(__dirname, "iframe.pug")

  hljs.configure(config.hljs || {})

  const format = formatter(comments, config)

  const examples = comments.map((section) => section.examples).flat(1)

  return new Promise((resolve) => {
    import("../src/index.js").then((shown) => {
      examples.forEach((el, i) => {
        const body = new Function("shown", "return " + el.description)(shown)
        el.path = `examples/${i + 1}/index.html`
        el.contents = Buffer.from(pug.renderFile(iframe, { body }), "utf8")
        el.result = body
      })

      vfs.src([__dirname + "/assets/**"], { base: __dirname }).pipe(
        concat(function (assets) {
          resolve(
            assets.concat(
              examples.map((e) => new File(e)),
              new File({
                path: "assets/css/shown.css",
                contents: fs.readFileSync("src/css/shown.css"),
              }),
              new File({
                path: "index.html",
                contents: Buffer.from(
                  pug.renderFile(template, {
                    docs: comments,
                    links,
                    config,
                    format,
                    filters: {
                      hl: (text, options) =>
                        format.highlight(text, options.lang),
                    },
                  }),
                  "utf8"
                ),
              })
            )
          )
        })
      )
    })
  })
}
