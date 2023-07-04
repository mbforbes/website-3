---
title: Image transition test page
date: 2023-03-15
updated: 2023-03-18
attributions: Code to make the city maps is based off of [marceloprates/prettymaps](https://github.com/marceloprates/prettymaps/). Data for all maps &copy; OpenStreetMap contributors (ODbL).
image: /assets/garage/image-transition-test-page/a-3.moz80.jpg
---


<div class="transitionContainer fig" style="display: grid; background-color: #FCEEE1;">
<img src="/assets/garage/image-transition-test-page/a-0.moz80.jpg" class="fader z-0 o-0" style="grid-area: 1 / 1 / 2 / 2; transition: opacity 1s;"/>
<img src="/assets/garage/image-transition-test-page/a-1.moz80.jpg" class="fader z-1 o-0" style="grid-area: 1 / 1 / 2 / 2; transition: opacity 1s;"/>
<img src="/assets/garage/image-transition-test-page/a-2.moz80.jpg" class="fader z-2 o-0" style="grid-area: 1 / 1 / 2 / 2; transition: opacity 1s;"/>
<img src="/assets/garage/image-transition-test-page/a-3.moz80.jpg" class="fader z-3 o-1" style="grid-area: 1 / 1 / 2 / 2; transition: opacity 1s;"/>
</div>

<div class="transitionContainer fig" style="display: grid; background-color: #FCEEE1;">
<img src="/assets/garage/image-transition-test-page/b-0.moz80.jpg" class="fader z-0 o-0" style="grid-area: 1 / 1 / 2 / 2; transition: opacity 1s;"/>
<img src="/assets/garage/image-transition-test-page/b-1.moz80.jpg" class="fader z-1 o-0" style="grid-area: 1 / 1 / 2 / 2; transition: opacity 1s;"/>
<img src="/assets/garage/image-transition-test-page/b-2.moz80.jpg" class="fader z-2 o-1" style="grid-area: 1 / 1 / 2 / 2; transition: opacity 1s;"/>
</div>

<p class="figcaption">I omitted the last image from this one to make sure I didn't screw up the closure in the script. (This gives it a different total number of images than the above image set.)</p>

Since the city maps I make are generated, I wanted to do something more with the fact that they're built from data rather than drawn as a single image.

Back when I started working with them, I tried rendering them as SVGs, thinking I could make some slick animations. But the SVGs were enormous---huge files, and so heavy my browser could barely render them. I shelved the idea for a while.

Recently, I thought about drawing the maps in layers, then fading between them. Here are some interesting bits:

- I started by giving the images all `position: absolute` to layer them on top of each other. But this leads to problems because the parent container doesn't know their size, so they cover up content below them. I found and used a great [CSS Grid hack](https://stackoverflow.com/a/63711983) to position them instead.

- I first implemented the transitions by having one image go from opacity 0 &rarr; 1, and the other from 1 &rarr; 0. But oddly, this produced a middle period where their opacities summed to &lt; 1, and the image would partially fade. I started hacking around this by offsetting the 1 &rarr; 0 transition, but realized a better solution. Since I was already using a different `z-index` per image, I just let the one on top fade in over the one below it, keeping the one beneath at opacity 1.

- I want my site to be as functional as possible without JavaScript turned on. If the script isn't included, the HTML and CSS are setup to just display the most complete map (it's placed as the top-most z-order image).

The prototype of the code looks like this:

```js
//
// Prototype for script to fade-transition layered images. Used for
// progressively revealing map layers.
//

let containers = document.getElementsByClassName(
    "transitionContainer"
);
for (let container of containers) {
    let images = container.children;
    let n = images.length;
    let endTicks = 3;
    let cur = n - 1;
    let curTicks = endTicks;
    setInterval(() => {
        if (cur == n - 1) {
            curTicks--;
            if (curTicks == 0) {
                for (let image of images) {
                    image.classList.remove("o-1");
                    image.classList.add("o-0");
                }
                images[0].classList.remove("o-0");
                images[0].classList.add("o-1");
                cur = 0;
                curTicks = endTicks;
            }
        } else {
            next = cur + 1;
            images[next].classList.remove("o-0");
            images[next].classList.add("o-1");
            cur = next;
        }
    }, 1000);
}
```

Now, getting this working with the city map macro, which will be shown below.

{% cityMap [
    "/assets/garage/image-transition-test-page/a-0.moz80.jpg",
    "/assets/garage/image-transition-test-page/a-1.moz80.jpg",
    "/assets/garage/image-transition-test-page/a-2.moz80.jpg",
    "/assets/garage/image-transition-test-page/a-3.moz80.jpg"
], false, true, true, "pv3" %}
