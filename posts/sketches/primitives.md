---
title: "Sketch: Primitives"
date: 2020-01-14
redirect_from: /posts/sketch-primitives/
customexcerpt: A digital sketch on some visual transformation primitives.
image: /assets/sketches/primitives-screenshot.png
thumb: /assets/sketches/primitives-thumb.gif
---

<script src="{{ "/assets/lib/p5-0.10.2.js" | url }}"></script>
<script src="{{ "/assets/sketches/primitives.js" | url }}"></script>

<style>
    .top-holder {
        width: 100%;
        /* margin: 10px; */
    }

    .top-holder canvas {
        margin-left: auto;
        margin-right: auto;
        display: block;
    }

    .holder {
        display: inline-block;
    }

    .clear {
        clear: both;
    }

    .holder canvas {
        margin-left: auto;
        margin-right: auto;
        display: block;
        margin: 10px;
    }

@keyframes slide {
  from { left: 100%;}
  to { left: -100%;}
}
@-webkit-keyframes slide {
  from { left: 100%;}
  to { left: -100%;}
}

.marquee {
    overflow: hidden;
}

.notice {
    position: relative;
    margin-top: 28px;
    margin-bottom: -2px;
    animation-name: slide;
    animation-duration: 20s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    -webkit-animation-name: slide;
    -webkit-animation-duration: 20s;
    -webkit-animation-timing-function:linear;
    -webkit-animation-iteration-count: infinite;
}

</style>


<div id="big-container" class="container"></div>
<div class="clear"></div>
<!-- <div class="marquee"> -->
<p class="mt5">select below to enable above</p>
<!-- </div> -->
<div id="many-container"></div>
