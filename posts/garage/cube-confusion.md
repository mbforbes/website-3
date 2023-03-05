---
# layout: "layouts/sketch-fullscreen.njk"
title: "3js: Cube confusion"
date: 2022-01-18
image: /assets/garage/cube-confusion.jpg
series: 3D Notebook
---

I'm having an issue with slowdown where the same number of cubes renders quickly when arranged in a plane, but slowly when packed into a cube shape. This is especially true zooming into the mess of cubes.

I have no idea why it happened. Debugging w/ WebGL inspectors revealed nothing. It affected both my Intel chip Mac, and a powerhouse GPU on Windows. But once I switched to my M1 Mac, I could no longer replicate the problem.

See demo embedded below.

<div class="full-width fig stats-container editing-gui-container">
    <canvas id="c" class="w-100" style="height: 80vh"></canvas>
</div>

<script defer src="{{ "/assets/lib/three-r131.min.js" | url }}"></script>
<script defer src="{{ "/assets/3js/06-cube-confusion.js" | url }}"></script>

<style>
    .gui-container {
        display: flex;
        justify-content: space-between;
    }

    #stats {
        left: auto !important;
        right: 0 !important;
    }

    #gui {
    }

    #c {
        width: 100%;
        height: 100%;
    }

    #editing-gui {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translate(-50%, 0);
      z-index: 10
    }
</style>
