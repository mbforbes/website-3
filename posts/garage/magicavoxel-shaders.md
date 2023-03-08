---
title: "MagicaVoxel: Shaders"
date: 2021-12-30
series: 3D Notebook
---

For me it's not immediately obvious how to use them, sometimes even after reading about it.

- **Brush**
    - `grass` - shader mode (`c`), pick attach/erase/paint (probably attach), draw box, can still modify params
- `sand` --- Play
- `sand2` --- Play
- `soil` --- Play
- `soil_replace` --- Play

TODO: Still many more I forget how to use constantly.

Qs:

- **Can we get shader selection back?** I feel like MagicaVoxel has a more generous undo policy than many other programs. One example of this in my mind is that it counts (de)selection operations as actions that can be undone. However, this is exactly what I'm having trouble with: if I have a shader brush area that I'm editing, and I lose focus on it, I can't undo to get it back. I end up having to remove it and start over to make edits. Maybe there's a better way?
