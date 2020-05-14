'use strict'

import load from 'bindings'
import { StringDecoder } from 'string_decoder'
import { Transform } from 'stream'

interface IExtensions {
    autolink?: boolean
    strikethrough?: boolean
    table?: boolean
    tagfilter?: boolean
    tasklist?: boolean
}

interface IOptions {
    // Options affecting rendering
    sourcepos?: boolean
    hardbreaks?: boolean
    unsafe?: boolean
    nobreaks?: boolean
    react?: boolean
    // Options affecting parsing
    validateUtf8?: boolean
    smart?: boolean
    githubPreLang?: boolean
    liberalHtmlTag?: boolean
    footnotes?: boolean
    strikethroughDoubleTilde?: boolean
    tablePreferStyleAttributes?: boolean
    fullInfoString?: boolean
    // Extensions
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

export function renderHtmlSync(input: string, options: IOptions = {}): string {
    return bindings.renderHtmlSync(input, options)
}

type RenderCallback = (err: Error | null, result?: string) => void

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
