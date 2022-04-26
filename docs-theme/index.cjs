const fs = require("fs")
const pug = require("pug")
const path = require("path")
const File = require("vinyl")
const vfs = require("vinyl-fs")
const pretty = require("pretty")
const hljs = require("highlight.js")
const concat = require("concat-stream")
const documentation = require("documentation")
const GithubSlugger = require("github-slugger")

function isFunction(section) {
  return (
    section.kind === "function" ||
    (section.kind === "typedef" &&
      section.type &&
      section.type.type === "NameExpression" &&
      section.type.name === "Function")
  )
}

module.exports = function (comments, config) {
  const template = path.join(__dirname, "index.pug")
  const iframe = path.join(__dirname, "iframe.pug")

  const linkerStack = new documentation.util.LinkerStack(
    config
  ).namespaceResolver(comments, function (namespace) {
    const slugger = new GithubSlugger()
    return "#" + slugger.slug(namespace)
  })

  const formatters = documentation.util.createFormatters(linkerStack.link)

  hljs.configure(config.hljs || {})

  const format = {
    isFunction,
    type: formatters.type,
    autolink: formatters.autolink,
    parameters: formatters.parameters,

    slug(str) {
      const slugger = new GithubSlugger()
      return slugger.slug(str)
    },

    md(ast, inline) {
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
      return formatters.markdown(ast)
    },

    highlight(example, language = "js", inline) {
      const value = hljs.highlight(example, { language }).value

      return inline ? value : `<pre class="hljs ${language}">${value}</pre>`
    },
  }

  const examples = comments.map((section) => section.examples).flat(1)

  return new Promise((resolve) => {
    import("../src/index.js").then(({ donut }) => {
      examples.forEach((el, i) => {
        const body = eval(el.description)

        el.path = `examples/${i + 1}/index.html`
        el.contents = Buffer.from(pug.renderFile(iframe, { body }), "utf8")
        el.result = pretty(body)
      })

      vfs.src([__dirname + "/assets/**"], { base: __dirname }).pipe(
        concat(function (files) {
          resolve(
            files.concat(
              examples.map((e) => new File(e)),
              new File({
                path: "index.html",
                contents: Buffer.from(
                  pug.renderFile(template, {
                    docs: comments,
                    config,
                    format,
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
