from pathlib import Path
import platform
from setuptools import setup, Extension, distutils
from setuptools.command.build_ext import build_ext
import tempfile

README = Path(__file__).resolve().parent / 'README.md'


class get_pybind_include():
    'Helper class to determine the pybind11 include path.'

    def __str__(self):
        import pybind11
        return pybind11.get_include()


def supports_flag(compiler, flag):
    with tempfile.NamedTemporaryFile('w', suffix='.cpp', delete=False) as t:
        t.write('int main (int argc, char **argv) { return 0; }')

        try:
            compiler.compile([t.name], extra_postargs=[flag])
        except distutils.errors.CompileError:
            return False

        return True


def std_flag(compiler):
    flags = ['-std=c++17', '-std=c++14', '-std=c++11']

    for flag in flags:
        if supports_flag(compiler, flag):
            return flag

    raise RuntimeError('At least C++11 support is required.')


class BuildExt(build_ext):
    'A custom build extension for adding compiler-specific options.'

    compile_options = {
        'msvc': ['/EHsc'],
        'unix': [],
    }

    link_options = {
        'msvc': [],
        'unix': [],
    }

    def build_extensions(self):
        ct = self.compiler.compiler_type
        compile_options = self.compile_options.get(ct, [])
        link_options = self.link_options.get(ct, [])

        if platform.system() == 'Darwin':
            darwin_options = ['-stdlib=libc++', '-mmacosx-version-min=10.7']
            compile_options += darwin_options
            link_options += darwin_options

        if ct == 'unix':
            compile_options.append(std_flag(self.compiler))
            if supports_flag(self.compiler, '-fvisibility=hidden'):
                compile_options.append('-fvisibility=hidden')

            # Prevent error: invalid argument '-std=c++17' not allowed with 'C'
            actually_compile = self.compiler._compile

            def compile_wrapper(*args):
                a = list(args)
                if a[2] == '.c':
                    a[4] = ['-std=c99']
                return actually_compile(*a)

            self.compiler._compile = compile_wrapper

        for ext in self.extensions:
            ext.extra_compile_args = compile_options
            ext.extra_link_args = link_options

        build_ext.build_extensions(self)


setup(
    name='cmark_gfm',
    version='0.0.1',
    description=(
        'GitHub Flavored Markdown ¦ '
        'Native bindings for cmark-gfm, GitHub\'s fork of cmark, '
        'a CommonMark parsing and rendering library.'
    ),
    long_description=README.read_text(encoding='utf-8'),
    long_description_content_type='text/markdown',
    url='https://github.com/mvasilkov/cmark-gfm',
    author='Mark Vasilkov',
    author_email='mvasilkov@gmail.com',
    license='MIT',
    classifiers=[
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3 :: Only',
        'Topic :: Text Processing :: Markup',
    ],
    keywords=(
        'markdown commonmark cmark github-flavored-markdown '
        'github flavored markdown gfm cmark-gfm'
    ),
    ext_modules=[
        Extension(
            'cmark_gfm',
            # Sort input source files to ensure reproducible builds
            sorted([
                'src/cmark-gfm.cc',
                'vendor/cmark/arena.c',
                'vendor/cmark/blocks.c',
                'vendor/cmark/buffer.c',
                'vendor/cmark/cmark.c',
                'vendor/cmark/cmark_ctype.c',
                'vendor/cmark/footnotes.c',
                'vendor/cmark/houdini_href_e.c',
                'vendor/cmark/houdini_html_e.c',
                'vendor/cmark/houdini_html_u.c',
                'vendor/cmark/html.c',
                'vendor/cmark/inlines.c',
                'vendor/cmark/iterator.c',
                'vendor/cmark/linked_list.c',
                'vendor/cmark/map.c',
                'vendor/cmark/node.c',
                'vendor/cmark/plugin.c',
                'vendor/cmark/references.c',
                'vendor/cmark/registry.c',
                'vendor/cmark/render.c',
                'vendor/cmark/scanners.c',
                'vendor/cmark/syntax_extension.c',
                'vendor/cmark/utf8.c',
                'vendor/cmark/autolink.c',
                'vendor/cmark/core-extensions.c',
                'vendor/cmark/ext_scanners.c',
                'vendor/cmark/strikethrough.c',
                'vendor/cmark/table.c',
                'vendor/cmark/tagfilter.c',
                'vendor/cmark/tasklist.c',
            ]),
            include_dirs=[
                # Path to pybind11 headers
                get_pybind_include(),
                'vendor/cmark',
            ],
            language='c++',
        ),
    ],
    setup_requires=['pybind11>=2.5.0'],
    cmdclass={'build_ext': BuildExt},
    zip_safe=False,
)
