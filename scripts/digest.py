"""Monthly digest

Steps:
- edit date_start, date_end, display_month
- edit preamble (opt)
- edit postamble
- run `python scripts/digest.py | pbcopy`

"""

import code
from collections import defaultdict
from datetime import date, datetime
from typing import Optional

from bs4 import BeautifulSoup
import mistune

from common import get_posts, Post

date_start = date(2022, 7, 1)
date_end = date(2022, 7, 31)
display_month = "September"

subject = f"Max Forbes | {display_month} 2022 Digest"

preamble = """
<p>Hi everyone,</p>

<p>This is a summary of what I've published in the last month at my website.</p>
"""

postamble = """
<h2>News</h2>

<p>I'm in Scotland right now. I'm still keeping my
<a href="https://maxwellforbes.com/whereami/">where am I</a>
page updated, but it will be more approximate as we're on a road trip through
the highlands.
</p>

<p>I tried to catch up with my blog in July. I'm still a bit behind (OK, like over a month), but I'm optimistic about catching up in August.</p>

<p>A big focus for me in July was redesigning more of the blog to better display photos.
You'll see some test pages about this in the Garage, and the blog posts from Crete onwards show bigger photos in new arrangements.
I hope you enjoy them.</p>

<br>

<p>
Yours,<br>
Max
</p>
"""

garage_notice = """
<p>
The Garage is an experiment in
<a href="https://maxwellforbes.com/garage/what-is-the-garage/">working with the garage door up</a>.
These are smaller experiments and notes.
</p>
<br />
"""

# filter by date and sort into categories
collections = defaultdict(lambda: [])
for post in get_posts():
    if (
        post["frontmatter"]["date"] < date_start
        or post["frontmatter"]["date"] > date_end
    ):
        continue
    # print(post["path"])
    # print(post["url"])
    # print(post["frontmatter"])
    # print()

    category = post["url"].split("/")[1]
    collections[category].append(post)

    # exit(0)

img_width = 250
domain = "https://maxwellforbes.com"


def date_html(post_date: date) -> str:
    return f"""<span style="font-weight: bold; color: #cccccc">{post_date.strftime("%B %-d, %Y")}</span>"""


def render_image(
    post_url: str, image_url: str, title: str, post_date: date, excerpt: Optional[str]
):
    return f"""
<table style="border: none;">
	<tbody>
		<tr>
			<td style="padding-right: 10px;">
                <a href="{domain + post_url}">
                    <img class="tl-email-image" src="{domain + image_url}" style="width: {img_width}px;" />
                </a>
            </td>
			<td>
                {date_html(post_date)}<br>
                <a href="{domain + post_url}">
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
        <a href="{domain + post_url}">
            <img class="tl-email-image" src="{domain + image_url}" style="width: {img_width}px; margin: 10px;" />
        </a>
    </div>
    """


excerpt_chars = 128


def get_excerpt(post: Post) -> str:
    if "customexcerpt" in post["frontmatter"]:
        return post["frontmatter"]["customexcerpt"]
    # yes, we're going to render markdown as html, then parse the html, then get the
    # normal text that we wrote in there lmaooo
    soup = BeautifulSoup(mistune.html(post["contents"]), "html.parser")
    els = soup.find_all(["p", "li"])
    buf = []

    # enable to manually check a post
    # if post["frontmatter"]["title"] == "weatherspread":
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
        buf.append(txt)

    text = " ".join(buf)
    words = text.split(" ")
    res = words[0]
    for word in words[1:]:
        if len(res) >= excerpt_chars:
            res += "&#x2026;"  # …
            break
        res += " " + word

    # print(post["frontmatter"]["title"])
    # print(text)  # full (for checking)
    # print(res)  # excerpt
    # print()
    # code.interact(local=dict(globals(), **locals()))

    return res


def render_text(post_url: str, title: str, post_date: date, excerpt: str) -> str:
    return f"""
    <p>
        <a href="{domain + post_url}">
            <b>{title}</b>
        </a>&nbsp;&nbsp;&nbsp;{date_html(post_date)}
    </p>
    <p>
        {excerpt}
    </p>
"""


def render_post(post: Post) -> str:
    if "image" in post["frontmatter"]:
        return render_image(
            post["url"],
            post["frontmatter"]["image"],
            post["frontmatter"]["title"],
            post["frontmatter"]["date"],
            get_excerpt(post),
        )
    else:
        return render_text(
            post["url"],
            post["frontmatter"]["title"],
            post["frontmatter"]["date"],
            get_excerpt(post),
        )


renderers = defaultdict(lambda: render_post, {"sketches": render_sketch})

# render all posts
buf = [preamble]
for category, posts in collections.items():
    buf.append(f"<h2>{category.capitalize()}</h2>")
    if category == "garage":
        buf.append(garage_notice)
    if category == "sketches":
        buf.append("<div style='overflow: auto;'>")
    for post in sorted(posts, key=lambda x: x["frontmatter"]["date"]):
        buf.append(renderers[category](post))
        if category != "sketches":
            buf.append("<br>")
    if category == "sketches":
        buf.append("</div><br>")
    buf.append("<br><br>")

buf.append(postamble)


print("\n".join(buf))

# contents = [p for p in collections["blog"] if p["url"] == "/blog/porto/"][0]["contents"]
# code.interact(local=dict(globals(), **locals()))
