#include <pybind11/pybind11.h>

#include "cmark-gfm.h"
#include "cmark-gfm-core-extensions.h"
#include "parser.h"

using std::string;

string render_html(const string input, const int options) {
    cmark_gfm_core_extensions_ensure_registered();

    cmark_parser *parser = cmark_parser_new(options);
    cmark_parser_feed(parser, input.c_str(), input.length());
    char *result = cmark_render_html(cmark_parser_finish(parser),
                                     options, parser->syntax_extensions);
    cmark_parser_free(parser);

    string result_string(result);
    free(result);
    return result_string;
}

PYBIND11_MODULE(cmark_gfm, module) {
    module.doc() = "GitHub Flavored Markdown ¦ "
                   "Native bindings for cmark-gfm, GitHub's fork of cmark, "
                   "a CommonMark parsing and rendering library.";

    module.def("render_html", &render_html, "Convert Markdown to HTML synchronously.");
}
