'use strict'

import load from 'bindings'
import { StringDecoder } from 'string_decoder'
import { Transform } from 'stream'

const bindings = load('binding.node')

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

export class StreamingParser extends Transform {
}
