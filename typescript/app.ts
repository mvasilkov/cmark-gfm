'use strict'

import load from 'bindings'
import { StringDecoder } from 'string_decoder'
import { Transform } from 'stream'

interface IExtensions {
    /** Output web addresses and emails as hyperlinks.
     */
    autolink?: boolean

    /** Enable the `~~strikethrough~~` syntax.
     */
    strikethrough?: boolean

    /** Enable tables.
     */
    table?: boolean

    /** Escape the following HTML tags: `title`, `textarea`, `style`, `xmp`,
     * `iframe`, `noembed`, `noframes`, `script`, and `plaintext`.
     */
    tagfilter?: boolean

    /** Enable task lists.
     */
    tasklist?: boolean
}

interface IOptions {
    // Options affecting rendering

    /** Include a `data-sourcepos` attribute on all block elements.
     */
    sourcepos?: boolean

    /** Render `softbreak` elements as hard line breaks.
     */
    hardbreaks?: boolean

    /** Render raw HTML and unsafe links.
     */
    unsafe?: boolean

    /** Render `softbreak` elements as spaces.
     */
    nobreaks?: boolean

    /** Produce React-compatible output (JSX).
     */
    react?: boolean

    // Options affecting parsing

    /** Validate UTF-8 in the input before parsing, replacing illegal
     * sequences with the replacement character U+FFFD.
     */
    validateUtf8?: boolean

    /** Convert straight quotes to curly, `---` to em dashes, `--` to en dashes.
     */
    smart?: boolean

    /** Use GitHub-style `<pre lang="x">` tags for code blocks instead of
     * `<pre><code class="language-x">`.
     */
    githubPreLang?: boolean

    /** Be liberal in interpreting inline HTML tags.
     */
    liberalHtmlTag?: boolean

    /** Parse footnotes.
     */
    footnotes?: boolean

    /** Only parse strikethroughs if surrounded by exactly 2 tildes.
     * Gives some compatibility with redcarpet.
     */
    strikethroughDoubleTilde?: boolean

    /** Use `style` attributes to align table cells instead of `align` attributes.
     */
    tablePreferStyleAttributes?: boolean

    /** Include the remainder of the info string in code blocks in
     * a separate attribute.
     */
    fullInfoString?: boolean

    // Extensions

    /** Enable extensions.
     */
    extensions?: IExtensions
}

declare class Parser {
    constructor(options: IOptions)
    isFinished(): boolean
    write(input: string, callback: Function): void
    finalize(callback: Function): void
    destroy(callback: Function): void
}

type Bindings = {
    Parser: typeof Parser
    renderHtmlSync(input: string, options: IOptions): string
    version: string
}

const bindings = load('binding.node') as Bindings

/** Transform stream which converts Markdown to HTML.
 */
export class StreamingParser extends Transform {
    private readonly _parser: Parser
    private readonly _decoder: StringDecoder

    constructor(options: IOptions = {}) {
        super({ decodeStrings: false })

        this._parser = new bindings.Parser(options)
        this._decoder = new StringDecoder
    }

    _transform(chunk: string, encoding: string, callback: Function): void {
        if (this._parser.isFinished()) {
            callback(Error('Cannot write additional data to a finished parser'))
            return
        }

        if (encoding === 'buffer') {
            chunk = this._decoder.write(chunk as any)
        }

        this._parser.write(chunk, callback)
    }

    _flush(callback: Function): void {
        this._parser.finalize((result: any) => {
            this.push(result, 'utf8')
            this.push(null)
            callback()
        })
    }

    _destroy(_err: Error, callback: Function): void {
        this._parser.destroy(callback)
    }
}

/** Convert Markdown to HTML synchronously.
 * @param input Markdown
 * @param options Options
 */
export function renderHtmlSync(input: string, options: IOptions = {}): string {
    return bindings.renderHtmlSync(input, options)
}

type RenderCallback = (err: Error | null, result?: string) => void

/** Convert Markdown to HTML asynchronously.
 * @param input Markdown
 * @param options Options
 * @param callback Callback function
 */
export function renderHtml(input: string, options?: IOptions): Promise<string>
export function renderHtml(input: string, callback?: RenderCallback): Promise<string>
export function renderHtml(input: string, options?: IOptions, callback?: RenderCallback): Promise<string>

export function renderHtml(input: string, options?: IOptions | RenderCallback, callback?: RenderCallback): Promise<string> {
    if (typeof input != 'string')
        throw TypeError('Expected the first argument to be a string')

    if (typeof options == 'function') {
        callback = options
        options = {}
    }

    const buf: string[] = []
    const parser = new StreamingParser(options)
    const promise = new Promise<string>((resolve, reject) => {
        parser.on('data', data => buf.push(data.toString()))
        parser.once('end', () => resolve(buf.join('')))
        parser.once('error', reject)
    })
    parser.write(input)
    parser.end()

    if (callback) {
        promise.then((result: string) => {
            callback!(null, result)
        }, (err: Error) => {
            callback!(err)
        })
    }

    return promise
}

export function version(): string {
    return bindings.version
}

// Backward compatibility
export function createStreamingParser(options?: IOptions): StreamingParser {
    return new StreamingParser(options)
}
