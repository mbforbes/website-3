---
title: "MagicaVoxel: Layer vs Outline"
date: 2021-12-30
series: 3D Notebook
---

I think Layer doesn't determine draw order, but Outline does.

Manipulating the order with the Outline is awkward. In World mode, you can move the selected model in the outline with "First"/"Last" buttons in the Order control area. But if you click on something in the outline to select it, you switch from World mode to Model mode, which removes the Order control area. And in World mode, you can't see which model you have selected in the outline. This makes it hard to tell what the order is and if reordering is working. **Naming your models (in Outline controls) helps this a lot.**

Use Outline ordering for stuff like underwater: rather than filling in gaps in a model, have a _later_ node in the Outline w/ big block of water. Also have on a Layer, w/ visibility off, so you can freely edit other stuff.

I.e., Outline: models are drawn last to first. First is on top.
