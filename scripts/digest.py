"""Monthly digest

Steps:
- edit DATE_START, DATE_END (they are inclusive) TODO: turn into cmd line args!

Example:

# -> website
python scripts/digest.py \
    --target website \
    digests/2024-06.md \
    > posts/blog/2024-06-07-june-2024-monthly-digest.md

# -> clipboard (for email)
python scripts/digest.py \
    --target email \
    digests/2024-06.md \
    | pbcopy

This script involves some wild hackery. E.g., we render markdown as HTML and then parse
the HTML to get back the original text. It also relies on python implementation of
eleventy features (in common).

Other than that, it's actually _pretty_ straightforward. The big footgun with generating
email digests is that email clients are way out-of-date about what HTML/CSS they'll
render. So we use old-school <table>s for formatting. It works fine.

====

UPDATES FOR THE BUTTONDOWN ERA:
- dumping HTML works
- can dump markdown, but it will be unstyled
- can't use CSS (yet), but will preserve inline styles

Plan
- using a source template that will generate
    - email newsletter (markdown / html)
    - blog post on website (markdown / njk)
        - note: can always re-generate w/ updates, e.g., to post embeds
"""

import argparse
import code  # type: ignore
from collections import defaultdict
from datetime import date, datetime
import os
import re
import sys
import traceback
from typing import Optional, Any

import frontmatter  # type: ignore
from bs4 import BeautifulSoup
from jinja2 import Template
import mistune  # type: ignore

from common import get_posts, Post

DATE_START = date(2024, 2, 1)  # inclusive
DATE_END = date(2024, 6, 30)  # inclusive


GARAGE_NOTICE = """
The Garage is an experiment in
[working with the garage door up](https://maxwellforbes.com/garage/what-is-the-garage/).
These are small notes, unpolished thoughts, or work in progress.
"""

EXCERPT_CHARS = 128
IMG_WIDTH = 250
DOMAIN = "https://maxwellforbes.com"


def insert_domain(orig: str):
    """Parses orig (can be whole post! it seems?) and appends domain to things that look
    like:

    "/assets/WHATEVER"
    (/assets/WHATEVER)

    TODO: make `replacement` have `DOMAIN` (though lol probs never gonna change).
    """
    pattern = r'([("])(/assets/[^()"]+)([)"])'
    replacement = r"\1https://maxwellforbes.com\2\3"
    result = re.sub(pattern, replacement, orig)
    return result


def get_date_html(display_date: date) -> str:
    return f"""<span style="font-weight: bold; color: #cccccc">{display_date.strftime("%B %-d, %Y")}</span>"""


def get_publish_date_html(publish_date: date) -> str:
    """This is used only when there's both a display and publish date.
    It shows the publish date in addition.
    """
    return f"""<span style="color: #cccccc"> (published {publish_date.strftime("%-m/%-d/%y")})</span>"""


def render_image(
    post_url: str,
    image_url: str,
    title: str,
    display_date: date,
    publish_date: date,
    excerpt: Optional[str],
    domain: str,
):
    if display_date == publish_date:
        date_html = get_date_html(display_date)
    else:
        date_html = get_date_html(display_date) + get_publish_date_html(publish_date)
    return f"""
<table style="border: none; width: 100%" width="100%">
	<tbody>
		<tr>
			<td style="width: 40%; padding-right: 10px;" width="40%">
                <a href="{domain + post_url}">
                    <img class="tl-email-image" src="{domain + image_url}" style="width: 100%;" />
                </a>
            </td>
			<td style="width: 60%; padding-left: 10px;" width="60%">
                {date_html}<br>
                <a href="{domain + post_url}">
                    <b>{title}</b>
                </a>
                { excerpt if excerpt is not None else ''}
            </td>
		</tr>
	</tbody>
</table>
"""


def render_sketch(post: Post, domain: str):
    post_url, image_url = post["url"], post["frontmatter"]["image"]
    return f"""
<div style="float: left;">
    <a href="{domain + post_url}">
        <img class="tl-email-image" src="{domain + image_url}" style="width: {IMG_WIDTH}px; margin: 10px;" />
    </a>
</div>
"""


def get_excerpt(post: Post) -> str:
    if "customexcerpt" in post["frontmatter"]:
        return "<p>" + post["frontmatter"]["customexcerpt"] + "</p>"
    if "microblog" in post["path"]:
        return mistune.html(post["contents"])  # type: ignore

    # yes, we're going to render markdown as html, then parse the html, then get the
    # normal text that we wrote in there lmaooo
    soup = BeautifulSoup(mistune.html(post["contents"]), "html.parser")  # type: ignore
    els = soup.find_all(["p", "li"])
    buf: list[str] = []

    # enable to manually check a post
    # if post["frontmatter"]["title"] == "Writing vs Blogging":
    #     code.interact(local=dict(globals(), **locals()))

    for el in els:
        if len(el.attrs) > 0:
            continue
        txt = el.get_text().strip()
        if txt.startswith("![]("):
            continue
        if txt.startswith("&lt;img"):
            continue
        if txt.startswith("<img"):
            continue
        if txt.startswith("{%"):
            continue
        if txt.startswith("[^"):
            continue
        buf.append(txt)

    text = " ".join(buf)
    words = text.split(" ")
    res = words[0]
    for word in words[1:]:
        if len(res) >= EXCERPT_CHARS:
            res += "&#x2026;"  # …
            break
        res += " " + word

    # print(post["frontmatter"]["title"])
    # print(text)  # full (for checking)
    # print(res)  # excerpt
    # print()
    # code.interact(local=dict(globals(), **locals()))

    return "<p>" + res + "</p>"


def render_text(
    post_url: str, title: str, display_date: date, excerpt: str, domain: str
) -> str:
    return f"""
<p>
    <a href="{domain + post_url}">
        <b>{title}</b>
    </a>&nbsp;&nbsp;&nbsp;{get_date_html(display_date)}
</p>
{excerpt}
"""


def get_display_date(post: Post) -> date:
    if "travel_end" in post["frontmatter"]:
        return post["frontmatter"]["travel_end"]
    return get_publish_date(post)


def get_publish_date(post: Post) -> date:
    if "date" in post["frontmatter"]:
        publish_date = post["frontmatter"]["date"]
    else:
        matches = re.findall(r"\d\d\d\d-\d\d-\d\d", post["path"])
        if len(matches) != 1:
            raise ValueError(
                "No date in frontmatter, and couldn't determine from path for: "
                + post["path"]
            )
        publish_date = date(*(int(x) for x in matches[0].split("-")))

    if isinstance(publish_date, datetime):
        publish_date = publish_date.date()
    return publish_date


def render_post(post: Post, domain: str) -> str:
    try:
        title = (
            post["frontmatter"]["series"] + ": " + post["frontmatter"]["title"]
            if "series" in post["frontmatter"]
            else post["frontmatter"]["title"]
        )
        if "image" in post["frontmatter"]:
            return render_image(
                post["url"],
                post["frontmatter"]["image"],
                title,
                get_display_date(post),
                get_publish_date(post),
                get_excerpt(post),
                domain,
            )
        else:
            return render_text(
                post["url"],
                title,
                get_display_date(post),
                get_excerpt(post),
                domain,
            )
    except Exception:
        print("ERROR processing", post["path"], file=sys.stderr)
        traceback.print_exc()
        exit(1)


RENDERERS = defaultdict(lambda: render_post, {"sketches": render_sketch})


def main():
    parser = argparse.ArgumentParser(
        description=("Generate monthly digest from template."),
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "template_path",
        type=str,
        help="Path to template (markdown + jinja2)",
    )
    parser.add_argument(
        "--target",
        type=str,
        choices=["email", "website"],
        required=True,
        help="Are we generating the email or website content?",
    )
    args = parser.parse_args()

    for path in [args.template_path]:
        if not os.path.exists(path):
            print("ERROR:", path, "not found.")
            exit(1)

    digest_post = frontmatter.load(args.template_path)  # type: ignore
    # fm has 'content' (file after YAML frontmatter), plus all other fm
    digest_fm: dict[str, Any] = digest_post.to_dict()
    digest_post.content = ""  # remove content to render out just the yaml frontmatter

    # format top (different for website and post)
    # ---
    if args.target == "website":
        fm_str: str = frontmatter.dumps(digest_post)  # type: ignore
        top = f"""{fm_str}

{{% img2 [
    "{digest_fm['imgNewsletterGeneral']}",
    "{digest_fm['imgNewsletterIssue']}"
], true %}}

<p class="figcaption">{digest_fm['imgNewsletterIssueCaption']}</p>
"""
    else:
        # email
        top = f"""
![]({DOMAIN} + {digest_fm['imgNewsletterGeneral']})

![]({DOMAIN} + {digest_fm['imgNewsletterIssue']})

_{digest_fm['imgNewsletterIssueCaption']}_
"""

    # format post contents (different for website and post)
    if args.target == "website":
        template = Template(digest_fm["content"])
    else:
        # email
        template = Template(insert_domain(digest_fm["content"]))

    # generate post summaries
    # -----
    # filter by date and sort into categories
    collections: dict[str, list[Post]] = defaultdict(lambda: [])
    n_posts = 0
    for post in get_posts():
        publish_date = get_publish_date(post)
        if publish_date < DATE_START or publish_date > DATE_END:
            continue

        # omit monthly digests themselves
        if post["path"].endswith("monthly-digest.md"):
            continue

        # print(post["path"])
        # print(post["url"])
        # print(post["frontmatter"])
        # print()

        # category_path is like 'garage' or 'microblog#2023...'
        category_path = post["url"].split("/")[1]
        category = (
            category_path.split("#")[0] if "#" in category_path else category_path
        )
        collections[category].append(post)
        n_posts += 1
        # print(post["url"], category)

        # exit(0)

    print(
        "INFO: Candidates:",
        n_posts,
        "posts from",
        len(collections),
        "categories",
        file=sys.stderr,
    )

    cat_order = defaultdict(
        lambda: 10,
        {
            "posts": 1,
            "sketches": 2,
            "blog": 3,
            "garage": 4,  # note that this might be omitted below
        },
    )
    # categories to not include in the digest
    cat_omit = {
        # "garage",
        # "microblog",
    }

    # render all posts
    posts_buf: list[str] = []
    for category in sorted(collections.keys(), key=lambda c: cat_order[c]):
        if category in cat_omit:
            print("INFO: Category", category, " - skipping", file=sys.stderr)
            continue
        posts = collections[category]
        posts_buf.append(f"<h2>{category.capitalize()}</h2>")
        if category == "garage":
            posts_buf.append(GARAGE_NOTICE)
        if category == "sketches":
            posts_buf.append("<div style='overflow: auto;'>")

        sorted_posts = sorted(posts, key=lambda p: get_publish_date(p))
        for post in sorted_posts:
            posts_buf.append(
                RENDERERS[category](
                    post, domain=DOMAIN if args.target == "email" else ""
                )
            )
            if category != "sketches":
                posts_buf.append("<br>")
        if category == "sketches":
            posts_buf.append("</div><br>")
        print(
            "INFO: Category",
            category,
            " - added",
            len(sorted_posts),
            "posts",
            file=sys.stderr,
        )
        posts_buf.append("<br><br>")

    posts_html = "\n".join(posts_buf)
    print(top + "\n" + template.render(posts=posts_html))

    # contents = [p for p in collections["blog"] if p["url"] == "/blog/porto/"][0]["contents"]
    # code.interact(local=dict(globals(), **locals()))


if __name__ == "__main__":
    main()
