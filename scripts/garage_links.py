"""Collect links to/from garage pages.

Could be an 11ty plugin, lazily just a python script to have git run before committing.

Usage:
python scripts/garage_links.py

To run before each commit, make a file at .git/hooks/pre-commit with the contents:
    #!/bin/bash

    # Update links
    python scripts/garage_links.py
    git add assets/garage/link_graph.json
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


# datepath_slug_finder = re.compile(r"\/\d+-\d+-\d+-(\S+)\.md")  # deprecated


def main() -> None:
    # settings
    # NOTE: Ensuring URL ends with "/" to avoid assets, which blows up the size of the
    # link graph like 5x. However, that means it also doesn't support linking to
    # sections, like "/post/foo/#bar". So if you want to support that, change the regex.
    # NOTE: Still accidentally had assets with map data. Removing below. Now maybe can
    # change back and allow section links. Do this at some point maybe.
    link_finder = re.compile(r"{{\s*\"(\S+/)\"\s*\|\s*url\s*}}")
    out_path = "assets/garage/link_graph.json"

    res: Dict[str, Entry] = defaultdict(
        lambda: {"title": "", "url": "", "incoming": set(), "outgoing": set()}
    )
    for post in get_posts():
        url = post["url"]
        res[url]["title"] = post["frontmatter"]["title"]
        res[url]["url"] = url
        outgoing = [
            p
            for p in re.findall(link_finder, post["contents"])
            if not p.startswith("/assets/")
        ]
        res[url]["outgoing"].update(outgoing)
        for o in outgoing:
            res[o]["incoming"].add(url)

    res_out = {
        k: {
            "title": v["title"],
            "url": v["url"],
            "incoming": sorted(list(v["incoming"])),
            "outgoing": sorted(list(v["outgoing"])),
        }
        for k, v in res.items()
    }

    write(out_path, json.dumps(res_out, sort_keys=True, ensure_ascii=False))


if __name__ == "__main__":
    main()
