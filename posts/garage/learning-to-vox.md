---
title: Learning to vox
date: 2021-11-07
updated: 2022-04-27
---

The software is fantastic, but challenging to learn. Even more challenging is learning the craft and improving the eye.

![]({{ "/assets/garage/learning-to-vox/27_BOF3Chicken.jpg" | url }})

![]({{ "/assets/garage/learning-to-vox/28_CeramiChickens.jpg" | url }})

Even earlier work is already posted as sketches. But I need a workshop.

## Importing

You can just drag'n'drop  a `.obj` file into MagicaVoxel to import it.

Need to paint, though. Importing material (`.mtl`) file didn't do anything. Can import `.png` palette, but would need to construct anyway.

![]({{ "/assets/garage/learning-to-vox/29_Importing-edited.jpg" | url }})

<p class="figcaption">
<a href="https://free3d.com/3d-model/indoor-pot-plant-77983.html">
potted plant source
</a>
</p>


## Postprocessing Colors

Realized this a bit ago. Phone is great for this.

<div class="flex mv4">
<img src="{{ "/assets/garage/learning-to-vox/29_Importing.jpg" | url }}" class="bare mh2 w-50 flex-auto">
<img src="{{ "/assets/garage/learning-to-vox/29_Importing-edited.jpg" | url }}" class="bare mh2 w-50 flex-auto">
</div>

## Layer vs Outline

I think Layer doesn't determine draw order, but Outline does.

Manipulating the order with the Outline is awkward. In World mode, you can move the selected model in the outline with "First"/"Last" buttons in the Order control area. But if you click on something in the outline to select it, you switch from World mode to Model mode, which removes the Order control area. And in World mode, you can't see which model you have selected in the outline. This makes it hard to tell what the order is and if reordering is working. **Naming your models (in Outline controls) helps this a lot.**

Use Outline ordering for stuff like underwater: rather than filling in gaps in a model, have a _later_ node in the Outline w/ big block of water. Also have on a Layer, w/ visibility off, so you can freely edit other stuff.

I.e., Outline: models are drawn last to first. First is on top.

## Shaders

For me it's not immediately obvious how to use them, sometimes even after reading about it.

- **Brush**
    - `grass` - shader mode (`c`), pick attach/erase/paint (probably attach), draw box, can still modify params
- `sand` --- Play
- `sand2` --- Play
- `soil` --- Play
- `soil_replace` --- Play

Qs:

- **Can we get shader selection back?** I feel like MagicaVoxel has a more generous undo policy than many other programs. One example of this in my mind is that it counts (de)selection operations as actions that can be undone. However, this is exactly what I'm having trouble with: if I have a shader brush area that I'm editing, and I lose focus on it, I can't undo to get it back. I end up having to remove it and start over to make edits. Maybe there's a better way?


## Project (3D objects) to ground

Have different color voxels underneath, then run `drop` shader on color w/ 64 iterations. If multiple colors, run lowest to highest.

(Might be better shader or builtin for this that I haven't found.)

## Terrain

Turns out Perlin noise is great, much nicer than what I can do by hand. Run shader `tergen` (or `tergen2` for selected area only).

Open Q: How to nicely generate terrain that spans multiple models (a "model" being 256³ voxels max)? Current approach was to try to do some hybrid of copying + re-generating + linking up manually, which was a royal pain and looks just OK. (But maybe at this point I'm hitting over-reliance on tools and should be okay with hand-clicking monotony.)

## Underwater

![]({{ "/assets/garage/learning-to-vox/30_Underwater.jpg" | url }})

I experimented with the grass shader to make some underwater... uh... grass? Kelp? The kelp right on the boundary look weird---should make water extend 1 vox beyond.

Learned about [layers and object order](#layer-vs-outline) in order to have water overlay without having to actually flood whole scene w/ water (and then delete every time changing base model). tl;dr: layer helpful for quickly enabling/disabling, but outline order determines render order.

Realized that completely flat terrain is weird, next draft tried to make varied terrain.

<div class="flex mv4">
<img src="{{ "/assets/garage/learning-to-vox/31_Underwater-2.jpg" | url }}" class="bare mh2 w-50 flex-auto">
<img src="{{ "/assets/garage/learning-to-vox/31_Underwater-2-nowater.jpg" | url }}" class="bare mh2 w-50 flex-auto">
</div>

Drawing ground terrain by hand. Hard to see---no water version.

Challenge now using grass shader: it wants to place on flat surface. [Workaround](#project-3d-objects-to-ground) by placing in air, then repeatedly running "drop" shader from lowest to highest color.

Realized doing terrain by hand is kind of silly since there's a shader that's great at this.

![]({{ "/assets/garage/learning-to-vox/32_Underwater-3.jpg" | url }})

The [terrain shaders](#terrain) are great at doing nice terrain. (Frustratingly, even this one still doesn't show it well; the water really obscures it.) But doing larger varied terrain like this involved terrible manual stitching, and still looks meh. Probably need different colors too.

I'm still frustrated by the look of the water. I tried many different combinations of:
- terrain voxel color
- water voxel color
- water voxel material properties
- scene light properties (heading, pitch, area, color, intensity)

... and it remains murky and flat looking.

I also realized, when considering working on this more, that filling even a moderately sized scene like this (it's 4 models), is a massive amount of work. The colors, foliage, and terrain details alone would be a big undertaking. I want to work on smaller models and case studies first; it would feel like a slog to try filling it right now, and I want to have fun.


## Character: Ryu (BoF III)

Look at this terrifying thing

![]({{ "/assets/garage/learning-to-vox/33_Ryu-Too-Big.jpeg" | url }})

![]({{ "/assets/garage/learning-to-vox/33_Ryu-Too-Big-zoom.jpeg" | url }})

I think I made him too big for the amount of detail I'm actually comfortable doing.

## Projection

Spent a ton of time a while back trying to finally really understand the difference between different projections to render a 3D scene onto a 2D image. Ultra common ones being:

- perspective --- all (light) lines to a point
- orthographic --- all lines parallel to a plane
- isometric --- special case of orthographic, all axes equal

Wikipedia has great diagrams and way more info.

What's funny is that I often still have a hard time telling which is used. E.g., I just finished playing Tunic, and I can't tell whether it's a perspective or orthographic projection.

Here's a recent test scene trying both ways.

<div class="flex mv4">
<img src="{{ "/assets/garage/learning-to-vox/36_Wood-shelf-room-2-iso.jpeg" | url }}" class="bare mh2 w-50 flex-auto">
<img src="{{ "/assets/garage/learning-to-vox/36_Wood-shelf-room-2-perspective.jpeg" | url }}" class="bare mh2 w-50 flex-auto">
</div>

I'm also curious which the voxel community favors.

## Lighting

Lighting is everything.

I changed some other stuff here (some more objects, floor texture, some thicknesses), but largely it's the materials and light and camera settings.

<div class="flex mv4">
<img src="{{ "/assets/garage/learning-to-vox/36_Wood-shelf-room-1.jpeg" | url }}" class="bare mh2 w-50 flex-auto">
<img src="{{ "/assets/garage/learning-to-vox/36_Wood-shelf-room-2-perspective.jpeg" | url }}" class="bare mh2 w-50 flex-auto">
</div>

There's much more here than I'd realized. Bolding most important stuff I hadn't been using.

- Light
    - **Sun _and_ Sky**
    - Enabling sampling params
    - Ground and BG are your friend, maybe even edge or grid for some effects
- Composition
    - Additional light source, e.g., from above
    - Multiple light sources
    - Shadows
    - **Embracing direct emission (e.g., not hiding behind glass), and tweaking emission material params (along w/, e.g., bloom) a lot**
- Material
    - Emission, reflection, transparency, cloud
    - **Been noticing a lot more shininess in materials in games, I think some reflection really goes a long way**
- Camera
    - Film exposure (brighten everything)
    - **Bloom (brighten + blur brights)**
