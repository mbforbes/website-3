---
title: 'Sketch: Stars'
layout: layouts/stars.njk
custtomexcerpt: Found in your own home sky
image: /assets/sketches/stars/stars-preview.png
thumb: /assets/sketches/stars/stars-thumb.png
date: 2021-02-17
redirect_from: /posts/sketch-stars/
---

<style>
    body {
        background-color: #313440;
        margin: 0;
        overflow: hidden;
    }

    * {
        transition: all 0.2s ease;
    }

    .go-up {
        transform: translateY(-10px);
    }

    .go-down {
        transform: translateY(10px);
    }
</style>

<div id="container" class="vh-100 w-100 items-center justify-center z-1 absolute flex">
    <div id="readybox" class="w5 mw-100 h4 mh-100 bg-white ba b--black-70 black-90 pa3 tc o-0">
        <p class="f6 ttu tracked b ma0">stars</p>
        <div id="readybutton" class="ba pa2 mt4 w3 mw-100 center pointer dim">
            <p class="f6 ttu tracked ma0">start</p>
        </div>
    </div>
</div>

<script src="/assets/lib/p5-0.10.2.js"></script>
<script src="/assets/lib/howler-2.2.1.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="/assets/sketches/stars/stars.js"></script>
