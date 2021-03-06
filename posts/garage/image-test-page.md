---
title: Image test page
date: 2022-07-10
updated: 2022-07-14
---

I want to experiment with wider layouts, so want to have HTML/CSS formulas for breaking out of the normal content flow.

## House styles

Copy-paste-able snippets for image arrangements.

### One image

<div class="full-width flex justify-center ph1-m ph3-l fig">
<img class="db bare novmargin" src="/assets/garage/image-test-page/1000x500@3x.png" style="max-height: 500px;">
</div>

### Two images

<div class="full-width flex flex-wrap flex-nowrap-ns justify-center fig">
<div class="ml1-m ml3-l mr1-ns mb1 mb0-ns">
<img class="db bare novmargin" src="/assets/garage/image-test-page/704x939@3x.png" style="max-height: 939px;">
</div>
<div class="mr1-m mr3-l">
<img class="db bare novmargin" src="/assets/garage/image-test-page/939x939@3x.png" style="max-height: 939px;">
</div>
</div>

### Three images

<div class="full-width flex flex-wrap flex-nowrap-ns justify-center fig">
<div class="ml1-m ml3-l">
<img class="db bare novmargin" src="/assets/garage/image-test-page/512x683@3x.png" style="max-height: 683px;">
</div>
<div class="mh1-ns mv1 mv0-ns">
<img class="db bare novmargin" src="/assets/garage/image-test-page/512x683@3x.png" style="max-height: 683px;">
</div>
<div class="mr1-m mr3-l">
<img class="db bare novmargin" src="/assets/garage/image-test-page/512x683@3x.png" style="max-height: 683px;">
</div>
</div>


<!-- NB: The one image style could be

<div class="full-width ph1-m ph3-l">
<img src="/assets/garage/image-test-page/1000x500@3x.png" style="max-height: 500px;">
</div>

... but using the above so that the <img ...> snippet is exactly the same for all layouts.
 -->


## Workbook

My process of working through getting the house styles.

### Small, centered

This image should be smaller than the main page flow, so should be centered.

![256](/assets/garage/image-test-page/256x256.png)

The next one should also be smaller and centered.

![500](/assets/garage/image-test-page/500x500.png)

### Pixel density

This image should display at 256. The source is 768. For displays that use higher pixel densities (e.g., retina displays, most phones), it should be crisp.

<img src="/assets/garage/image-test-page/768x768-d256.png" alt="768-d256" width="256">

To compare two side-by-side, the following images are both displayed at 256 x 256 pixels, but their source images are:

1. 256 x 256 pixels
2. 768 x 768 pixels (i.e., exported @3x)

<div class="cf">
<div class="fl ma1">
<img src="/assets/garage/image-test-page/256x256.png" alt="256" width="256">
</div>
<div class="fl ma1">
<img src="/assets/garage/image-test-page/256x256@3x.png" alt="256@3x" width="256">
</div>
</div>

I use 3x for all higher-pixel-density images on this page simply because that's best for my own devices. But devices should render any source / display ratio. E.g., here's 0.5x, 2x, and 4x.

<div class="cf">
<div class="fl ma1">
<img src="/assets/garage/image-test-page/256x256@0.5x.png" alt="256@0.5x" width="256">
<p class="figcaption">@0.5x</p>
</div>
<div class="fl ma1">
<img src="/assets/garage/image-test-page/256x256@2x.png" alt="256@2x" width="256">
<p class="figcaption">@2x</p>
</div>
</div>
<div class="cf">
<div class="fl ma1">
<img src="/assets/garage/image-test-page/256x256@4x.png" alt="256@4x" width="256">
<p class="figcaption">@4x</p>
</div>
</div>


### Text width image, pixel density

Even without manually specifying a width (as we did in the above pixel density test), we expect the page width clamping to have the same effect, and higher pixel count images to be crisper.

The current full width of the layout is 704px.

The following image is 704 x 704 px, rendered at that size on the page.

![704](/assets/garage/image-test-page/704x704.png)

The following image is 2112 x 2112 px, rendered at 704 x 704 px on the page.

![704](/assets/garage/image-test-page/704x704@3x.png)

Excellent.

We could go to 4x for future-proofing, but I think there is diminishing returns, even with devices.

### Full-width image

This image will take up the full width of the page no matter what size the image or the page is. (My screen only goes up to 1680px width.) It will have no horizontal margins.

<img class="bare full-width" src="/assets/garage/image-test-page/1680x945@3x.png" alt="1680x945">

### Full-width image, with horizontal margins

See next section for technique notes. (These images aren't width-limited, so they may go past 1500px width.)

<div class="full-width ph2">
<img class="" src="/assets/garage/image-test-page/1500x300@3x.png" alt="1500x300">
<p class="figcaption">ph2</p>
</div>

<div class="full-width ph3">
<img class="" src="/assets/garage/image-test-page/1500x300@3x.png" alt="1500x300">
<p class="figcaption">ph3</p>
</div>

<div class="full-width ph4">
<img class="" src="/assets/garage/image-test-page/1500x300@3x.png" alt="1500x300">
<p class="figcaption">ph4</p>
</div>


### Wider-than-text width centered image

While the page width is ??? the image width, this image will take up the full width of the page with no horizontal margin. Once the page is wider than the image, it will be centered in the page with equal horizontal margins.

<div class="full-width">
<img src="/assets/garage/image-test-page/1000x500@3x.png" alt="1000x500" style="width: 1000px;">
</div>

We achieve the breakout by using the `.full-width` CSS class designed for full-width images, but we instead put it on a parent `<div>` to the image. This `<div>` then takes up the full screen width, and the image is free to position inside it.

For a desired 3x pixel density (width px: src 3k, disp 1k), its width needs to be manually limited, or it will, by default, be displayed at its true "size" and a lower pixel density. This can be accomplished with the attribute `width="1000"` or `style="width: 1000px;"`

### Wider-than-text width centered image, horizontal margins

... as needed as the page shrinks.


<div class="full-width ph3">
<img src="/assets/garage/image-test-page/1000x500@3x.png" alt="1000x500" style="width: 1000px;">
</div>
<p class="figcaption">ph3</p>

### Max-width (centered) wider img, horizontal margins only on ~m+ sizes

Desired behavior:
- small (phone): no H margins (want to see as much of photo as possible)
- medium: some H margins
- large: bigger than photo, so margins don't matter

<div class="full-width ph1-m ph3-l">
<img src="/assets/garage/image-test-page/1000x500@3x.png" alt="1000x500" style="width: 1000px;">
</div>
<p class="figcaption">ph1-m ph3-l</p>


### Three images arranged wider than text

These each take up exactly 1/3:

<div class="full-width flex">
<img class="w-third" src="/assets/garage/image-test-page/512x683@3x.png" alt="512x683" style="">
<img class="w-third" src="/assets/garage/image-test-page/512x683@3x.png" alt="512x683" style="">
<img class="w-third" src="/assets/garage/image-test-page/512x683@3x.png" alt="512x683" style="">
</div>
<p class="figcaption">???</p>

We can add a horizontal page margin:

<div class="full-width flex ph3">
<img class="w-third" src="/assets/garage/image-test-page/512x683@3x.png" alt="512x683" style="">
<img class="w-third" src="/assets/garage/image-test-page/512x683@3x.png" alt="512x683" style="">
<img class="w-third" src="/assets/garage/image-test-page/512x683@3x.png" alt="512x683" style="">
</div>
<p class="figcaption">???, ph3</p>

If we make them each take 33%, they distribute the remaining 1% of available width between them.

<div class="full-width flex ph3">
<img class="w-33" src="/assets/garage/image-test-page/512x683@3x.png" alt="512x683" style="">
<img class="w-33" src="/assets/garage/image-test-page/512x683@3x.png" alt="512x683" style="">
<img class="w-33" src="/assets/garage/image-test-page/512x683@3x.png" alt="512x683" style="">
</div>
<p class="figcaption">33%, ph3</p>

We can set their `max-width` CSS so they are spaced more evenly when space is available.

<div class="full-width flex ph3">
<img class="w-third" src="/assets/garage/image-test-page/512x683@3x.png" alt="512x683" style="max-width: 512px;">
<img class="w-third" src="/assets/garage/image-test-page/512x683@3x.png" alt="512x683" style="max-width: 512px;">
<img class="w-third" src="/assets/garage/image-test-page/512x683@3x.png" alt="512x683" style="max-width: 512px;">
</div>
<p class="figcaption">???, ph3, max-width imgs</p>

This effect---using available spacing---is more readily visible with smaller images.

<div class="full-width flex ph3">
<img class="w-third" src="/assets/garage/image-test-page/300x400@3x.png" alt="300x400" style="max-width: 300px;">
<img class="w-third" src="/assets/garage/image-test-page/300x400@3x.png" alt="300x400" style="max-width: 300px;">
<img class="w-third" src="/assets/garage/image-test-page/300x400@3x.png" alt="300x400" style="max-width: 300px;">
</div>
<p class="figcaption">???, ph3, max-width imgs</p>

To get the images to stay closer to the center, you make the images `bare` and add `justify-center` flex. However, they then have no margin. Adding padding or margins works until the page shrinks so their widths are shrinking; then they balloon out past the page width with their extra margins/padding. To fix, I had to wrap them in `<div>`s, then control the padding on the outside. Making the images proper (max) widths then involves a `calc()` on the `<div>`. Quite complex.

<div class="full-width flex justify-center ph2">
<div class="w-third ph1" style="max-width: calc(300px + 0.5rem);">
<img class="bare" src="/assets/garage/image-test-page/300x400@3x.png" alt="300x400" style="">
</div>
<div class="w-third ph1" style="max-width: calc(300px + 0.5rem);">
<img class="bare" src="/assets/garage/image-test-page/300x400@3x.png" alt="300x400" style="">
</div>
<div class="w-third ph1" style="max-width: calc(300px + 0.5rem);">
<img class="bare" src="/assets/garage/image-test-page/300x400@3x.png" alt="300x400" style="">
</div>
</div>
<p class="figcaption">justify-center + ph2; divs w/ ???, ph1, max-width (on divs); imgs bare</p>

Turning up the padding is fine. ~~Be careful going down the rabbit hole of trying to get consistent horizontal page margins, though. Because of symmetric padding on the image `<div>`s (which we need so the images are the same size and they aren't shifted L or R on the page), combined with overall padding, we end up in 0.5 Tachyon units (I think).~~ LOL went down rabbit hole. Turns out switching to margins makes this somehow all work beautifully, and don't even need `calc()` in the `max-width`s, because we're not affecting the image sizes now. (Next example still uses padding; house style uses margins.)

<div class="full-width flex justify-center ph3">
<div class="w-third ph2" style="max-width: calc(300px + 1rem);">
<img class="bare" src="/assets/garage/image-test-page/300x400@3x.png" alt="300x400" style="">
</div>
<div class="w-third ph2" style="max-width: calc(300px + 1rem);">
<img class="bare" src="/assets/garage/image-test-page/300x400@3x.png" alt="300x400" style="">
</div>
<div class="w-third ph2" style="max-width: calc(300px + 1rem);">
<img class="bare" src="/assets/garage/image-test-page/300x400@3x.png" alt="300x400" style="">
</div>
</div>
<p class="figcaption">justify-center + ph3; divs w/ ???, ph2, max-width (on divs); imgs bare</p>

Regardless, we now have something that looks and works fine for 3 max-width'd imgs w/ some margins.

Seeking a "house style" below:

<div class="full-width flex justify-center">
<div class="w-third ml1-m ml3-l" style="max-width: 300px;">
<img class="bare" src="/assets/garage/image-test-page/300x400@3x.png" alt="300x400" style="">
</div>
<div class="w-third mh1" style="max-width: 300px;">
<img class="bare" src="/assets/garage/image-test-page/300x400@3x.png" alt="300x400" style="">
</div>
<div class="w-third mr1-m mr3-l" style="max-width: 300px;">
<img class="bare" src="/assets/garage/image-test-page/300x400@3x.png" alt="300x400" style="">
</div>
</div>
<p class="figcaption">
Margin 1 between images always. Page border is: nothing (small), 1 (m), 3 (l).
</p>

Testing this third house-style w/ larger images

<div class="full-width flex justify-center">
<div class="w-third ml1-m ml3-l" style="max-width: 512px;">
<img class="bare" src="/assets/garage/image-test-page/512x683@3x.png" alt="512x683" style="">
</div>
<div class="w-third mh1" style="max-width: 512px;">
<img class="bare" src="/assets/garage/image-test-page/512x683@3x.png" alt="512x683" style="">
</div>
<div class="w-third mr1-m mr3-l" style="max-width: 512px;">
<img class="bare" src="/assets/garage/image-test-page/512x683@3x.png" alt="512x683" style="">
</div>
</div>
<p class="figcaption">
Margin 1 between images always. Page border is: nothing (small), 1 (m), 3 (l).
</p>

Simplifying from later findings; I think we don't need `w-third` at all.

<div class="full-width flex justify-center">
<div class="ml1-m ml3-l" style="max-width: 512px;">
<img class="bare" src="/assets/garage/image-test-page/512x683@3x.png">
</div>
<div class="mh1" style="max-width: 512px;">
<img class="bare" src="/assets/garage/image-test-page/512x683@3x.png">
</div>
<div class="mr1-m mr3-l" style="max-width: 512px;">
<img class="bare" src="/assets/garage/image-test-page/512x683@3x.png">
</div>
</div>


### Portrait and landscape w/ "house style"

The following isn't working:

<div class="full-width flex justify-center">
<div class="w-third ml1-m ml3-l mr1" style="max-width: 704px;">
<img class="bare" src="/assets/garage/image-test-page/704x939@3x.png" alt="704x939" style="">
</div>
<div class="w-two-thirds mr1-m mr3-l" style="max-width: 1252px;">
<img class="bare" src="/assets/garage/image-test-page/1252x939@3x.png" alt="1252x939" style="">
</div>
</div>
<p class="figcaption">
Broken portrait & landscape (first image shrinks before & too much). Margin 1 between images always. Page border is: nothing (small), 1 (m), 3 (l).
</p>

While margins are fine, and the heights all match up at full size, but the height of the first image is shrinking before the second.

Wild enough, removing the `<div>` third/two-third widths fixed.

<div class="full-width flex justify-center">
<div class="ml1-m ml3-l mr1" style="max-width: 704px;">
<img class="bare" src="/assets/garage/image-test-page/704x939@3x.png" alt="704x939" style="">
</div>
<div class="mr1-m mr3-l" style="max-width: 1252px;">
<img class="bare" src="/assets/garage/image-test-page/1252x939@3x.png" alt="1252x939" style="">
</div>
</div>
<p class="figcaption">
Fixed portrait & landscape. Margin 1 between images always. Page border is: nothing (small), 1 (m), 3 (l).
</p>

### Mixed sizes with house style

<div class="full-width flex justify-center">
<div class="ml1-m ml3-l mr1" style="max-width: 704px;">
<img class="bare" src="/assets/garage/image-test-page/704x939@3x.png" alt="704x939" style="">
</div>
<div class="mr1-m mr3-l" style="max-width: 939px;">
<img class="bare" src="/assets/garage/image-test-page/939x939@3x.png" alt="939x939" style="">
</div>
</div>

Incredibly, this just works as well. My takeaway is to export things to be the same height and then let flexbox's basic layout take it away.

### Other little tricks

- make images `db` (i.e., `display: block`) so that divs don't leave little bits of extra space apparently [for descender elements](https://stackoverflow.com/questions/19212352/div-height-based-on-child-image-height-adds-few-extra-pixels-at-the-bottom)

- accordingly, then add `mv1` when doing grids for vertical spacing

- ... and relatedly, don't forget to add `novmargin` to the images so that the margins can be controlled with the containing `<div>`s

### Rewrapping

Simply adding `flex-wrap` to the container gives us a simple wrap, where elements are wrapped as soon as the row can't fit both at full size. We can add `novmargin` to the images and `fig` to the container if we want them to wrap closely (moving the vertical margin to the overall block).

<div class="full-width flex justify-center flex-wrap fig">
<div class="ml1-m ml3-l mr1" style="max-width: 704px;">
<img class="bare novmargin" src="/assets/garage/image-test-page/704x939@3x.png" alt="704x939" style="">
</div>
<div class="mr1-m mr3-l" style="max-width: 939px;">
<img class="bare novmargin" src="/assets/garage/image-test-page/939x939@3x.png" alt="939x939" style="">
</div>
</div>
<p class="figcaption">
Rewrapping w/ house style, but doing immediate when smaller than full size.
</p>

Ideally, I'd want to be able to choose to wrap only when they've shrunk to a certain size. In other words, we don't need the photos to be full size, but there might be a significantly smaller display size (like if it would only be 200px wide or something) for which we'd rather wrap.

This might be possible using `display: grid` and `grid-template-columns: ...`, but TBD still. A couple resources:

- [item wrapping](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Mastering_Wrapping_of_Flex_Items#single-dimensional_layout_explained)
- [grid template cols](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns)

... or, wait, maybe we can just use a media query to only add `flex-wrap`! Going from the house style below. Also needed to do margin adjustments: inter-pic margin is right only when not wrapped, and bottom when wrapped.

<div class="full-width flex flex-wrap flex-nowrap-ns justify-center fig">
<div class="ml1-m ml3-l mr1-ns mb1 mb0-ns">
<img class="db bare novmargin" src="/assets/garage/image-test-page/704x939@3x.png" style="max-height: 939px;">
</div>
<div class="mr1-m mr3-l">
<img class="db bare novmargin" src="/assets/garage/image-test-page/939x939@3x.png" style="max-height: 939px;">
</div>
</div>

This isn't perfect, because I think once the page width is less than even 600px or so, the photo get a bit too small, and this only wraps < 480px. But realistically, this will fix the other major viewing use case (phones), and all the media queries work exactly together, so I think it's worth it.

Doing for 3 imgs too:

<div class="full-width flex flex-wrap flex-nowrap-ns justify-center fig">
<div class="ml1-m ml3-l">
<img class="db bare novmargin" src="/assets/garage/image-test-page/512x683@3x.png" style="max-height: 683px;">
</div>
<div class="mh1-ns mv1 mv0-ns">
<img class="db bare novmargin" src="/assets/garage/image-test-page/512x683@3x.png" style="max-height: 683px;">
</div>
<div class="mr1-m mr3-l">
<img class="db bare novmargin" src="/assets/garage/image-test-page/512x683@3x.png" style="max-height: 683px;">
</div>
</div>
