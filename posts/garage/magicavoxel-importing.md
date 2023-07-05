---
title: "MagicaVoxel: Importing"
date: 2021-11-15
series: 3D Notebook
image: /assets/garage/3d-notebook/29_Importing-edited.jpg
---

## How to import

You can just drag’n’drop a `.obj` file into MagicaVoxel to import it.

Need to paint, though. Importing material (`.mtl`) file didn't do anything. Can import `.png` palette, but would need to construct anyway.

![](/assets/garage/3d-notebook/29_Importing-edited.jpg)

<p class="figcaption">
<a href="https://free3d.com/3d-model/indoor-pot-plant-77983.html">
potted plant source
</a>
</p>

### Formats

- ✅ obj

For `.obj`, whole scene gets imported. Might need to extract out somehow.

## Assets

What I've tested:

Place             | Works?   | Notes
---               | ---      | ---
[Unity Asset Store](https://assetstore.unity.com/?category=3d&free=true) | ❌ | Only unity format (not .obj)
[ShareCG](https://sharecg.com/b/5/3D-Models/) | | TBD, needs signup. Old website, needs login, model quality looks bad.
[CGTrader](https://www.cgtrader.com/3d-models?free=1) | | TBD, needs signup
[Free3D](https://free3d.com/3d-models/obj) | | No login required.
3DScans.com | | TBD

Lists to peruse:

- [this reddit one](https://www.reddit.com/r/gamedev/comments/9h86m9/what_are_good_repositories_for_free_3d_models/) (WIP)
- [this one specific to MV](https://thebitcave.gitbook.io/magicavoxel-resources/exporting-models/importing-3d-models)
    - links to [file2vox](https://github.com/Zarbuz/FileToVox)

## Thoughts on Importing

My original take on importing was that it doesn't make sense when you're doing "art." Why use stuff someone else already made?

I realized, looking at massive voxel worlds that people put together (e.g., pieces by [madmaraca](https://www.artstation.com/madmaraca), or even scenes by [Paul Riehle](https://dribbble.com/paulriehle), and people guessing about their workflows, that importing makes sense when you're making things on such a big scale. It's more like world building in video games, where you'd use a plant pack in order to build a park.

Important consideration: style. High res object don't automatically look good voxelized. (See, e.g., plant above.) Even if coarser quantized, they won't match other voxel work. It's like trying to auto-generate pixel art from high-res models.
