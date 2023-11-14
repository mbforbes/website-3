"""
Common provides python implementations of eleventy mechanics for use in other scripts.

For example, eleventy crawls directories to find files to generate webpages (get_posts),
and it turns file paths into URLs based on configuration (get_url).

Partial tests for this file are in test_common.py.
"""

import code
from glob import glob
import os
import re
from typing import List, Dict, Any

import frontmatter
from typing_extensions import TypedDict


class Post(TypedDict):
    """`contents` has the raw (markdown or nunjucks) file contents, no preprocessing."""

    path: str
    url: str
    frontmatter: Dict[str, Any]
    contents: str


def get_url(path: str) -> str:
    """Local path to URL, pretty easy since URL is usually subdir + filename without ext.

    posts/sketches/foo.md
    ->   /sketches/foo/

    Only thing is we now have multiple folders (for ease of tagging) that map to
    /posts/:

    posts/writing/travel/foo.md
    ->   /posts/foo/

    posts/writing/foo.md
    ->   /posts/foo/

    posts/research/foo.md
    ->   /posts/foo/

    Other things we think about:
    - filenames that start with dates (strip that off)
    - microblog posts (link to /microblog#date rather than /microblog/date)
    """
    # remove ext, and might have date in filename that gets stripped off
    dirname, filename = os.path.split(path)
    postname = os.path.splitext(filename)[0] + "/"
    if len(re.findall(r"^\d\d\d\d-\d\d-\d\d-", postname)) == 1:
        postname = postname[len("XXXX-XX-XX-") :]

    # we remove "posts" from the dir, then add it back (as "/posts") later if it
    # actually is a "post" (i.e., all studio writing and research posts)
    postdir = dirname[len("posts") :]
    post_prefix_list = ["/writing/travel", "/writing", "/research"]
    for p in post_prefix_list:
        if postdir.startswith(p):
            postdir = "/posts" + postdir[len(p) :]

    # microblog posts are all on one page, so they get a # rather than /
    if postdir == "/microblog":
        # also remove trailing slash we added to postname
        return f"{postdir}#{postname[:-1]}"

    return os.path.join(postdir, postname)


def get_posts(
    glob_pattern: str = "posts/**/*",
    exts: list[str] = ["md", "njk"],
    skip_url_prefixes: list[str] = ["/software/", "/news/"],
    skip_underscore_file_prefix: bool = True,
) -> List[Post]:
    posts: List[Post] = []
    for path in glob(glob_pattern, recursive=True):
        if not path.split(".")[-1] in exts:
            continue
        if skip_underscore_file_prefix and os.path.basename(path).startswith("_"):
            continue
        url = get_url(path)
        if any([url.startswith(p) for p in skip_url_prefixes]):
            continue
        fm = frontmatter.load(path).to_dict()
        contents = fm["content"]
        del fm["content"]
        posts.append(
            {
                "path": path,
                "url": url,
                "frontmatter": fm,
                "contents": contents,
            }
        )
    return posts


# For testing
if __name__ == "__main__":
    posts = get_posts()
    code.interact(local=dict(globals(), **locals()))
