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

from mbforbes_python_utils import read, write
from typing_extensions import TypedDict


class Entry(TypedDict):
    title: str
    url: str
    incoming: Set[str]
    outgoing: Set[str]


datepath_slug_finder = re.compile(r"\/\d+-\d+-\d+-(\S+)\.md")


def get_url(path: str) -> str:
    """Local path to URL, quite easy since URL is just subdir + filename.

    posts/posts/foo.md
    ->    posts/foo/
    """
    return ".".join(path[len("posts") :].split(".")[:-1]) + "/"


title_finder = re.compile(r"^title: (.*)$", re.MULTILINE)


def title(path: str, contents: str) -> str:
    titles = re.findall(title_finder, contents)
    if len(titles) != 1:
        print(f"ERROR: Expected 1 title for {path}, found:", titles)
        exit(1)
    res = titles[0]

    # Remove extra quoting done in front matter
    if res.startswith('"') and res.endswith('"'):
        res = res[1:-1]

    # Remove escaping done in front matter (JSON renderer will escape it)
    res = res.replace("\\", "")

    return res


def main() -> None:
    # settings
    globs = ["posts/**/*"]
    exts = ["md", "njk"]
    skip_prefix = "/software/"  # hacky; could do multi globs intstead or regex or ...
    link_finder = re.compile(r"{{\s*\"(\S+/)\"\s*\|\s*url\s*}}")
    out_path = "assets/garage/link_graph.json"

    res: Dict[str, Entry] = defaultdict(
        lambda: {"title": "", "url": "", "incoming": set(), "outgoing": set()}
    )
    for g in globs:
        for path in glob(g):
            if not path.split(".")[-1] in exts:
                continue
            url = get_url(path)
            if url.startswith(skip_prefix):
                continue
            contents = read(path)
            res[url]["title"] = title(path, contents)
            res[url]["url"] = get_url(path)
            outgoing = re.findall(link_finder, contents)
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
