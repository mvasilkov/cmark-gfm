/// <reference types="node" />
import { Transform } from 'stream';
interface IExtensions {
    autolink?: boolean;
    strikethrough?: boolean;
    table?: boolean;
    tagfilter?: boolean;
    tasklist?: boolean;
}
interface IOptions {
    sourcepos?: boolean;
    hardbreaks?: boolean;
    unsafe?: boolean;
    nobreaks?: boolean;
    react?: boolean;
    validateUtf8?: boolean;
    smart?: boolean;
    githubPreLang?: boolean;
    liberalHtmlTag?: boolean;
    footnotes?: boolean;
    strikethroughDoubleTilde?: boolean;
    tablePreferStyleAttributes?: boolean;
    fullInfoString?: boolean;
    extensions?: IExtensions;
}
export declare class StreamingParser extends Transform {
    private readonly _parser;
    private readonly _decoder;
    constructor(options?: IOptions);
    _transform(chunk: string, encoding: string, callback: Function): void;
    _flush(callback: Function): void;
    _destroy(_err: Error, callback: Function): void;
}
export declare function renderHtmlSync(input: string, options?: IOptions): string;
declare type RenderCallback = (err: Error | null, result?: string) => void;
export declare function renderHtml(input: string, options?: IOptions): Promise<string>;
export declare function renderHtml(input: string, callback?: RenderCallback): Promise<string>;
export declare function renderHtml(input: string, options?: IOptions, callback?: RenderCallback): Promise<string>;
export declare function version(): string;
export declare function createStreamingParser(options?: IOptions): StreamingParser;
export {};
