/// <reference types="node" />
import { Transform } from 'stream';
interface IExtensions {
    /** Output web addresses and emails as hyperlinks.
     */
    autolink?: boolean;
    /** Enable the `~~strikethrough~~` syntax.
     */
    strikethrough?: boolean;
    /** Enable tables.
     */
    table?: boolean;
    /** Escape the following HTML tags: `title`, `textarea`, `style`, `xmp`,
     * `iframe`, `noembed`, `noframes`, `script`, and `plaintext`.
     */
    tagfilter?: boolean;
    /** Enable task lists.
     */
    tasklist?: boolean;
}
interface IOptions {
    /** Include a `data-sourcepos` attribute on all block elements.
     */
    sourcepos?: boolean;
    /** Render `softbreak` elements as hard line breaks.
     */
    hardbreaks?: boolean;
    /** Render raw HTML and unsafe links.
     */
    unsafe?: boolean;
    /** Render `softbreak` elements as spaces.
     */
    nobreaks?: boolean;
    /** Produce React-compatible output (JSX).
     */
    react?: boolean;
    /** Validate UTF-8 in the input before parsing, replacing illegal
     * sequences with the replacement character U+FFFD.
     */
    validateUtf8?: boolean;
    /** Convert straight quotes to curly, `---` to em dashes, `--` to en dashes.
     */
    smart?: boolean;
    /** Use GitHub-style `<pre lang="x">` tags for code blocks instead of
     * `<pre><code class="language-x">`.
     */
    githubPreLang?: boolean;
    /** Be liberal in interpreting inline HTML tags.
     */
    liberalHtmlTag?: boolean;
    /** Parse footnotes.
     */
    footnotes?: boolean;
    /** Only parse strikethroughs if surrounded by exactly 2 tildes.
     * Gives some compatibility with redcarpet.
     */
    strikethroughDoubleTilde?: boolean;
    /** Use `style` attributes to align table cells instead of `align` attributes.
     */
    tablePreferStyleAttributes?: boolean;
    /** Include the remainder of the info string in code blocks in
     * a separate attribute.
     */
    fullInfoString?: boolean;
    /** Enable extensions.
     */
    extensions?: IExtensions;
}
/** Transform stream which converts Markdown to HTML.
 */
export declare class StreamingParser extends Transform {
    private readonly _parser;
    private readonly _decoder;
    constructor(options?: IOptions);
    _transform(chunk: string, encoding: string, callback: Function): void;
    _flush(callback: Function): void;
    _destroy(_err: Error, callback: Function): void;
}
/** Convert Markdown to HTML synchronously.
 * @param input Markdown
 * @param options Options
 */
export declare function renderHtmlSync(input: string, options?: IOptions): string;
declare type RenderCallback = (err: Error | null, result?: string) => void;
/** Convert Markdown to HTML asynchronously.
 * @param input Markdown
 * @param options Options
 * @param callback Callback function
 */
export declare function renderHtml(input: string, options?: IOptions): Promise<string>;
export declare function renderHtml(input: string, callback?: RenderCallback): Promise<string>;
export declare function renderHtml(input: string, options?: IOptions, callback?: RenderCallback): Promise<string>;
export declare function version(): string;
export declare function createStreamingParser(options?: IOptions): StreamingParser;
export {};
