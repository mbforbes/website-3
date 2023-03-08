---
title: "MagicaVoxel: Terrain"
date: 2021-12-30
series: 3D Notebook
---

Turns out Perlin noise is great, much nicer than what I can do by hand. Run shader `tergen` (or `tergen2` for selected area only).

**Open Q**: How to nicely generate terrain that spans multiple models (a "model" being 256³ voxels max)? Current approach was to try to do some hybrid of copying + re-generating + linking up manually, which was a royal pain and looks just OK. (But maybe at this point I'm hitting over-reliance on tools and should be okay with hand-clicking monotony.)
