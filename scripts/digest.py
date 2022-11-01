"""Monthly digest

Steps:
- edit DATE_START, DATE_END
- edit PREAMBLE (opt)
- edit POSTAMBLE
- run `python scripts/digest.py | pbcopy`

"""

import code
from collections import defaultdict
from datetime import date
import re
from typing import Optional

from bs4 import BeautifulSoup
import mistune

from common import get_posts, Post

DATE_START = date(2022, 10, 1)
DATE_END = date(2022, 10, 31)
# DISPLAY_MONTH = "September"
# SUBJECT = f"Max Forbes | {DISPLAY_MONTH} 2022 Digest"

PREAMBLE = """
<p>Hi everyone,</p>

<p>This is a summary of what I published in the last month over at my website.</p>
"""

POSTAMBLE = """
<h2>News</h2>

<p>
Still traveling! We'll spend November in Vietnam and The Philippines.
</p>

<p>
At this point I'll stop making promises about when I'll finally catch up with my travel writing. When I finally do, you'll of course see it here.
</p>

<br>

<p>
Yours,<br>
Max
</p>
"""

GARAGE_NOTICE = """
<p>
The Garage is an experiment in
<a href="https://maxwellforbes.com/garage/what-is-the-garage/">working with the garage door up</a>.
These are small notes, unpolished thoughts, or work in progress.
</p>
<br />
"""

EXCERPT_CHARS = 128
IMG_WIDTH = 250
DOMAIN = "https://maxwellforbes.com"


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
):
    if display_date == publish_date:
        date_html = get_date_html(display_date)
    else:
        date_html = get_date_html(display_date) + get_publish_date_html(publish_date)
    return f"""
<table style="border: none;">
	<tbody>
		<tr>
			<td style="padding-right: 10px;">
                <a href="{DOMAIN + post_url}">
                    <img class="tl-email-image" src="{DOMAIN + image_url}" style="width: {IMG_WIDTH}px;" />
                </a>
            </td>
			<td>
                {date_html}<br>
                <a href="{DOMAIN + post_url}">
                    <b>{title}</b>
                </a>
                { '<p>' + excerpt + '</p>' if excerpt is not None else ''}
            </td>
		</tr>
	</tbody>
</table>
"""


def render_sketch(post: Post):
    post_url, image_url = post["url"], post["frontmatter"]["image"]
    return f"""
    <div style="float: left;">
        <a href="{DOMAIN + post_url}">
            <img class="tl-email-image" src="{DOMAIN + image_url}" style="width: {IMG_WIDTH}px; margin: 10px;" />
        </a>
    </div>
    """


def get_excerpt(post: Post) -> str:
    if "customexcerpt" in post["frontmatter"]:
        return post["frontmatter"]["customexcerpt"]
    # yes, we're going to render markdown as html, then parse the html, then get the
    # normal text that we wrote in there lmaooo
    soup = BeautifulSoup(mistune.html(post["contents"]), "html.parser")
    els = soup.find_all(["p", "li"])
    buf = []

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

    return res


def render_text(post_url: str, title: str, display_date: date, excerpt: str) -> str:
    return f"""
    <p>
        <a href="{DOMAIN + post_url}">
            <b>{title}</b>
        </a>&nbsp;&nbsp;&nbsp;{get_date_html(display_date)}
    </p>
    <p>
        {excerpt}
    </p>
"""


def get_display_date(post: Post) -> date:
    if "travel_end" in post["frontmatter"]:
        return post["frontmatter"]["travel_end"]
    return get_publish_date(post)


def get_publish_date(post: Post) -> date:
    if "date" in post["frontmatter"]:
        return post["frontmatter"]["date"]
    matches = re.findall(r"\d\d\d\d-\d\d-\d\d", post["path"])
    if len(matches) != 1:
        raise ValueError(
            "No date in frontmatter, and couldn't determine from path for: "
            + post["path"]
        )
    return date(*(int(x) for x in matches[0].split("-")))


def render_post(post: Post) -> str:
    if "image" in post["frontmatter"]:
        return render_image(
            post["url"],
            post["frontmatter"]["image"],
            post["frontmatter"]["title"],
            get_display_date(post),
            get_publish_date(post),
            get_excerpt(post),
        )
    else:
        return render_text(
            post["url"],
            post["frontmatter"]["title"],
            get_display_date(post),
            get_excerpt(post),
        )


RENDERERS = defaultdict(lambda: render_post, {"sketches": render_sketch})


def main():
    # filter by date and sort into categories
    collections = defaultdict(lambda: [])
    for post in get_posts():
        publish_date = get_publish_date(post)
        if publish_date < DATE_START or publish_date > DATE_END:
            continue
        # print(post["path"])
        # print(post["url"])
        # print(post["frontmatter"])
        # print()

        category = post["url"].split("/")[1]
        collections[category].append(post)

        # exit(0)

    cat_order = defaultdict(
        lambda: 10,
        {
            "posts": 1,
            "sketches": 2,
            "blog": 3,
            "garage": 4,
        },
    )

    # render all posts
    buf = [PREAMBLE]
    for category in sorted(collections.keys(), key=lambda c: cat_order[c]):
        posts = collections[category]
        buf.append(f"<h2>{category.capitalize()}</h2>")
        if category == "garage":
            buf.append(GARAGE_NOTICE)
        if category == "sketches":
            buf.append("<div style='overflow: auto;'>")
        for post in sorted(posts, key=lambda p: get_publish_date(p)):
            buf.append(RENDERERS[category](post))
            if category != "sketches":
                buf.append("<br>")
        if category == "sketches":
            buf.append("</div><br>")
        buf.append("<br><br>")

    buf.append(POSTAMBLE)

    print("\n".join(buf))

    # contents = [p for p in collections["blog"] if p["url"] == "/blog/porto/"][0]["contents"]
    # code.interact(local=dict(globals(), **locals()))


if __name__ == "__main__":
    main()
