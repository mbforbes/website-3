"""
Tests accuracy ½ of garage_links.py: do all the generated links point to real pages? In
other words, an empty link graph passes this test.

The completeness ½ of garage_links.py is tested in test_link_finder.py.
"""

import code
import json

from mbforbes_python_utils import read
import requests
from rich.console import Console
from rich.progress import track

HOST = "http://localhost:8080"
HOME_TITLE = "<title>Home - Maxwell Forbes</title>"
LINK_GRAPH_PATH = "_data/link_graph.json"

C = Console()
link_graph = json.loads(read(LINK_GRAPH_PATH))
# link_graph = {}  # uncomment to show that empty link graph passes test

try:
    res = requests.get(HOST + "/")
except requests.exceptions.ConnectionError:
    C.print(f"❌ No web server found at {HOST}")
    exit(1)

if res.status_code != 200 or HOME_TITLE not in res.text:
    C.print(f"❌ Personal website not found at {HOST}")
    exit(1)
C.print(f"✅ Personal website found on {HOST}")

res = requests.get(HOST + "/thisdoesnotexist")
if res.status_code == 200:
    C.print(f"❌ Assumption error; got 200 for nonexistent URL")
    exit(1)
C.print(f"✅ Nonexistent URLs giving non-200s (got {res.status_code})")

failed = []
for key, value in track(
    link_graph.items(), description="Checking link graph", transient=True
):
    url = value["url"]
    # These are the same right now. Remove this (and add check?) if not.
    assert key == url, f"Got key/url mismatch:\n - key: {key}\n - value: {value}"
    res = requests.get(HOST + key)
    if res.status_code != 200:
        failed.append(key)
C.print(f"✅ All keys match URLs")

if len(failed) > 0:
    C.print(f"❌ Some URLs in link graph not found ({len(failed)}/{len(link_graph)})")
    for url in failed:
        C.print("❌", url)
else:
    C.print(f"✅ All {len(link_graph)} URLs found")


# code.interact(local=dict(globals(), **locals()))
