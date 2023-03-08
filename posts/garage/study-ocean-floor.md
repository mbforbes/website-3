---
title: "Study: Ocean Floor"
date: 2021-12-23
series: 3D Notebook
---

![]({{ "/assets/garage/3d-notebook/30_Underwater.jpg" | url }})

<p class="figcaption">Part 1</p>

I experimented with the grass shader to make some underwater... uh... grass? Kelp? The kelp right on the boundary look weird---should make water extend 1 vox beyond.

Learned about [layers and object order](/garage/magicavoxel-layer-vs-outline/) in order to have water overlay without having to actually flood whole scene w/ water (and then delete every time changing base model). tl;dr: layer helpful for quickly enabling/disabling, but outline order determines render order.

Realized that completely flat terrain is weird, next draft tried to make varied terrain.

{% img [[
     "/assets/garage/3d-notebook/31_Underwater-2.jpg",
     "/assets/garage/3d-notebook/31_Underwater-2-nowater.jpg"

]], false, false %}

<p class="figcaption">Part 1: Closeups w/ and w/o water</p>

Drawing ground terrain by hand. Hard to see---no water version.

Challenge now using grass shader: it wants to place on flat surface. [Workaround](/garage/magicavoxel-project-objects-to-ground) by placing in air, then repeatedly running "drop" shader from lowest to highest color.

Realized doing terrain by hand is kind of silly since there's a shader that's great at this.

![]({{ "/assets/garage/3d-notebook/32_Underwater-3.jpg" | url }})

<p class="figcaption">Part 2</p>

The [terrain shaders](/garage/magicavoxel-terrain/) are great at doing nice terrain. (Frustratingly, even this one still doesn't show it well; the water really obscures it.) **But doing larger varied terrain like this involved terrible manual stitching, and still looks meh.** Probably need different colors too.

I'm still frustrated by the look of the water. I tried many different combinations of:
- terrain voxel color
- water voxel color
- water voxel material properties
- scene light properties (heading, pitch, area, color, intensity)

... and it remains murky and flat looking.

I also realized, when considering working on this more, that filling even a moderately sized scene like this (it's 4 models), is a massive amount of work. The colors, foliage, and terrain details alone would be a big undertaking. **I want to work on smaller models and studies first**; it would feel like a slog to try filling it right now, and I want to have fun.
