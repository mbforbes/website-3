---
title: "Topic: Lighting"
date: 2022-04-28
series: 3D Notebook
image: /assets/garage/3d-notebook/36_Wood-shelf-room-2-perspective.jpeg
---

Lighting is everything.

## MagicaVoxel

I changed some other stuff here (some more objects, floor texture, some thicknesses), but largely it's the materials and light and camera settings.

{% img [[
    "/assets/garage/3d-notebook/36_Wood-shelf-room-1.jpeg",
    "/assets/garage/3d-notebook/36_Wood-shelf-room-2-perspective.jpeg"
]], false, false %}

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
