# starch

**This library is current in pre-release alpha.**

Static, responsive SVG charts. No client-side Javascript required.

---

The goal of this library is to render beautiful, functional, responsive SVG charts on the server, with no need for client-side JavaScript. This means there is no need to wait for JavaScript to load and execute in the browser – charts are available directly and work when JavaScript is disabled.

This is ideal for use in static site generators where charts are needed, without requiring the additional overhead of

The library exposes template functions to render several chart types.

- [Pie and Donut Charts](#pie-and-donut-charts)
- [Line Charts](#line-charts)
- [Bar Charts](#bar-charts)
- [Area Charts](#area-charts)
- [Scatter Plot](#scatter-plot)
- [Gauge Charts](#gauge-charts)
- [Legends](#legends)
- [Figures](#figures)
- [CSS](#css)

## Pie and Donut Charts

```js
import { donut } from "starch"

const output = donut({
  title: "My chart",
  description: "This pie chart shows two segments.",
  data: [75, 25],
  colors: ["crimson", "darkblue"],
  stroke: 20,
})
```

| Option      | Description                                   |
| ----------- | --------------------------------------------- |
| title       | Title of the chart                            |
| description | Description of the chart                      |
| data        | Array of values                               |
| colors      | Array of CSS colors for each segment          |
| stroke      | Width of the stroke, as a percentage          |
| styles      | Include minimal set of styles                 |
| minVal      | Minimum value at which to add a segment label |
| sort        | Sort the values in descending order           |
| decimals    | Precision of the SVG measurements             |

## Line Charts

Coming soon…

## Bar Charts

Coming soon…

## Area Charts

Coming soon…

## Scatter Plot

Coming soon…

## Gauge Charts

Coming soon…

## Legends

Renders a simple legend to label the different values included in the chart.

```js
import { legend } from "starch"

const output = legend({
  keys: ["Item 1", "Item 2"],
  colors: ["crimson", "darkblue"],
  type: "solid", // line, circle, node
})
```

## Figures

Coming soon…

Wraps a chart inside a `<figure>` element, with `<figcaption>` and a legend included.

```js
import { figure } from "starch"

const output = legend({
  title: "My chart",
  caption: "A description for this chart",
  type: "bar|pie|line|area",
  keys: ["Item 1", "Item 2"],
  colors: ["crimson", "darkblue"],
  data: [1, 2, 3, 4, 5],
})
```

## CSS

By default, only the minimal CSS needed is included in each template. This ensures the while charts work stand-alone, it removes the pain of having to override styles.

However, if you want to get started quickly, you can include the additional CSS provided.

```js
import css from "starch/css"
```

```html
<link rel="stylesheet" src="/path/to/starch.css" />
```
