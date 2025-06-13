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

const rerouteLinks = require("documentation/src/output/util/reroute_links")
const highlighter = require("documentation/src/output/highlighter")

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
    type: formatters.type,
    autolink: formatters.autolink,
    parameters: formatters.parameters,

    toUpperCase(s) {
      return s ? s[0].toUpperCase() + s.slice(1) : ""
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
      ast = rerouteLinks(linkerStack.link, ast)
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

  const cachebust = Date.now().toString(32)

  comments = comments
    .filter((item) => item.kind !== "module")
    .map((item) => ({
      ...item,
      name: item.name?.replace("module:shown.", ""),
      namespace: item.namespace?.replace("module:shown.", ""),
      alias: item.alias?.replace("module:shown.", ""),
    }))

  hljs.configure(config.hljs || {})

  const format = formatter(comments, config)

  const examples = comments.map((section) => section.examples).flat(1)

  return new Promise((resolve) => {
    import("../src/index.js").then((shown) => {
      examples.forEach((el, i) => {
        const body = new Function("shown", "return " + el.description)(shown)
        el.path = `examples/${i + 1}/index.html`
        el.contents = Buffer.from(
          pug.renderFile(iframe, { body, cachebust }),
          "utf8"
        )
        el.result = body
      })

      vfs
        .src(
          [
            __dirname + "/public/**",
            __dirname + "/public/shown/**", // glob won't crawl symlinks
          ],
          { base: __dirname + "/public" }
        )
        .pipe(
          concat(function (assets) {
            resolve(
              assets.concat(
                examples.map((e) => new File(e)),
                new File({
                  path: "index.html",
                  contents: Buffer.from(
                    pug.renderFile(template, {
                      docs: comments,
                      cachebust,
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
