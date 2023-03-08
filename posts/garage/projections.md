---
title: "Topic: Projections"
date: 2022-04-28
series: 3D Notebook
---

Spent a ton of time a while back trying to finally really understand the difference between different projections to render a 3D scene onto a 2D image. Ultra common ones being:

projection | description
--- | ---
Perspective | All (light) lines to a point
Orthographic | All lines parallel to a plane
Isometric | Special case of orthographic, all axes equal

Wikipedia has some diagrams and way more info, but the best diagrams I've seen are in computer graphics textbooks.

What's funny is that I often still have a hard time telling which is used. E.g., I just finished playing Tunic, and just trying to recall the visuals, I can't tell whether it's a perspective or orthographic projection.

Here's a recent test scene trying both ways.


{% img [[
    "/assets/garage/3d-notebook/36_Wood-shelf-room-2-perspective.jpeg",
    "/assets/garage/3d-notebook/36_Wood-shelf-room-2-iso.jpeg"
]], false, false %}

I'm also curious which the voxel community favors.
