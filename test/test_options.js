'use strict'

const assert = require('assert').strict
const { assertEqual, assertNotEqual } = require('assert-equal-html')
const { describe, it } = require('smoltest')(exports)
const { outdent } = require('@mvasilkov/outdent')

const { renderHtmlSync } = require('..')

describe('Option: sourcepos', () => {
    it('Include a `data-sourcepos` attribute on all block elements', () => {
        const input = outdent(`
        Heading
        ===

        [Brave][1]

        [1]: https://brave.com/
        `)
        const result = `
        <h1 data-sourcepos="1:1-3:0">Heading</h1>
        <p data-sourcepos="4:1-4:10"><a href="https://brave.com/">Brave</a></p>
        `
        assertNotEqual(renderHtmlSync(input), result)
        assertEqual(renderHtmlSync(input, { sourcepos: true }), result)
    })
})

describe('Option: hardbreaks', () => {
    it('Render `softbreak` elements as hard line breaks', () => {
        const input = outdent(`
        aaa
        bbb
        `)
        const result = outdent(`
        <p>aaa<br />
        bbb</p>
        `, { endWithNewline: true })
        assert.notStrictEqual(renderHtmlSync(input), result)
        assert.strictEqual(renderHtmlSync(input, { hardbreaks: true }), result)
    })
})

describe('Option: unsafe', () => {
    it('Render raw HTML and unsafe links', () => {
        const input = outdent(`
        <div>hypertext</div>

        [link](javascript:alert(1))
        `)
        const result = `
        <div>hypertext</div>
        <p><a href="javascript:alert(1)">link</a></p>
        `
        assertNotEqual(renderHtmlSync(input), result)
        assertEqual(renderHtmlSync(input, { unsafe: true }), result)
    })

    it('Is safe by default', () => {
        const input = outdent(`
        <div>hypertext</div>

        [link](javascript:alert(1))
        `)
        const result = `
        <!-- raw HTML omitted -->
        <p><a href="">link</a></p>
        `
        assertEqual(renderHtmlSync(input, { unsafe: false }), result)
    })

    it('Is safe by default (React)', () => {
        const input = outdent(`
        <div>hypertext</div>

        [link](javascript:alert(1))
        `)
        const result = `
        <p><a href="">link</a></p>
        `
        assertEqual(renderHtmlSync(input, { react: true }), result)
    })
})

describe('Option: nobreaks', () => {
    it('Render `softbreak` elements as spaces', () => {
        const input = outdent(`
        aaa
        bbb
        `)
        const result = outdent(`
        <p>aaa bbb</p>
        `, { endWithNewline: true })
        assert.notStrictEqual(renderHtmlSync(input), result)
        assert.strictEqual(renderHtmlSync(input, { nobreaks: true }), result)
    })
})

describe('Option: react', () => {
    it('Produce React-compatible output (JSX)', () => {
        const input = outdent(`
        \`\`\`python
        print(1)
        \`\`\`
        `)
        const result = `
        <pre><code className="language-python">
        print(1)
        </code></pre>
        `
        assertNotEqual(renderHtmlSync(input), result)
        assertEqual(renderHtmlSync(input, { react: true }), result)
    })
})

describe('Option: validateUtf8', () => {
    it('Validate UTF-8 in the input before parsing', () => {
        const input = '\u0000'
        const result = '<p>\ufffd</p>\n'
        // assert.notStrictEqual(renderHtmlSync(input), result)
        assert.strictEqual(renderHtmlSync(input, { validateUtf8: true }), result)
    })
})

describe('Option: smart', () => {
    it('Convert straight quotes to curly, and dashes', () => {
        const input = outdent(`
        There are three lengths of what are all more or less dashes:
        hyphen (-), en dash (--), and em dash (---).

        We're suffering over the word 'so'. "So great answer."
        `)
        const result = `
        <p>There are three lengths of what are all more or less dashes:
        hyphen (-), en dash (–), and em dash (—).</p>
        <p>We’re suffering over the word ‘so’. “So great answer.”</p>
        `
        assertNotEqual(renderHtmlSync(input), result)
        assertEqual(renderHtmlSync(input, { smart: true }), result)
    })
})

describe('Option: githubPreLang', () => {
    it('Use GitHub-style `<pre lang="x">` tags for code blocks', () => {
        const input = outdent(`
        \`\`\`python
        print(1)
        \`\`\`
        `)
        const result = `
        <pre lang="python"><code>
        print(1)
        </code></pre>
        `
        assertNotEqual(renderHtmlSync(input), result)
        assertEqual(renderHtmlSync(input, { githubPreLang: true }), result)
    })
})

describe('Option: liberalHtmlTag', () => {
    it('Be liberal in interpreting inline HTML tags', () => {
        const input = `< div>hypertext</ div>`
        const result = outdent(`
        <p>< div>hypertext</ div></p>
        `, { endWithNewline: true })
        assert.notStrictEqual(renderHtmlSync(input, { unsafe: true }), result)
        assert.strictEqual(renderHtmlSync(input, {
            unsafe: true,
            liberalHtmlTag: true,
        }), result)
    })

    it('Is conservative by default', () => {
        const input = `< div>hypertext</ div>`
        const result = outdent(`
        <p>&lt; div&gt;hypertext&lt;/ div&gt;</p>
        `, { endWithNewline: true })
        assert.strictEqual(renderHtmlSync(input, { unsafe: true }), result)
    })
})

describe('Option: footnotes', () => {
    it('Parse footnotes', () => {
        const input = outdent(`
        I haven't lost an arm, brother.[^1]

        [^1]: It's right over there.
        `)
        const result = `
        <p>I haven't lost an arm, brother.
            <sup class="footnote-ref">
                <a href="#fn1" id="fnref1">1</a>
            </sup>
        </p>
        <section class="footnotes">
            <ol>
                <li id="fn1">
                    <p>It's right over there.
                        <a href="#fnref1" class="footnote-backref">↩</a>
                    </p>
                </li>
            </ol>
        </section>
        `
        assertNotEqual(renderHtmlSync(input), result)
        assertEqual(renderHtmlSync(input, { footnotes: true }), result)
    })

    it('Parse footnotes (React)', () => {
        const input = outdent(`
        I haven't lost an arm, brother.[^1]

        [^1]: It's right over there.
        `)
        const result = `
        <p>I haven't lost an arm, brother.
            <sup className="footnote-ref">
                <a href="#fn1" id="fnref1">1</a>
            </sup>
        </p>
        <section className="footnotes">
            <ol>
                <li id="fn1">
                    <p>It's right over there.
                        <a href="#fnref1" className="footnote-backref">↩</a>
                    </p>
                </li>
            </ol>
        </section>
        `
        assertNotEqual(renderHtmlSync(input), result)
        assertEqual(renderHtmlSync(input, { footnotes: true, react: true }), result)
    })
})

describe('Option: strikethroughDoubleTilde', () => {
    it('Only parse strikethroughs if surrounded by exactly 2 tildes', () => {
        const result = outdent(`
        <p><del>aaa</del></p>
        `, { endWithNewline: true })
        assertNotEqual(renderHtmlSync('~aaa~', {
            extensions: { strikethrough: true },
            strikethroughDoubleTilde: true,
        }), result)
        assertEqual(renderHtmlSync('~~aaa~~', {
            extensions: { strikethrough: true },
            strikethroughDoubleTilde: true,
        }), result)
    })

    it('Parse 1 tilde by default', () => {
        const result = outdent(`
        <p><del>aaa</del></p>
        `, { endWithNewline: true })
        assertEqual(renderHtmlSync('~aaa~', {
            extensions: { strikethrough: true },
        }), result)
        assertEqual(renderHtmlSync('~~aaa~~', {
            extensions: { strikethrough: true },
        }), result)
    })
})

describe('Option: tablePreferStyleAttributes', () => {
    it('Use `style` attributes to align table cells', () => {
        const input = outdent(`
        | Left-aligned | Center-aligned | Right-aligned |
        | :---         |     :---:      |          ---: |
        | git status   | git status     | git status    |
        `)
        const result = `
        <table>
            <thead>
                <tr>
                    <th style="text-align: left">Left-aligned</th>
                    <th style="text-align: center">Center-aligned</th>
                    <th style="text-align: right">Right-aligned</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="text-align: left">git status</td>
                    <td style="text-align: center">git status</td>
                    <td style="text-align: right">git status</td>
                </tr>
            </tbody>
        </table>
        `
        assertNotEqual(renderHtmlSync(input, {
            extensions: { table: true },
        }), result)
        assertEqual(renderHtmlSync(input, {
            extensions: { table: true },
            tablePreferStyleAttributes: true,
        }), result)
    })

    it('Use `align` attributes by default', () => {
        const input = outdent(`
        | Left-aligned | Center-aligned | Right-aligned |
        | :---         |     :---:      |          ---: |
        | git status   | git status     | git status    |
        `)
        const result = `
        <table>
            <thead>
                <tr>
                    <th align="left">Left-aligned</th>
                    <th align="center">Center-aligned</th>
                    <th align="right">Right-aligned</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td align="left">git status</td>
                    <td align="center">git status</td>
                    <td align="right">git status</td>
                </tr>
            </tbody>
        </table>
        `
        assertEqual(renderHtmlSync(input, {
            extensions: { table: true },
        }), result)
    })
})

describe('Option: fullInfoString', () => {
    it('Include the remainder of the info string in code blocks', () => {
        const input = outdent(`
        \`\`\`python 3.7.6
        print(1)
        \`\`\`
        `)
        const result = `
        <pre><code class="language-python" data-meta="3.7.6">
        print(1)
        </code></pre>
        `
        assertNotEqual(renderHtmlSync(input), result)
        assertEqual(renderHtmlSync(input, { fullInfoString: true }), result)
    })
})
