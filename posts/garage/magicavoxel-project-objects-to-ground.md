---
title: "MagicaVoxel: Project Objects to Ground"
date: 2021-12-30
series: 3D Notebook
---

(The actual ground may be a terrain --- i.e., not just z=0.)

Have different color voxels underneath, then run `drop` shader on color w/ 64 iterations. If multiple colors, run lowest to highest.

(Might be better shader or builtin for this that I haven't found.)
