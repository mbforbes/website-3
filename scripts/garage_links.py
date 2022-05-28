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
    """Local path to URL, pretty easy since URL is usually subdir + filename without ext.

    posts/sketches/foo.md
    ->   /sketches/foo/

    Only thing is we now have multiple folders (for ease of tagging) that map to
    /posts/:

    posts/writing/foo.md
    ->   /posts/foo/

    posts/research/foo.md
    ->   /posts/foo/

    """
    res = ".".join(path[len("posts") :].split(".")[:-1]) + "/"
    post_prefix_list = ["/writing/", "/research/"]
    for p in post_prefix_list:
        if res.startswith(p):
            res = "/posts/" + res[len(p) :]

    return res


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
    # hacky; could do multi globs instead or regex or ...
    skip_prefixes = ["/software/", "/news/"]
    # NOTE: Ensuring URL ends with "/" to avoid assets, which blows up the size of the
    # link graph like 5x. However, that means it also doesn't support linking to
    # sections, like "/post/foo/#bar". So if you want to support that, change the regex.
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
            if any([url.startswith(p) for p in skip_prefixes]):
                continue
            contents = read(path)
            res[url]["title"] = title(path, contents)
            res[url]["url"] = url
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
