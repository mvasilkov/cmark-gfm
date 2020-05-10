cmark-gfm
===

GitHub Flavored Markdown ¦ Native bindings for cmark-gfm, GitHub's fork of cmark, a CommonMark parsing and rendering library

[![npm][npm-badge]][npm-url]
[![dependencies][dependencies-badge]][dependencies-url]
[![travis][travis-badge]][travis-url]
[![appveyor][appveyor-badge]][appveyor-url]

---

This is a fork of [Michelle Tilley][BinaryMuse]'s repo. It's entirely compatible with the upstream, and brings the following improvements:

* Update the underlying C library to the latest master
* Exclude dead code from compilation
* Reduce dev dependencies' footprint
* Optional React (JSX) support

Installation
---

```sh
npm add @mvasilkov/cmark-gfm
```

License
---

MIT

[npm-badge]: https://img.shields.io/npm/v/@mvasilkov/cmark-gfm.svg?style=flat
[npm-url]: https://www.npmjs.com/package/@mvasilkov/cmark-gfm
[dependencies-badge]: https://img.shields.io/david/mvasilkov/cmark-gfm?style=flat
[dependencies-url]: https://www.npmjs.com/package/@mvasilkov/cmark-gfm?activeTab=dependencies
[travis-badge]: https://travis-ci.org/mvasilkov/cmark-gfm.svg?branch=%40mvasilkov%2Fcmark-gfm
[travis-url]: https://travis-ci.org/github/mvasilkov/cmark-gfm
[appveyor-badge]: https://ci.appveyor.com/api/projects/status/2w02o0n3vpid13ho/branch/@mvasilkov/cmark-gfm?svg=true
[appveyor-url]: https://ci.appveyor.com/project/mvasilkov/cmark-gfm

[BinaryMuse]: https://github.com/BinaryMuse
