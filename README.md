# shown

[![Version][version img]][version url]
[![License][licence img]][licence url]
![Test][test badge]
![Coverage][coverage img]

Statically-generated, responsive charts, without the need for client-side
Javascript.

```
npm install shown
```

Read the docs [here][documentation].

---

`shown` generates simple HTML and SVG charts. The library works with static-site
generators (SSG), or in server-side rendering (SSR) contexts to create
self-contained, embeddable chart documents. It aims to fill a gap between
unresponsive images and complex data visualization tools.

The library offers a high-level API to generate charts, providing good results
with minimal configuration. When more flexibility is required, expressive data
mapping allows for fine-grained control. Plug and play data from different
sources, mapping values as you need them.

Charts adapt to different screen-sizes without any need for client-side
JavaScript. Charts will expand and contract to fill their containers without
affecting font size, so text remains legible across viewports.

Charts render without client-side JavaScript, reducing bundle sizes and
improving performance by avoiding expensive recalculations when a container
resizes.

[version img]: https://img.shields.io/npm/v/shown.svg
[version url]: https://npmjs.org/package/shown
[licence img]: https://img.shields.io/github/license/stephenhutchings/shown.svg?color=1c2335
[licence url]: https://github.com/stephenhutchings/shown/blob/master/LICENSE.md
[test badge]: https://github.com/stephenhutchings/shown/workflows/Test/badge.svg?branch=master
[coverage img]: https://github.com/stephenhutchings/shown/blob/master/coverage.svg
[documentation]: https://stephenhutchings.github.io/shown/
