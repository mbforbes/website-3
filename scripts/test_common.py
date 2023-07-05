"""
Tests eleventy reimplementation features provided by common.py.
"""

from rich.console import Console

from common import get_url

C = Console()


worklist = [
    ("posts/sketches/follow-me.md", "/sketches/follow-me/"),
    ("posts/writing/typescript-ecs-aspects.md", "/posts/typescript-ecs-aspects/"),
    ("posts/writing/travel/2022-edinburgh.md", "/posts/2022-edinburgh/"),
    ("posts/writing/travel/2022-edinburgh.md", "/posts/2022-edinburgh/"),
    ("posts/blog/hot.md", "/blog/hot/"),
    ("posts/blog/2022-08-21-writing-vs-blogging.md", "/blog/writing-vs-blogging/"),
    ("posts/garage/spectators.md", "/garage/spectators/"),
    ("posts/research/gutenberg.md", "/posts/gutenberg/"),
    ("posts/microblog/20230221193300.md", "/microblog#20230221193300"),
]

failed = 0
for path, want_url in worklist:
    got_url = get_url(path)
    if want_url != got_url:
        C.print(f"❌ path: {path}")
        C.print(f"   want: {want_url}")
        C.print(f"   got: {got_url}")
        failed += 1

total = len(worklist)
if failed > 0:
    C.print(f"❌ Failed {failed}/{total} tests")
else:
    C.print(f"✅ Passed {total} tests")
