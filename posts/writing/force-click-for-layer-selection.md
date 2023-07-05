---
title: Force Click for Layer Selection
date: 2021-08-04
tags: design
image: /assets/posts/force-click/force-click-diagram.jpg
---

## Force Click

Apple's recent trackpads have a feature where you can press harder on them and get a "deeper" click. This is called _Force click_.[^click]

[^click]: From what I can tell, "Force Touch" is the general feature, where the trackpad uses haptic feedback to give you (a) the illusion of clicking, and (b) other feedback signals, like little pulses when you're aligning objects or adjusting slider values. A subset of (a) is a feature where it feels like you have both a lighter click and a deeper click, the latter of which is called "Force click."

<object id="force-click-diagram" type="image/svg+xml" data="/assets/posts/force-click/force-click-diagram.svg"></object>

Apple has given it a bunch of [uses in their own apps](https://support.apple.com/en-us/HT204352), but I would guess you only ever use it accidentally. The only way I've ever used Force click intentionally is to look up a word. I remember to do this about, uhh, twice a year.

<video width="572" autoplay muted loop playsinline class="ba bw1 center db mw-100 fig">
  <source src="/assets/posts/force-click/force-click-word.mp4" type="video/mp4">
</video>
<p class="figcaption">Demo of Force click on text.</p>

But, rejoice, for I have cooked up a use for Force click.[^related]

[^related]: Somebody cooked up a [somewhat](https://community.adobe.com/t5/adobe-xd/feature-request-force-touch-trackpad-support-for-xd-like-apple-pages/m-p/11381922) [similar](https://adobexd.uservoice.com/forums/353007-adobe-xd-feature-requests/suggestions/12930618-gestures-swipe-pinch-zoom-force-touch) suggestion around when I first thought of this.

## Layers

Visual software, like Photoshop or Sketch, use the concept of _layers_. Layers separate your overall design into independent visual slices that are placed on top of each other. I'll use Sketch as an example because it's the visual software I use right now.

![](/assets/posts/force-click/sketch-layer-demo.jpg)

<p class="figcaption">Sketch: layers (left) and corresponding design (right).</p>

You often need to select a layer that is below some other layer.

As far as I can tell, there are a few ways of doing this:

1. **Try to find an area in the design with only your desired layer.**
    - Annoying because: you need to switch cognitive modes from _"I want to select X"_ to _"let me find an area where only X occurs."_

2. **Find your layer in the list.**
    - Annoying because: you need to switch cognitive modes from _"I want to select X"_ to _"let me scan through the non-visual list of (potentially dozens or hundreds of) layers with bad names like 'Polygon Copy 3' and find the one corresponding to X."_

3. **Right click and use the "Select Layer" menu.**
    - Annoying because: (a) the menu shows your layer names without highlighting them as you browse, so it's utterly useless if your layers are named things like 'Polygon Copy 3,' (b) if you're using <span class="small-caps">shift</span> to select multiple layers, right clicking destroys the selection you're accumulating.[^fix]

[^fix]: Honestly, fixing these two problems in the "Select Layer" right-click menu would be a great start. They'd also need to be fixed for my Force click proposal to be useful.

## Proposal: Force Click for Layer Selection

What if, when you used Force click, it let you dig into the layers beneath where you are clicking and pick one?

I think this motion would be intuitive, because you're clicking _deeper,_ which already feels like you're probing _depth_-wise---i.e., _down_ into the stack of layers.

That is all.


<script src="/assets/lib/anime-3.2.1.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('force-click-diagram').addEventListener("load", function() {
            const diagram = document.getElementById('force-click-diagram').contentDocument;
            anime({
                targets: [...diagram.querySelectorAll("#top-move-group *")],
                translateX: 1,
                translateY: 4,
                easing: 'easeInOutSine',
                duration: 150,
                delay: 500,
                loop: true,
                direction: "alternate",
            });
            anime.set([...diagram.querySelectorAll("#top-fx")], {
                "stroke-opacity": 0,
            });
            anime({
                targets: [...diagram.querySelectorAll("#top-fx")],
                "stroke-opacity": [0, 1],
                easing: 'easeInOutSine',
                duration: 150,
                delay: 500,
                loop: true,
                direction: "alternate",
            });
            anime({
                targets: [...diagram.querySelectorAll("#bottom-move-group *")],
                keyframes: [
                    {translateX: 1, translateY: 4, duration: 150, endDelay: 300},
                    {translateX: 2, translateY: 8, duration: 150, endDelay: 1000},
                    {translateX: 0, translateY: 0, duration: 150},
                ],
                easing: 'easeInOutSine',
                delay: 500,
                loop: true,
            });
            anime({
                targets: [...diagram.querySelectorAll("#bottom-fx-light")],
                keyframes: [
                    {"stroke-opacity": 1, duration: 300},
                    {"stroke-opacity": 0, duration: 150},
                    {"stroke-opacity": 0, duration: 150, endDelay: 1000},
                    {"stroke-opacity": 0, duration: 150},
                ],
                easing: 'easeInOutSine',
                delay: 500,
                loop: true,
            });
            anime.set([...diagram.querySelectorAll("#bottom-fx")], {
                "stroke-opacity": 0,
            });
            anime({
                targets: [...diagram.querySelectorAll("#bottom-fx")],
                keyframes: [
                    {"stroke-opacity": 0, duration: 150, endDelay: 300},
                    {"stroke-opacity": 1, duration: 300},
                    {"stroke-opacity": 0, duration: 800, endDelay: 200},
                ],
                easing: 'easeInOutSine',
                delay: 500,
                loop: true,
            });
        });
    });
</script>
