"""The great migration"""

import code
import glob
import os
import re
import shutil

src_root_dir = os.path.expanduser("~/repos/website/")
src_post_dir = os.path.expanduser("~/repos/website/_posts/")
src_garage_dir = os.path.expanduser("~/repos/website/_garage/")

dst_root_dir = os.path.expanduser("~/repos/website-3/")
dst_post_dir = os.path.expanduser("~/repos/website-3/posts/posts/")
dst_sketch_dir = os.path.expanduser("~/repos/website-3/posts/sketches/")
dst_garage_dir = os.path.expanduser("~/repos/website-3/posts/garage/")


def build_worklist(src_dir):
    src_paths = glob.glob(src_dir + "*.md")
    worklist = []
    for src_path in src_paths:
        basename = os.path.basename(src_path)
        if src_dir.endswith("_garage/"):
            new_basename = basename
            is_sketch = False
            redirect_url = None
            dst_path = dst_garage_dir + new_basename
        else:
            pieces = basename.split("-")
            new_basename = "-".join(pieces[3:])  # modified below if sketch
            is_sketch = (
                new_basename.startswith("sketch")
                or new_basename.startswith("voxel")
                or new_basename.startswith("t-shirt")
            )
            redirect_url = None
            if is_sketch and new_basename.startswith("sketch-"):
                redirect_url = "/posts/" + new_basename[:-3] + "/"
                new_basename = new_basename[len("sketch-") :]
            dst_path = (
                dst_sketch_dir + new_basename
                if is_sketch
                else dst_post_dir + new_basename
            )
        worklist.append(
            {
                "is_sketch": is_sketch,
                "new_basename": new_basename,
                "redirect_url": redirect_url,
                "src": src_path,
                "dst": dst_path,
                "finished": os.path.exists(dst_path)
                or os.path.exists(dst_path[:-3] + ".njk"),
            }
        )
    n_finished = sum([w["finished"] for w in worklist])
    print(
        f"Worklist: {len(worklist)} ({n_finished} finished, {len(worklist) - n_finished} remaining)"
    )

    return worklist


def process_match(out_line, match, add_parens, output_raw, prefix=None, postfix=None):
    """
    Potential translations

    Assets:
               /data/foo/bar.x
    -> /assets/posts/foo/bar.x

    Raw post files (_posts, _blog, _garage)
    _posts/YYYY-MM-DD-foo-bar.md
    ->         /posts/foo-bar/

    URLs (/posts/)
      /posts/foo-bar
    > /posts/foo-bar/

    Assets directly linked w/ src="..."
          src="/foo/bar.x"
    > src="{{ "/foo/bar.x" | url }}"

    If output raw, nothing else added. Otherwise:
    - output is {{ "result" | url }}
    - if add parens, this becomes ({{ "result" | url }})
    - then any prefix and postfix are added
    """
    assert len(match.groups()) == 1
    url = match.groups()[0]
    is_asset = False

    if url.startswith("/data/"):
        is_asset = True
        assert len(url.split("/")) >= 4
        pieces = url.split("/")
        subdir = pieces[2]
        filename = "/".join(pieces[3:])  # may be just file, or foo/file.x, both ok
        # old:
        # _, __, subdir, filename = url.split("/")
        new_url = f"/assets/posts/{subdir}/{filename}"
    elif url.startswith("/dev/lib/"):
        is_asset = True
        assert len(url.split("/")) == 4
        _blank, _dev, _lib, filename = url.split("/")
        new_url = f"/assets/lib/{filename}"
    elif url.startswith("/posts/"):
        assert len(url.split("/")) == 3
        _, __, path = url.split("/")
        assert not path.endswith(".md")
        new_url = f"/posts/{path}/"
    elif (
        url.startswith("_posts/")
        or url.startswith("_blog/")
        or url.startswith("_garage/")
    ):
        assert len(url.split("/")) == 2
        _category, filename = url.split("/")
        assert filename.endswith(".md")
        category = _category[1:]
        postname = filename[:-3]
        if url.startswith("_posts/") or url.startswith("_blog/"):
            postname = postname[len("yyyy-mm-dd-") :]
        new_url = f"/{category}/{postname}/"
    else:
        print(f"WARNING: Copying URL: '{url}'")
        new_url = url

    # make the new name, w/ any modifications
    start, stop = match.span()
    if output_raw:
        new_text = new_url
    else:
        new_text = f'{{{{ "{new_url}" | url }}}}'
        if add_parens:
            new_text = "(" + new_text + ")"
        if prefix is not None:
            new_text = prefix + new_text
        if postfix is not None:
            new_text = new_text + postfix
    out_line = out_line[:start] + new_text + out_line[stop:]

    translate_dirs = {}
    if is_asset:
        # map from old: new for assets
        translate_dirs[src_root_dir + os.path.dirname(url)[1:] + "/"] = (
            dst_root_dir + os.path.dirname(new_url)[1:] + "/"
        )

    return out_line, translate_dirs


def process_file(w):
    print(f"Processing {w['new_basename']}")
    with open(w["src"]) as f:
        lines = f.readlines()
    tdash_seen = 0
    out_lines = []
    translate_dirs = {}
    for line in lines:
        out_line = line
        extra_line = None
        skip = False
        if line.strip() == "---":
            tdash_seen += 1
        elif tdash_seen == 1:
            # in frontmatter
            if line.startswith("category:"):
                if line.startswith("category: Research"):
                    out_line = "tags: research\n"
                else:
                    skip = True
            elif line.startswith("layout:"):
                if w["is_sketch"] and line.strip() == "layout: sketch-fullscreen":
                    skip = True
                else:
                    print("WARNING: INTERESTING LAYOUT:", line.strip())
            elif line.startswith("tag:"):
                # "tag" -> "tags", and lowercase val
                pieces = line.split(" ")
                out_line = "tags: " + " ".join(pieces[1:]).lower()
            elif line.startswith("date:"):
                out_line = " ".join(line.split(" ")[:2]) + "\n"
                # append any redirect after date
                if w["redirect_url"] is not None:
                    extra_line = f"redirect_from: {w['redirect_url']}\n"
            elif line.startswith("thumb: /data/sketches/"):
                out_line = (
                    "thumb: /assets/sketches/" + line[len("thumb: /data/sketches/") :]
                )
            elif line.startswith("image: /data/"):
                # broken for sketches, manually fixing for now...
                match = re.search(r"(/data/.*)", out_line)
                # YAML broken w/ nunjucks, and quoting means nunjucks doesn't run. we
                # have to do extra processing in head for domain anyway, which means we
                # can just worry about it then, no problem. just spit out new url
                out_line, new_t_dirs = process_match(out_line, match, False, True)
                translate_dirs.update(new_t_dirs)
        elif tdash_seen >= 2:
            # main body manipulations

            # {% link /data/foo/bar.x %}
            # {{ "/assets/posts/foo/bar.x" | url }}
            while True:
                match = re.search(r"\{%\s*link\s*(\S*)\s*%\}", out_line)
                if match is None:
                    break
                out_line, new_t_dirs = process_match(out_line, match, False, False)
                translate_dirs.update(new_t_dirs)

            # src="/data/foo/bar.jpg"
            # src="{{ "/data/foo/bar.jpg" | url }}"
            while True:
                match = re.search(r"src=\"(/\S*)\"", out_line)
                if match is None:
                    break
                out_line, new_t_dirs = process_match(
                    out_line, match, False, False, 'src="', '"'
                )
                translate_dirs.update(new_t_dirs)

            # ({{ site.baseurl }}/data/foo/bar.x)
            # {{ "/assets/posts/foo/bar.x" | url }}
            while True:
                match = re.search(r"\(\{\{\s*site\.baseurl\s*\}\}(.*)\s*\)", out_line)
                if match is None:
                    break
                out_line, new_t_dirs = process_match(out_line, match, True, False)
                translate_dirs.update(new_t_dirs)

            # (/foo/bar)
            # ({{ "/foo/bar" | url }})
            while True:
                match = re.search(r"\((/\S*)\)", out_line)
                if match is None:
                    break
                out_line, new_t_dirs = process_match(out_line, match, True, False)
                translate_dirs.update(new_t_dirs)

        if not skip:
            out_lines.append(out_line)
        if extra_line is not None:
            out_lines.append(extra_line)

    with open(w["dst"], "w") as f:
        f.writelines(out_lines)
    print("Wrote to", w["dst"])
    print()

    return translate_dirs


def process_dirs(translate_dirs):
    for t_dir_src, t_dir_dst in translate_dirs.items():
        # preview
        print("Can copy over the following directories:")
        print(f"{t_dir_src}\n-> {t_dir_dst}")
        for src_path in glob.glob(t_dir_src + "*"):
            print(f"    - {os.path.basename(src_path)}")

        # decision
        if input("Proceed (y/n)? ").lower() != "y":
            continue

        # copying
        print(f"Creating {t_dir_dst}")
        os.makedirs(t_dir_dst, exist_ok=True)
        dst_files = glob.glob(t_dir_src + "*")
        print(f"Copying {len(dst_files)} files")
        for src_path in dst_files:
            basename = os.path.basename(src_path)
            dst_path = os.path.join(t_dir_dst, basename)
            shutil.copy2(src_path, dst_path)


def main():
    worklist = build_worklist(src_garage_dir)
    # grab first unfinished
    w = [w for w in worklist if not w["finished"]][0]
    # grab specific
    # w = [w for w in worklist if w["new_basename"] == "thinking.md"][0]
    # print(w)
    translate_dirs = process_file(w)
    # if len(translate_dirs) > 0:
    #     process_dirs(translate_dirs)


if __name__ == "__main__":
    main()
