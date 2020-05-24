'use strict'

const { assertEqual, assertNotEqual } = require('assert-equal-html')
const { describe, it } = require('smoltest')(exports)
const { outdent } = require('@mvasilkov/outdent')

const { renderHtmlSync } = require('..')

describe('Extension: autolink', () => {
    it('Output web addresses and emails as hyperlinks', () => {
        const input = outdent(`
        Download Brave
        https://brave.com/
        `)
        const result = `
        <p>Download Brave
            <a href="https://brave.com/">https://brave.com/</a>
        </p>
        `
        assertNotEqual(renderHtmlSync(input), result)
        assertEqual(renderHtmlSync(input, {
            extensions: { autolink: true },
        }), result)
    })
})

describe('Extension: strikethrough', () => {
    it('Enable the `~~strikethrough~~` syntax', () => {
        const input = outdent(`
        Sanders sounded like a ~~democrat~~ communist
        during the Vegas debate.
        `)
        const result = `
        <p>Sanders sounded like a <del>democrat</del> communist
        during the Vegas debate.</p>
        `
        assertNotEqual(renderHtmlSync(input), result)
        assertEqual(renderHtmlSync(input, {
            extensions: { strikethrough: true },
        }), result)
    })
})

describe('Extension: table', () => {
    it('Enable tables', () => {
        const input = outdent(`
        | hello | world
        | --- | ---
        | hello | world
        `)
        const result = `
        <table>
            <thead>
                <tr>
                    <th>hello</th>
                    <th>world</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>hello</td>
                    <td>world</td>
                </tr>
            </tbody>
        </table>
        `
        assertNotEqual(renderHtmlSync(input), result)
        assertEqual(renderHtmlSync(input, {
            extensions: { table: true },
        }), result)
    })
})

describe('Extension: tagfilter', () => {
    it('Escape selected HTML tags', () => {
        const input = outdent(`
        <article>hello
            <title>world</title>
        </article>
        `)
        const result = `
        <article>hello
            &lt;title>world&lt;/title>
        </article>
        `
        assertNotEqual(renderHtmlSync(input, { unsafe: true }), result)
        assertEqual(renderHtmlSync(input, {
            unsafe: true,
            extensions: { tagfilter: true },
        }), result)
    })
})

describe('Extension: tasklist', () => {
    it('Enable task lists', () => {
        const input = outdent(`
        - [ ] hello
        - [x] world
        `)
        const result = `
        <ul>
            <li><input type="checkbox" disabled="" /> hello</li>
            <li><input type="checkbox" checked="" disabled="" /> world</li>
        </ul>
        `
        assertNotEqual(renderHtmlSync(input), result)
        assertEqual(renderHtmlSync(input, {
            extensions: { tasklist: true },
        }), result)
    })

    // https://github.com/github/cmark-gfm/issues/168
    it('Handle nested sublists correctly', () => {
        const input = outdent(`
        - [x] Handle
          - [ ] nested
          - [x] sublists
        - [ ] correctly
        `)
        const result = `
        <ul>
            <li><input type="checkbox" checked="" disabled="" /> Handle
                <ul>
                    <li><input type="checkbox" disabled="" /> nested</li>
                    <li><input type="checkbox" checked="" disabled="" /> sublists</li>
                </ul>
            </li>
            <li><input type="checkbox" disabled="" /> correctly</li>
        </ul>
        `
        assertNotEqual(renderHtmlSync(input), result)
        assertEqual(renderHtmlSync(input, {
            extensions: { tasklist: true },
        }), result)
    })
})
