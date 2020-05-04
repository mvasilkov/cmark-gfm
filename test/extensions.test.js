'use strict'

const assert = require('assert').strict
const { assertEqual } = require('assert-equal-html')
const { describe, it } = require('smoltest')(exports)
const { outdent } = require('@mvasilkov/outdent')

const cmark = require('..')

describe('extensions', () => {
  describe('table', () => {
    it('renders tables', () => {
      const markdown = outdent(`
      |Header|
      |------|
      |Hello |
      `)

      const html = `
      <table>
        <thead>
          <tr>
            <th>Header</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hello</td>
          </tr>
        </tbody>
      </table>
      `
      const rendered = cmark.renderHtmlSync(markdown, {
        extensions: {
          table: true
        }
      })
      assertEqual(rendered, html)
    })
  })

  describe('strikethrough', () => {
    it('enables strikethrough', () => {
      const markdown = outdent(`
      It's all about ~CoffeeScript~ ES2016
      `)

      const html = `
      <p>It's all about <del>CoffeeScript</del> ES2016</p>
      `
      const rendered = cmark.renderHtmlSync(markdown, {
        extensions: {
          strikethrough: true
        }
      })
      assertEqual(rendered, html)
    })
  })

  describe('tagfilter', () => {
    it('only allows certain HTML tags to be rendered as raw HTML', () => {
      const markdown = outdent(`
      <div>What a weird <xmp> tag</div>
      `)

      const html = `
      <div>What a weird &lt;xmp> tag</div>
      `

      const rendered = cmark.renderHtmlSync(markdown, {
        unsafe: true,
        extensions: {
          tagfilter: true
        }
      })
      assertEqual(rendered, html)
    })
  })

  describe('autolink', () => {
    it('turns URLs into links', () => {
      const markdown = outdent(`
      Visit us at https://github.com!
      `)

      const html = `
      <p>Visit us at <a href="https://github.com">https://github.com</a>!</p>
      `

      const rendered = cmark.renderHtmlSync(markdown, {
        extensions: {
          autolink: true
        }
      })
      assertEqual(rendered, html)
    })
  })

  describe('tasklist', () => {
    it('renders GitHub-style task lists', () => {
      const markdown = outdent(`
      - [ ] Task 1
      - [x] Task 2
      `)

      const html = `
      <ul>
        <li><input type="checkbox" disabled="" /> Task 1</li>
        <li><input type="checkbox" checked="" disabled="" /> Task 2</li>
      </ul>
      `

      const rendered = cmark.renderHtmlSync(markdown, {
        extensions: {
          tasklist: true
        }
      })
      assertEqual(rendered, html)
    })

    // https://github.com/github/cmark-gfm/issues/168
    it('handles nested sublists correctly', () => {
      const markdown = outdent(`
      - [x] foo
          - [ ] bar
          - [x] baz
      - [ ] bim
      `)

      const html = `
      <ul>
        <li><input type="checkbox" checked="" disabled="" /> foo
          <ul>
            <li><input type="checkbox" disabled="" /> bar</li>
            <li><input type="checkbox" checked="" disabled="" /> baz</li>
          </ul>
        </li>
        <li><input type="checkbox" disabled="" /> bim</li>
      </ul>
      `

      const rendered = cmark.renderHtmlSync(markdown, {
        extensions: {
          tasklist: true
        }
      })
      assertEqual(rendered, html)
    })
  })

  it("doesn't crash for bad extensions", () => {
    assert.throws(function () {
      cmark.renderHtml('# Hi', { extensions: ['fake'] })
    })
    assert.throws(function () {
      cmark.renderHtml('# Hi', { extensions: 'notanarray' })
    })
    assert.throws(function () {
      cmark.renderHtml('# Hi', { extensions: [{}] })
    })
  })

  it('only enables an extension with a truthy value', () => {
    const rendered = cmark.renderHtmlSync('- [ ] https://github.com', {
      extensions: {
        tasklist: false,
        autolink: true
      }
    })
    assert(!rendered.includes('checkbox'))
    assert(rendered.includes('href'))
  })
})
