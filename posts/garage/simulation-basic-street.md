---
title: "Simulation: Basic street"
date: 2021-08-15
---

<canvas id="c" class="w-100"></canvas>
<div class="stats-container gui-container"></div>

<script defer src="{{ "/assets/lib/three-r131.min.js" | url }}"></script>
<script defer src="{{ "/assets/3js/03-street.prod.js" | url }}"></script>

<script>
    // No easy CSS I can find to set height based on width, so using JS.
    function setHeightToWidth() {
        const c = document.querySelector("#c");
        // Setting square: height = width.
        c.height = c.width;
    }
    window.addEventListener('resize', setHeightToWidth);
    setHeightToWidth();
</script>

<style>
    .gui-container {
        display: flex;
        justify-content: space-between;
    }

    #stats {
        position: relative !important;
    }

    #gui {
    }
</style>

<!-- - Rotate
    - Desktop: click
    - Mobile: press and hold
- Pan
    - Desktop: <span class="small-caps ph1 bg-near-white ba b--black-20 br2">shift</span> + click
    - Mobile: two-finger press and hold
- Zoom
    - Desktop: scroll
    - Mobile: pinch -->

|             | rotate | pan                                                                                | zoom   |
| ----------- | ------ | ---------------------------------------------------------------------------------- | ------ |
| **Desktop** | Click  | <span class="small-caps ph1 bg-near-white ba b--black-20 br2">shift</span> + click | Scroll |
| **Mobile**  | Press  | Two-finger press                                                                   | Pinch  |

<p class="figcaption">View controls (directly on simulation)</p>

Adjust GUI controls (below simulation) to update in real time. Start with <code class="ph1 bg-near-white ba b--black-20 br2">n</code> for fun.

If you prefer cars driving on the right side of the road, rotate 180° horizontally.

---

Built with three.js, accompanied by stats.js and dat.gui, using webpack, in Typescript. Yes, that was hell to set up.
