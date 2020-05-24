'use strict'

const assert = require('assert').strict
const { assertEqual } = require('assert-equal-html')
const { describe, it } = require('smoltest')(exports)
const { Readable } = require('stream')

const { toString } = require('./utils')
const { renderHtml, renderHtmlSync, StreamingParser } = require('..')

describe('Usage: renderHtmlSync()', () => {
    it('Convert Markdown to HTML synchronously', () => {
        const input = '# hello, world'
        const result = '<h1>hello, world</h1>'
        assertEqual(renderHtmlSync(input), result)
    })

    it('Handle empty strings', () => {
        assertEqual(renderHtmlSync(''), '')
        assertEqual(renderHtmlSync('  '), '')
    })

    it('Reject null and undefined', () => {
        assert.throws(() => renderHtmlSync(null))
        assert.throws(() => renderHtmlSync(undefined))
    })
})

describe('Usage: renderHtml()', () => {
    describe('Convert Markdown to HTML asynchronously', () => {
        it('With async/await', async () => {
            const input = '# hello, world'
            const result = '<h1>hello, world</h1>'
            assertEqual(await renderHtml(input), result)
        })

        it('With Promises', () => {
            const input = '# hello, world'
            const result = '<h1>hello, world</h1>'
            return renderHtml(input)
                .then(_result => assertEqual(_result, result))
                .catch(() => assert(false))
        })

        it('With node-style callbacks', (done) => {
            const input = '# hello, world'
            const result = '<h1>hello, world</h1>'
            renderHtml(input, (err, _result) => {
                assert.ifError(err)
                assertEqual(_result, result)
                done()
            })
        })
    })

    it('Handle empty strings', async () => {
        assertEqual(await renderHtml(''), '')
        assertEqual(await renderHtml('  '), '')
    })

    it('Reject null and undefined', () => {
        assert.throws(() => renderHtml(null))
        assert.throws(() => renderHtml(undefined))
    })
})

describe('Usage: class StreamingParser', () => {
    it('Convert Markdown to HTML using a transform stream', async () => {
        const input = Readable.from(['# hello, world'])
        const result = '<h1>hello, world</h1>'
        const _result = await toString(input.pipe(new StreamingParser))
        assertEqual(_result, result)
    })
})
