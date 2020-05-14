'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStreamingParser = exports.version = exports.renderHtml = exports.renderHtmlSync = exports.StreamingParser = void 0;
const bindings_1 = __importDefault(require("bindings"));
const string_decoder_1 = require("string_decoder");
const stream_1 = require("stream");
const bindings = bindings_1.default('binding.node');
class StreamingParser extends stream_1.Transform {
    constructor(options = {}) {
        super({ decodeStrings: false });
        this._parser = new bindings.Parser(options);
        this._decoder = new string_decoder_1.StringDecoder;
    }
    _transform(chunk, encoding, callback) {
        if (this._parser.isFinished()) {
            callback(Error('Cannot write additional data to a finished parser'));
            return;
        }
        if (encoding === 'buffer') {
            chunk = this._decoder.write(chunk);
        }
        this._parser.write(chunk, callback);
    }
    _flush(callback) {
        this._parser.finalize((result) => {
            this.push(result, 'utf8');
            this.push(null);
            callback();
        });
    }
    _destroy(_err, callback) {
        this._parser.destroy(callback);
    }
}
exports.StreamingParser = StreamingParser;
function renderHtmlSync(input, options = {}) {
    return bindings.renderHtmlSync(input, options);
}
exports.renderHtmlSync = renderHtmlSync;
function renderHtml(input, options, callback) {
    if (typeof input != 'string')
        throw TypeError('Expected the first argument to be a string');
    if (typeof options == 'function') {
        callback = options;
        options = {};
    }
    const buf = [];
    const parser = new StreamingParser(options);
    const promise = new Promise((resolve, reject) => {
        parser.on('data', data => buf.push(data.toString()));
        parser.once('end', () => resolve(buf.join('')));
        parser.once('error', reject);
    });
    parser.write(input);
    parser.end();
    if (callback) {
        promise.then((result) => {
            callback(null, result);
        }, (err) => {
            callback(err);
        });
    }
    return promise;
}
exports.renderHtml = renderHtml;
function version() {
    return bindings.version;
}
exports.version = version;
// Backward compatibility
function createStreamingParser(options) {
    return new StreamingParser(options);
}
exports.createStreamingParser = createStreamingParser;
