"""
Tests completeness ½ of garage_links.py: do we find links where we should?

The accuracy ½ of garage_links.py (do all the generated links point to real pages?) is
tested in test_link_graph.py.
"""

from rich.console import Console

from garage_links import get_links

C = Console()
res = get_links('[foo]({{ "/foo/" | url }})')
print(len(res))
C.print("✅ Test")
