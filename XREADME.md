cmark-gfm
===

GitHub Flavored Markdown ¦ Native bindings for cmark-gfm, GitHub's fork of cmark, a CommonMark parsing and rendering library

[![npm][npm-badge]][npm-url]
[![dependencies][dependencies-badge]][dependencies-url]
[![travis][travis-badge]][travis-url]
[![appveyor][appveyor-badge]][appveyor-url]

---

Installation
---

```sh
npm add @mvasilkov/cmark-gfm
```

Usage
---

```javascript
const { renderHtmlSync } = require('@mvasilkov/cmark-gfm')

const html = renderHtmlSync('# hello, world')
// returns <h1>hello, world</h1>
```

### Asynchronous usage

```javascript
const { renderHtml } = require('@mvasilkov/cmark-gfm')

// With async/await
const html = await renderHtml('# hello, world')

// With Promises
renderHtml('# hello, world').then(html => {})

// With node-style callbacks
renderHtml('# hello, world', (err, html) => {})
```

Options
---

Authors
---

This is a fork of [Michelle Tilley][BinaryMuse]'s repo. It's entirely compatible with the upstream, and brings the following improvements:

* Update the underlying C library to the latest master
* Exclude dead code from compilation
* Reduce dev dependencies' footprint
* Optional React (JSX) support

Maintained by [Mark Vasilkov][mvasilkov].

License
---

MIT

[npm-badge]: https://img.shields.io/npm/v/@mvasilkov/cmark-gfm.svg?style=flat
[npm-url]: https://www.npmjs.com/package/@mvasilkov/cmark-gfm
[dependencies-badge]: https://img.shields.io/david/mvasilkov/cmark-gfm?style=flat
[dependencies-url]: https://www.npmjs.com/package/@mvasilkov/cmark-gfm?activeTab=dependencies
[travis-badge]: https://img.shields.io/travis/mvasilkov/cmark-gfm/@mvasilkov/cmark-gfm?style=flat
[travis-url]: https://travis-ci.org/github/mvasilkov/cmark-gfm
[appveyor-badge]: https://ci.appveyor.com/api/projects/status/2w02o0n3vpid13ho/branch/@mvasilkov/cmark-gfm?svg=true
[appveyor-url]: https://ci.appveyor.com/project/mvasilkov/cmark-gfm

[BinaryMuse]: https://github.com/BinaryMuse
[mvasilkov]: https://github.com/mvasilkov
