---
title: Mandelbrot
date: 2022-03-21
image: /assets/garage/mandelbrot.png
---


<style>
    /* TODO: See whether we can just remove and let the vanilla one work. */
    .custom-full-width {
        width: calc(100vw - 10px);
        position: relative;
        left: 50%;
        right: 50%;
        margin-left: -50vw;
        margin-right: -50vw;
    }
</style>

I finally read about the Mandelbrot set and tried implementing it.

<script defer src="{{ "/assets/lib/three-r131.min.js" | url }}"></script>
<script defer src="{{ "/assets/lib/p5-1.4.0.min.js" | url }}"></script>
<script defer src="{{ "/assets/p5js/05-mandelbrot.js" | url }}"></script>
<div id="parent" class="mt5 mb5 tc custom-full-width">
</div>
<p class="figcaption">
Not an image. Generated live in your browser.
</p>


The computation is surprisingly simple for how complex the result is.

I read the algorithm for computing the M-set in a book. It caused me some trouble, because it didn't clarify two important details:

1. How many iterations to run the procedure for. I was doing 10. Turns out something like 50 or 100 is more appropriate.

2. That coloring each pixel based on _which_ iteration its length exceeds the threshold---not just a binary indicator of _whether_ it ever exceeds the threshold---produces a much better image. This fading implies the areas where the set continues in further detail. It's kind of like anti-aliasing, I think.

It was fun making an ultra rudimentary complex numbers implementation.

> Random thought on this: math feels very personal, and I think it should be that way. I'm not "good" at math in the sense of people who majored in math or did math-y topics in their PhDs. But for me, enjoying math is really about working at your own pace and comfort level. Of course, you still need to push yourself into discomfort if you want to grow, but it's like, you want to be soaking in it and feeling good with your understanding. It's a damn shame that so many people grow up not connecting with math, and I think most people don't end up really knowing what math is about (since they just do computations in school).

I first drew rectangles for each sampled point (pixel), which was extremely slow (~2.6s). I checked out Daniel Shiffman's implementation video, where he uses `loadPixels()` / `updatePixels()`. I switched to this and it is like 8–9 _times_ faster (~0.3s).

Next, implementation with a shader, fast enough to run in real time. Click to zoom in, right-click to zoom out.

<script>
    const CODE_RESOURCE_PREFIX = "/assets/p5js/"
</script>
<script defer src="{{ "/assets/p5js/06-mandelbrot-shader/06-mandelbrot-shader.js" | url }}"></script>
<div id="parent2" class="mt5 mb5 tc custom-full-width">
</div>
<p class="figcaption">
Red tent achieved by computing colors in HSL, keeping hue and saturation constant to pick the desired color, and setting the lightness to the Mandelbrot breakout iteration.
</p>
