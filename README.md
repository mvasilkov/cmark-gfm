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

### Passing options

```javascript
renderHtmlSync('# hello, world', { sourcepos: true })
// returns <h1 data-sourcepos="1:1-1:14">hello, world</h1>

await renderHtml('# hello, world', { sourcepos: true })
// equivalent to the above
```

All available options are listed below.

### Using extensions

```javascript
renderHtmlSync('# hello, https://sr.ht/', {
  extensions: { autolink: true }
})
// returns <h1>hello, <a href="https://sr.ht/">https://sr.ht/</a></h1>

await renderHtml('# hello, https://sr.ht/', {
  extensions: { autolink: true }
})
// equivalent to the above
```

Supported extensions are listed below.

### Usage with streams

```javascript
const fs = require('fs')
const { StreamingParser } = require('@mvasilkov/cmark-gfm')

fs.createReadStream('README.md')
  .pipe(new StreamingParser({ extensions: { table: true } }))
  .pipe(fs.createWriteStream('README.html'))
```

Options
---

All of the following options are boolean, and off by default.

### Options affecting rendering

| Option | Što
| --- | ---
| sourcepos | Include a `data-sourcepos` attribute on all block elements.
| hardbreaks | Render `softbreak` elements as hard line breaks.
| unsafe | Render raw HTML and unsafe links.
| nobreaks | Render `softbreak` elements as spaces.
| react | Produce React-compatible output (JSX).

### Options affecting parsing

| Option | Što
| --- | ---
| validateUtf8 | Validate UTF-8 in the input before parsing, replacing illegal sequences with the replacement character U+FFFD.
| smart | Convert straight quotes to curly, `---` to em dashes, `--` to en dashes.
| githubPreLang | Use GitHub-style `<pre lang="x">` tags for code blocks instead of `<pre><code class="language-x">`.
| liberalHtmlTag | Be liberal in interpreting inline HTML tags.
| footnotes | Parse footnotes.
| strikethroughDoubleTilde | Only parse strikethroughs if surrounded by exactly 2 tildes. Gives some compatibility with redcarpet.
| tablePreferStyleAttributes | Use `style` attributes to align table cells instead of `align` attributes.
| fullInfoString | Include the remainder of the info string in code blocks in a separate attribute.

### Extensions

| Extension | Što
| --- | ---
| autolink | Output web addresses and emails as hyperlinks.
| strikethrough | Enable the `~~strikethrough~~` syntax.
| table | Enable [tables][tables].
| tagfilter | Escape the following HTML tags: `title`, `textarea`, `style`, `xmp`, `iframe`, `noembed`, `noframes`, `script`, and `plaintext`.
| tasklist | Enable [task lists][task-lists].

Authors
---

This is a fork of [Michelle Tilley][BinaryMuse]'s repo. It's entirely compatible with the upstream, and brings the following improvements:

* Convert to TypeScript
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
[dependencies-badge]: https://img.shields.io/librariesio/release/npm/@mvasilkov/cmark-gfm?style=flat
[dependencies-url]: https://www.npmjs.com/package/@mvasilkov/cmark-gfm?activeTab=dependencies
[travis-badge]: https://img.shields.io/travis/mvasilkov/cmark-gfm/@mvasilkov/cmark-gfm?style=flat
[travis-url]: https://travis-ci.org/github/mvasilkov/cmark-gfm
[appveyor-badge]: https://ci.appveyor.com/api/projects/status/2w02o0n3vpid13ho/branch/@mvasilkov/cmark-gfm?svg=true
[appveyor-url]: https://ci.appveyor.com/project/mvasilkov/cmark-gfm

[tables]: https://help.github.com/en/github/writing-on-github/organizing-information-with-tables
[task-lists]: https://github.blog/2014-04-28-task-lists-in-all-markdown-documents/

[BinaryMuse]: https://github.com/BinaryMuse
[mvasilkov]: https://github.com/mvasilkov
