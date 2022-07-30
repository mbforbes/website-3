---
title: Image size test page
date: 2022-07-29
updated: 2022-07-30
---

Due to preliminary pixel density tests in the [Image layout test page]({{ "/garage/image-layout-test-page/" | url }}), I've been exporting my images assuming an @3x device pixel ratio and a moderately large screen (939 CSSpx height). My exported size has been **3756 × 2817** (landscape). However, this may have been overkill.

Image size overkill is important to consider because image size goes up with the square of pixel dimension saved.
- E.g., 1000 x 1000 is 1M pixels, but 666 x 666 is 444K pixels. Shaving off 33% per side cuts overall size by 56%.
- Or, shaving off just 25% per side cuts overall size by 44%.

Some rough device stats.

device | px density | CSS px | physical* px
--- | --- | --- | ---
Yours (live) | <span id="livePixelDensity">(need JavaScript enabled)</span>  | <span id="liveCSSPixels">(need JS enabled)</span> | <span id="livePhysicalPixels">(need JS enabled)</span>
recent iPhones max | 3 | 428 x 926 | 1284 x 2778
recent iPads max | 2 | 1024 x 1366 | 2048 x 2732
monster MBP | 2 | 1728 x 1117 | 3456 x 2234
my laptop | 2 | 1680 x 1050 | 3360 x 2100 (implied), 2560 x 1600 (actual)

<p class="figcaption">
* "physical" isn't even right. If I change my display settings, the "pixel density" stays at 2, but the CSS pixels goes up. But clearly there are more physical pixels per CSS pixel if I choose a scaled screen resolution. Indeed, my physical display specs list 2560px width. So the `window.devicePixelRatio` is lying. I've seen super detailed articles about this but I think it's not worth diving into right now.
</p>

<script>
document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById("livePixelDensity").innerText = window.devicePixelRatio;
    document.getElementById("liveCSSPixels").innerText = screen.width + " x " + screen.height;
    document.getElementById("livePhysicalPixels").innerText = window.devicePixelRatio * screen.width + " x " + window.devicePixelRatio * screen.height;
});
</script>


Thinking about my exports:

- I've been exporting at 2817px height and rendering at 939px height.
- E.g., a landscape photo is 3756 × 2817 and rendering at 1252 × 939
- Laptop
    - The largest I could possibly display (incl. the horizontal margins) is 1648 CSSpx x 2 density = 3296 PHYSpx width, so 2472 height. Shrinking to this would already make images 77% of their current size.
    - However, with the current heights (939 CSS pixels), I can _just_ see the entire image at once, which I like. So I actually don't want it to be taller. That means the largest size I need for desktop given my current size restrictions is **2504 x 1878**. This would make images 44% of their current size.
    - The only question for me is potentially future-proofing for larger screens. E.g., w/ 1080 display pixels (height), images capped at 939 (height) would be smaller than need be for the screen. This might be a good argument to cap at a % of view height, rather than a hard pixel value. Only thing is we'd have some sampling for a screen that's, e.g., 1080 display x 2 ratio = 2160 physical height.
    - I'm tempted to export for my device currently, given that (a) the photos will still be bigger than CSS pixels needed for bigger displays, so they can simply be un-retina, (b) I can always keep the display cap in CSS pixels (as it is currently) to keep the pixels at a sharp 2x even for bigger devices---they'll just be slightly smaller on screen (~150 pixels missed height).
- Phone
    - Largest a recent iPhone can physically display is 1290 PHYSpx width (430 CSSpx x 3), which is much less than 2504 (the smaller desktop size cap).
- iPad
    - Largest portrait mode width is 2048 PHYSpx (1024 CSSpx x 2), still less than 2504 smaller desktop cap. (Landscape mode is bigger than actual laptop dims.)

Testing two variants

<div class="full-width flex justify-center ph1-m ph3-l fig">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/mangart-moss.h2817.moz80.jpg" style="max-height: 939px;">
</div>
<p class="figcaption">
3756 x 2817
</p>

<div class="full-width flex justify-center ph1-m ph3-l fig">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/mangart-moss.h1878.moz80.jpg" style="max-height: 939px;">
</div>
<p class="figcaption">
2504 x 1878
</p>

Perceptually nearly identical. After cleaning my screen and glasses, and tabbing furiously between them about 40 times, I may have a _slight_ preference for the lower resolution one. If I'm actually perceiving something real, it could be because it's actually using the legit 2x pixel density rather than having to downsample from 3. So this is great news.

What about portrait photos? They're displayed at 704 x 939, currently 2113 x 2817. It's great that these already weigh 56% of the landscape ones. Factoring down to 2x desktop pixel ratio would mean 1408 x 1878. But what about portrait devices?
- iPads: currently have some breathing room (CSSpx: 1024 x 1388 > 704 x 939). If we wanted them to be full-screen and full pixel density, we'd export portraits at 2040 x 2721 (shaving off 8px width for margin and rescaling height). This would be almost the same as the current export.
- iPhone: width-limited at 1284 physical px < even the smaller proposed 1408 desktop physical width.

What about side-by-side photos that are naturally going to be displayed smaller?
- for landscape photos, I think it's not worth changing at export time, because I like to be able to shift around what's a full-size and what's not. If I did know in advance though (and maybe I do more than I'm giving myself credit for), these are displayed at 1052 x 789 CSS pixels on desktop, so would need a max size of 2104 x 1578. This would be another 30% reduction, if I wanted to go this optimization route. Note, though, that iPads in landscape already have more pixels than my current setup
- portrait photos are much smaller (laptop: 592 x 789 CSSpx = 1184 x 1578 PHYSpx). They do go full-width for a phone, though, which is 1284 x 2778 PHYSpx max dims. This would fit with either the current portrait export (2113 x 2817 PHYSpx) or proposed reduction (1408 x 1878 PHYSpx)

So, iPads are a bit bigger. How do I do exports going forward?
- landscape
    - old: 3756 × 2817 (4/3 aspect) (100% relative)
    - iPad optim: 2732 x 2048 (4/3 aspect) (53% relative)
    - laptop optim: 2504 x 1878 (4/3 aspect) (44% relative)
- portrait
    - old: 2113 x 2817 (3/4 aspect) (56% landscape relative)
    - ipad optim: 2048 x 2732 (3/4 aspect) (53% landscape relative)
    - laptop optim: 1408 x 1878 (25% landscape relative)

Apple Photos has a "dimension" export, which I assume caps the larger one. So I could cap to
- 2732 dim, for iPads + some "future proofing"
- 1878 height, for current usage + way smaller images

Leaning smaller for now given viewing issues. But gonna leave on the table for a sec and work on the other things.
