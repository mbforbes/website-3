import code
from glob import glob
from typing import List, Dict, Any

import frontmatter
from typing_extensions import TypedDict


class Post(TypedDict):
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


def get_posts(
    glob_pattern="posts/**/*",
    exts=["md", "njk"],
    skip_url_prefixes=["/software/", "/news/"],
) -> List[Post]:
    posts: List[Post] = []
    for path in glob(glob_pattern):
        if not path.split(".")[-1] in exts:
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
