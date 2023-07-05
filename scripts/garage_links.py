"""Collect links to/from garage pages.

Could be an 11ty plugin, lazily just a python script to have git run before committing.

Usage:
python scripts/garage_links.py

To run before each commit, make a file at .git/hooks/pre-commit with the contents:
    #!/bin/bash

    # Update links
    python scripts/garage_links.py
    git add _data/link_graph.json

This script is tested in two parts:
 1. test_link_graph.py --- tests the accuracy of the generated link graph. In other
                           words, do links point to actual pages on the web server?

 2. test_link_finder.py --- tests the completeness of the link finding. In other words,
                            do we find links in pages where they exist?
"""

import argparse
import code
from collections import defaultdict
from glob import glob
import json
import logging
import re
import typing
from typing import List, Tuple, Set, Dict, Any, Optional, NamedTuple, Iterator, Union

from mbforbes_python_utils import write
from typing_extensions import TypedDict

from common import get_posts


class Entry(TypedDict):
    title: str
    url: str
    incoming: Set[str]
    outgoing: Set[str]


LINK_FINDER = re.compile(r"\((/[^)\s]*)\)")


def get_links(md_contents: str) -> Set[str]:
    """Detects links to our own site in raw md `contents`, ignoring `/assets/...`

    Notes:
    - This function also runs on nunjucks files (.njk). However, we never care about
    finding links in them. Right now (7/5/24), .njk files are for: layouts, index pages
    (index, studio), 404, map includes, admin files (redirects), and one sketch
    (cube-room, which could be changed). So we only worry about and test that this
    function works properly on markdown (.md) files.

    - A bit hacky, but ignoring /Users as well (for when I dump stack traces)
    """
    return set(
        [
            p
            for p in re.findall(LINK_FINDER, md_contents)
            if ((not p.startswith("/assets")) and (not p.startswith("/Users")))
        ]
    )


def filter_redirects_collections(urls: Set[str]) -> Set[str]:
    """Remove redirect URLs like /blog/ and collections like /studio/ from a set.

    For simplicity, get_links() detects links like /blog/, but we don't want to put them
    in our link graph because they're not real pages and don't have, e.g., real titles.

    Collections like /studio/ also don't need to be in there. We also strip anchors to
    remove /studio/#foo.
    """
    redirects = ["/blog/", "/garage/", "/posts/", "/sketches/", "/studio/"]
    pattern = "(" + "|".join(re.escape(r) for r in redirects) + ")(#.*)?$"
    return set([u for u in urls if not re.match(pattern, u)])


def clean_anchors(urls: Set[str]) -> Set[str]:
    """For canonical URLs, remove #anchors at the end.

    For outgoing links, it's fine to have #anchors at the end to link to a particular
    spot in a page.

    For incoming links, we don't want to make a separate entry for "/foo" and
    "/foo#bar", so we strip off the end.
    """
    return set([re.sub(r"#.*", "", url) for url in urls])


def main() -> None:
    # settings

    out_path = "_data/link_graph.json"

    res: Dict[str, Entry] = defaultdict(
        lambda: {"title": "", "url": "", "incoming": set(), "outgoing": set()}
    )
    for post in get_posts():
        url = post["url"]
        res[url]["title"] = post["frontmatter"]["title"]
        res[url]["url"] = url
        # NOTE: An issue that remains is /posts/foo/ and /posts/foo (no trailing slash)
        # are different. We many want to canonicalize them, but I'm not sure how trivial
        # this is.
        outgoing = filter_redirects_collections(get_links(post["contents"]))
        res[url]["outgoing"].update(outgoing)
        for o in clean_anchors(outgoing):
            res[o]["incoming"].add(url)

    # sanity check
    for value in res.values():
        if value["url"] in value["outgoing"]:
            print("⚠️ WARNING:", value["url"], 'contains itself in "outgoing"')
        if value["url"] in value["incoming"]:
            print("⚠️ WARNING:", value["url"], 'contains itself in "incoming"')

    res_out = {
        k: {
            "title": v["title"],
            "url": v["url"],
            "incoming": sorted(list(v["incoming"])),
            "outgoing": sorted(list(v["outgoing"])),
        }
        for k, v in res.items()
    }

    write(out_path, json.dumps(res_out, sort_keys=True, ensure_ascii=False, indent=4))


if __name__ == "__main__":
    main()
