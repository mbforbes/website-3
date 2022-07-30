---
title: Image scroll test page
date: 2022-07-28
updated: 2022-07-30
---

Attempting resolution of issue seen in recent photo blog posts: scrolling down, _or even back up_, results in Chrome re-decoding images in CPU raster jobs, which takes time and leaves the viewer with a white screen.

This does not happen for at least one photo-heavy website I have visited. I do not understand why.

## When does it happen?

- Happens if a bunch (~30) images are embedded normally
- Does not happen if the same image is repeated (~50x)
- Happens if images are all given fake widths + heights (e.g., 1000 x 1000).
- Happens _at first_ if images are all given small fake widths + heights (e.g., 100 x 100), then after several rounds of scrolling up and down, everything stays loaded
- Happens if all widths and heights are provided, width capped and height used (imgs distorted)
- Happens if all widths and heights are provided, width capped and height set to auto (imgs now undistorted)
- Happens if images are all shrunk to 2/3 height (~50% size). It is alleviated, but I think the decoding simply finishes faster.
- Happens if all widths and heights are provided, images allowed to be full size (no W or H cap), and they're 50% size.

```bash
# when testing, embed images here w/
python scripts/image_size_test.py | pbcopy
```
