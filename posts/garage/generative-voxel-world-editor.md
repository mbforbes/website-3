---
layout: "layouts/sketch-fullscreen.njk"
title: Generative voxel world editor
date: 2022-01-11
updated: 2022-01-18
image: /assets/garage/gen-vox-world-editor.moz80.jpg
customexcerpt: A voxel experiment.
---


<div class="vh-100 stats-container editing-gui-container">
    <canvas id="c" class="w-100"></canvas>
</div>

<script defer src="/assets/garage/voxel-world-builder/main.min.js"></script>

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
