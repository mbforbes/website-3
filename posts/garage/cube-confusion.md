---
layout: "layouts/sketch-fullscreen.njk"
title: Cube confusion
date: 2022-01-18
image: /assets/garage/cube-confusion.jpg
---

<div class="vh-100 stats-container editing-gui-container">
    <canvas id="c" class="w-100"></canvas>
</div>

<script defer src="{{ "/assets/lib/three-r131.min.js" | url }}"></script>
<script defer src="{{ "/assets/3js/06-instance-experiments.js" | url }}"></script>

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
