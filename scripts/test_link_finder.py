"""
Tests completeness ½ of garage_links.py: do we find links where we should?

The accuracy ½ of garage_links.py (do all the generated links point to real pages?) is
tested in test_link_graph.py.
"""

from rich.console import Console

from garage_links import get_links

C = Console()
table = [
    # no: markdown, inline img, asset
    ("![](/assets/blog/smaller-posts/siciliano.jpg)", set()),
    # yes: markdown, post, trailing "/"
    (
        "[Every PhD is Different](/posts/every-phd-is-different/)",
        set(["/posts/every-phd-is-different/"]),
    ),
    # yes: markdown, blog, no trailing "/"
    # no: markdown, external
    (
        'I think the idea of "freedom in _only_ ways of looking" (from [last week](/blog/the-distant-rumble-of-change)) is the same thing as meta-rationality, which is the same thing as "[pattern and nebulosity](https://deconstructingyourself.com/dy-006-pattern-nebulosity-guest-david-chapman.html)," which is the same thing as "emptiness and form."',
        set(["/blog/the-distant-rumble-of-change"]),
    ),
    # yes: markdown, garage, trailing "/"
    # no: parenthesis in writing
    (
        "Been playing a lot of Neon White, post [here](/garage/on-neon-white/) (hope to add photos to it soon).",
        set(["/garage/on-neon-white/"]),
    ),
    # yes: two links on one line
    (
        "The pursuit of quality, [forever present](/posts/appropriate-quality/) and [long paralyzing](/posts/paralysis/)... could it be vanquished by making it a first-class citizen?",
        set(["/posts/appropriate-quality/", "/posts/paralysis/"]),
    ),
    # no: stack trace
    (
        "Template render error: (/Users/max/repos/website-3/_includes/programming-language-tooltips.njk) [Line 113, Column 21]",
        set(),
    ),
    # no: parentheses that starts with slash (a bit pathological)
    (
        "After finding out a restaurant we wanted to go to didn't exist (/ was under renovation / something Google Maps didn't know about), we went to the average",
        set(),
    ),
]
failed = 0
for contents, want in table:
    got = get_links(contents)
    if want != got:
        print(f"❌ Want {want} links but got {got} in {contents}")
        failed += 1

total = len(table)
if failed == 0:
    C.print(f"✅ Passed {total}/{total} tests")
else:
    C.print(f"❌ Passed {total-failed}/{total} tests, see failures above")
