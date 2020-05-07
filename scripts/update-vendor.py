#!/usr/bin/env python3

from itertools import chain
from pathlib import Path
from subprocess import check_call

root_dir = Path(__file__).parents[1].resolve(strict=True)
vendor = root_dir / 'vendor' / 'cmark'
vendor_git = vendor / 'cmark'

skip_files = frozenset((
    'CMakeCCompilerId.c',
    'CheckFileOffsetBits.c',
    'cmark-fuzz.c',
    'cplusplus.h',
    'harness.c',
    'harness.h',
    'main.c',
    # Rendering
    'commonmark.c',
    'latex.c',
    'man.c',
    'plaintext.c',
    'xml.c',
))


def clean():
    for a in vendor.iterdir():
        if a.is_file():
            a.unlink()


def build():
    check_call(['make'], cwd=vendor_git)


def copy():
    files = chain.from_iterable([
        vendor_git.glob(f'**/*.{a}') for a in ('c', 'h', 'inc')
    ])
    for a in files:
        if a.is_file() and a.name not in skip_files:
            # Copy `a` to `vendor`
            (vendor / a.name).write_bytes(a.read_bytes())


def patch():
    config = vendor / 'config.h'
    a = config.read_text(encoding='utf-8')
    a = a.replace('#define HAVE___BUILTIN_EXPECT\n', '', 1)
    config.write_text(a, encoding='utf-8')


def git_patch(a: str):
    check_call(['git', 'apply', f'patches/{a}.patch'], cwd=root_dir)


def run():
    print('Clean')
    clean()
    print('Make')
    build()
    print('Copy')
    copy()
    print('Patch')
    patch()
    print('Patch (React)')
    git_patch('react')
    print('Patch (Rendering)')
    git_patch('rendering')
    print('Done')


if __name__ == '__main__':
    run()
