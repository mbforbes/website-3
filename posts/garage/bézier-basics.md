---
title: Bézier basics
date: 2021-08-29
---

<script defer src="{{ "/assets/lib/three-r131.min.js" | url }}"></script>
<script defer src="{{ "/assets/lib/p5-1.4.0.min.js" | url }}"></script>
<script defer src="{{ "/assets/p5js/01-bezier-basics.js" | url }}"></script>

<div class="mt5 dt w-100">
    <div id="parent" class="dtc v-mid tc">
    </div>
</div>
<div class="mt5 dt w-100">
    <div id="parent2" class="dtc v-mid tc">
    </div>
</div>
<div class="mt5 dt w-100">
    <div id="parent3" class="dtc v-mid tc">
    </div>
</div>
<div class="mt5 dt w-100">
    <div id="parent4" class="dtc v-mid tc">
    </div>
</div>
<div class="mt5 dt w-100">
    <div id="parent5" class="dtc v-mid tc">
    </div>
</div>
<div class="mt5 dt w-100">
    <div id="parent6" class="dtc v-mid tc">
    </div>
</div>
<div class="mt5 dt w-100">
    <div id="parent7" class="dtc v-mid tc">
    </div>
</div>
<div class="mt5 dt w-100">
    <div id="parent8" class="dtc v-mid tc">
    </div>
</div>

---

Illustration of cubic Bézier curve constructed using De Casteljau's algorithm, inspired by [this wonderful Bézier video by Freya Holmér](https://www.youtube.com/watch?v=aVwxzDHniEw).
