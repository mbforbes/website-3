---
title: Image layout test page
date: 2022-07-10
updated: 2023-06-12
---

I want to experiment with wider layouts, so want to have HTML/CSS formulas for breaking out of the normal content flow.

## House styles [`v2`]

Copy-paste-able snippets for image arrangements.

`v2` styles are width-limited using `.media-max-width`. This width limit factors in a device's height to allow two-row portrait orientation (2:3) photos to be displayed fully. **Width limits apply to a new container, not the images.** As a result, all row configurations will display with identical margins, assuming images are of a sufficient width. Background blur and extra options have all been removed.

With the new height limit, tall single images will stretch beyond the height of the page. This is an intentional omission given (a) the upcoming focus on 3:2 photos, (b) the desire to have consistent margins. This can be revisited to add options for container or image limits if need be.

Non-full-width is still supported, now with an options argument `{fullWidth: false}`.

### One image

{% img2 "/assets/garage/image-test-pages/939x939@3x.png" %}

### Two images

{% img2 [[
  "/assets/garage/image-test-pages/704x939@3x.png",
  "/assets/garage/image-test-pages/704x939@3x.png"
]] %}

### Three images

{% img2 [[
  "/assets/garage/image-test-pages/704x939@3x.png",
  "/assets/garage/image-test-pages/704x939@3x.png",
  "/assets/garage/image-test-pages/704x939@3x.png"
]] %}

### Multiple rows

{% img2 [
  "/assets/garage/image-test-pages/939x939@3x.png",
  [
    "/assets/garage/image-test-pages/704x939@3x.png",
    "/assets/garage/image-test-pages/704x939@3x.png"
  ]
] %}



## House styles [`v1`]

Copy-paste-able snippets for image arrangements.

`v1` styles are height-limited but stretch to the full screen width where possible. They can incorporate background blurs for single-row images or videos to help create consistent margins.

### One image

{% img "/assets/garage/image-test-pages/939x939@3x.png" %}

### Two images

{% img [[
  "/assets/garage/image-test-pages/704x939@3x.png",
  "/assets/garage/image-test-pages/704x939@3x.png"
]] %}

### Three images

{% img [[
  "/assets/garage/image-test-pages/704x939@3x.png",
  "/assets/garage/image-test-pages/704x939@3x.png",
  "/assets/garage/image-test-pages/704x939@3x.png"
]] %}

### Multiple rows

{% img [
  "/assets/garage/image-test-pages/939x939@3x.png",
  [
    "/assets/garage/image-test-pages/704x939@3x.png",
    "/assets/garage/image-test-pages/704x939@3x.png"
  ]
] %}


### Specify Height

{% img {path: "/assets/garage/image-test-pages/1000x500@3x.png", maxHeight: "500px"} %}

### Blur stretch singles

{% img [
  "/assets/garage/image-test-pages/704x939@3x.png",
  "/assets/garage/image-test-pages/939x939@3x.png"
], true %}

### Blur stretch doubles

This is possible, but didn't always look that good, and would require more tweaking for images to resize aspect ratio-ally appropriately. See notes in `.eleventy.js` @ the `twoBigImages` function.

## Workbook

My process of working through getting the house styles.

### Small, centered

This image should be smaller than the main page flow, so should be centered.

![256](/assets/garage/image-test-pages/256x256.png)

The next one should also be smaller and centered.

![500](/assets/garage/image-test-pages/500x500.png)

### Pixel density

This image should display at 256. The source is 768. For displays that use higher pixel densities (e.g., retina displays, most phones), it should be crisp.

<img src="/assets/garage/image-test-pages/768x768-d256.png" alt="768-d256" width="256">

To compare two side-by-side, the following images are both displayed at 256 x 256 pixels, but their source images are:

1. 256 x 256 pixels
2. 768 x 768 pixels (i.e., exported @3x)

<div class="cf">
<div class="fl ma1">
<img src="/assets/garage/image-test-pages/256x256.png" alt="256" width="256">
</div>
<div class="fl ma1">
<img src="/assets/garage/image-test-pages/256x256@3x.png" alt="256@3x" width="256">
</div>
</div>

I use 3x for all higher-pixel-density images on this page simply because that's best for my own devices. But devices should render any source / display ratio. E.g., here's 0.5x, 2x, and 4x.

<div class="cf">
<div class="fl ma1">
<img src="/assets/garage/image-test-pages/256x256@0.5x.png" alt="256@0.5x" width="256">
<p class="figcaption">@0.5x</p>
</div>
<div class="fl ma1">
<img src="/assets/garage/image-test-pages/256x256@2x.png" alt="256@2x" width="256">
<p class="figcaption">@2x</p>
</div>
</div>
<div class="cf">
<div class="fl ma1">
<img src="/assets/garage/image-test-pages/256x256@4x.png" alt="256@4x" width="256">
<p class="figcaption">@4x</p>
</div>
</div>


### Text width image, pixel density

Even without manually specifying a width (as we did in the above pixel density test), we expect the page width clamping to have the same effect, and higher pixel count images to be crisper.

The current full width of the layout is 704px.

The following image is 704 x 704 px, rendered at that size on the page.

![704](/assets/garage/image-test-pages/704x704.png)

The following image is 2112 x 2112 px, rendered at 704 x 704 px on the page.

![704](/assets/garage/image-test-pages/704x704@3x.png)

Excellent.

We could go to 4x for future-proofing, but I think there is diminishing returns, even with devices.

### Real image, pixel density

Deep dive into this in [Image size test page]({{ "/garage/image-size-test-page/" | url }})

### Full-width image

This image will take up the full width of the page no matter what size the image or the page is. (My screen only goes up to 1680px width.) It will have no horizontal margins.

<img class="bare full-width" src="/assets/garage/image-test-pages/1680x945@3x.png" alt="1680x945">

### Full-width image, with horizontal margins

See next section for technique notes. (These images aren't width-limited, so they may go past 1500px width.)

<div class="full-width ph2">
<img class="" src="/assets/garage/image-test-pages/1500x300@3x.png" alt="1500x300">
<p class="figcaption">ph2</p>
</div>

<div class="full-width ph3">
<img class="" src="/assets/garage/image-test-pages/1500x300@3x.png" alt="1500x300">
<p class="figcaption">ph3</p>
</div>

<div class="full-width ph4">
<img class="" src="/assets/garage/image-test-pages/1500x300@3x.png" alt="1500x300">
<p class="figcaption">ph4</p>
</div>


### Wider-than-text width centered image

While the page width is ≤ the image width, this image will take up the full width of the page with no horizontal margin. Once the page is wider than the image, it will be centered in the page with equal horizontal margins.

<div class="full-width">
<img src="/assets/garage/image-test-pages/1000x500@3x.png" alt="1000x500" style="width: 1000px;">
</div>

We achieve the breakout by using the `.full-width` CSS class designed for full-width images, but we instead put it on a parent `<div>` to the image. This `<div>` then takes up the full screen width, and the image is free to position inside it.

For a desired 3x pixel density (width px: src 3k, disp 1k), its width needs to be manually limited, or it will, by default, be displayed at its true "size" and a lower pixel density. This can be accomplished with the attribute `width="1000"` or `style="width: 1000px;"`

### Wider-than-text width centered image, horizontal margins

... as needed as the page shrinks.


<div class="full-width ph3">
<img src="/assets/garage/image-test-pages/1000x500@3x.png" alt="1000x500" style="width: 1000px;">
</div>
<p class="figcaption">ph3</p>

### Max-width (centered) wider img, horizontal margins only on ~m+ sizes

Desired behavior:
- small (phone): no H margins (want to see as much of photo as possible)
- medium: some H margins
- large: bigger than photo, so margins don't matter

<div class="full-width ph1-m ph3-l">
<img src="/assets/garage/image-test-pages/1000x500@3x.png" alt="1000x500" style="width: 1000px;">
</div>
<p class="figcaption">ph1-m ph3-l</p>


### Three images arranged wider than text

These each take up exactly 1/3:

<div class="full-width flex">
<img class="w-third" src="/assets/garage/image-test-pages/512x683@3x.png" alt="512x683" style="">
<img class="w-third" src="/assets/garage/image-test-pages/512x683@3x.png" alt="512x683" style="">
<img class="w-third" src="/assets/garage/image-test-pages/512x683@3x.png" alt="512x683" style="">
</div>
<p class="figcaption">⅓</p>

We can add a horizontal page margin:

<div class="full-width flex ph3">
<img class="w-third" src="/assets/garage/image-test-pages/512x683@3x.png" alt="512x683" style="">
<img class="w-third" src="/assets/garage/image-test-pages/512x683@3x.png" alt="512x683" style="">
<img class="w-third" src="/assets/garage/image-test-pages/512x683@3x.png" alt="512x683" style="">
</div>
<p class="figcaption">⅓, ph3</p>

If we make them each take 33%, they distribute the remaining 1% of available width between them.

<div class="full-width flex ph3">
<img class="w-33" src="/assets/garage/image-test-pages/512x683@3x.png" alt="512x683" style="">
<img class="w-33" src="/assets/garage/image-test-pages/512x683@3x.png" alt="512x683" style="">
<img class="w-33" src="/assets/garage/image-test-pages/512x683@3x.png" alt="512x683" style="">
</div>
<p class="figcaption">33%, ph3</p>

We can set their `max-width` CSS so they are spaced more evenly when space is available.

<div class="full-width flex ph3">
<img class="w-third" src="/assets/garage/image-test-pages/512x683@3x.png" alt="512x683" style="max-width: 512px;">
<img class="w-third" src="/assets/garage/image-test-pages/512x683@3x.png" alt="512x683" style="max-width: 512px;">
<img class="w-third" src="/assets/garage/image-test-pages/512x683@3x.png" alt="512x683" style="max-width: 512px;">
</div>
<p class="figcaption">⅓, ph3, max-width imgs</p>

This effect---using available spacing---is more readily visible with smaller images.

<div class="full-width flex ph3">
<img class="w-third" src="/assets/garage/image-test-pages/300x400@3x.png" alt="300x400" style="max-width: 300px;">
<img class="w-third" src="/assets/garage/image-test-pages/300x400@3x.png" alt="300x400" style="max-width: 300px;">
<img class="w-third" src="/assets/garage/image-test-pages/300x400@3x.png" alt="300x400" style="max-width: 300px;">
</div>
<p class="figcaption">⅓, ph3, max-width imgs</p>

To get the images to stay closer to the center, you make the images `bare` and add `justify-center` flex. However, they then have no margin. Adding padding or margins works until the page shrinks so their widths are shrinking; then they balloon out past the page width with their extra margins/padding. To fix, I had to wrap them in `<div>`s, then control the padding on the outside. Making the images proper (max) widths then involves a `calc()` on the `<div>`. Quite complex.

<div class="full-width flex justify-center ph2">
<div class="w-third ph1" style="max-width: calc(300px + 0.5rem);">
<img class="bare" src="/assets/garage/image-test-pages/300x400@3x.png" alt="300x400" style="">
</div>
<div class="w-third ph1" style="max-width: calc(300px + 0.5rem);">
<img class="bare" src="/assets/garage/image-test-pages/300x400@3x.png" alt="300x400" style="">
</div>
<div class="w-third ph1" style="max-width: calc(300px + 0.5rem);">
<img class="bare" src="/assets/garage/image-test-pages/300x400@3x.png" alt="300x400" style="">
</div>
</div>
<p class="figcaption">justify-center + ph2; divs w/ ⅓, ph1, max-width (on divs); imgs bare</p>

Turning up the padding is fine. ~~Be careful going down the rabbit hole of trying to get consistent horizontal page margins, though. Because of symmetric padding on the image `<div>`s (which we need so the images are the same size and they aren't shifted L or R on the page), combined with overall padding, we end up in 0.5 Tachyon units (I think).~~ LOL went down rabbit hole. Turns out switching to margins makes this somehow all work beautifully, and don't even need `calc()` in the `max-width`s, because we're not affecting the image sizes now. (Next example still uses padding; house style uses margins.)

<div class="full-width flex justify-center ph3">
<div class="w-third ph2" style="max-width: calc(300px + 1rem);">
<img class="bare" src="/assets/garage/image-test-pages/300x400@3x.png" alt="300x400" style="">
</div>
<div class="w-third ph2" style="max-width: calc(300px + 1rem);">
<img class="bare" src="/assets/garage/image-test-pages/300x400@3x.png" alt="300x400" style="">
</div>
<div class="w-third ph2" style="max-width: calc(300px + 1rem);">
<img class="bare" src="/assets/garage/image-test-pages/300x400@3x.png" alt="300x400" style="">
</div>
</div>
<p class="figcaption">justify-center + ph3; divs w/ ⅓, ph2, max-width (on divs); imgs bare</p>

Regardless, we now have something that looks and works fine for 3 max-width'd imgs w/ some margins.

Seeking a "house style" below:

<div class="full-width flex justify-center">
<div class="w-third ml1-m ml3-l" style="max-width: 300px;">
<img class="bare" src="/assets/garage/image-test-pages/300x400@3x.png" alt="300x400" style="">
</div>
<div class="w-third mh1" style="max-width: 300px;">
<img class="bare" src="/assets/garage/image-test-pages/300x400@3x.png" alt="300x400" style="">
</div>
<div class="w-third mr1-m mr3-l" style="max-width: 300px;">
<img class="bare" src="/assets/garage/image-test-pages/300x400@3x.png" alt="300x400" style="">
</div>
</div>
<p class="figcaption">
Margin 1 between images always. Page border is: nothing (small), 1 (m), 3 (l).
</p>

Testing this third house-style w/ larger images

<div class="full-width flex justify-center">
<div class="w-third ml1-m ml3-l" style="max-width: 512px;">
<img class="bare" src="/assets/garage/image-test-pages/512x683@3x.png" alt="512x683" style="">
</div>
<div class="w-third mh1" style="max-width: 512px;">
<img class="bare" src="/assets/garage/image-test-pages/512x683@3x.png" alt="512x683" style="">
</div>
<div class="w-third mr1-m mr3-l" style="max-width: 512px;">
<img class="bare" src="/assets/garage/image-test-pages/512x683@3x.png" alt="512x683" style="">
</div>
</div>
<p class="figcaption">
Margin 1 between images always. Page border is: nothing (small), 1 (m), 3 (l).
</p>

Simplifying from later findings; I think we don't need `w-third` at all.

<div class="full-width flex justify-center">
<div class="ml1-m ml3-l" style="max-width: 512px;">
<img class="bare" src="/assets/garage/image-test-pages/512x683@3x.png">
</div>
<div class="mh1" style="max-width: 512px;">
<img class="bare" src="/assets/garage/image-test-pages/512x683@3x.png">
</div>
<div class="mr1-m mr3-l" style="max-width: 512px;">
<img class="bare" src="/assets/garage/image-test-pages/512x683@3x.png">
</div>
</div>


### Portrait and landscape w/ "house style"

The following isn't working:

<div class="full-width flex justify-center">
<div class="w-third ml1-m ml3-l mr1" style="max-width: 704px;">
<img class="bare" src="/assets/garage/image-test-pages/704x939@3x.png" alt="704x939" style="">
</div>
<div class="w-two-thirds mr1-m mr3-l" style="max-width: 1252px;">
<img class="bare" src="/assets/garage/image-test-pages/1252x939@3x.png" alt="1252x939" style="">
</div>
</div>
<p class="figcaption">
Broken portrait & landscape (first image shrinks before & too much). Margin 1 between images always. Page border is: nothing (small), 1 (m), 3 (l).
</p>

While margins are fine, and the heights all match up at full size, but the height of the first image is shrinking before the second.

Wild enough, removing the `<div>` third/two-third widths fixed.

<div class="full-width flex justify-center">
<div class="ml1-m ml3-l mr1" style="max-width: 704px;">
<img class="bare" src="/assets/garage/image-test-pages/704x939@3x.png" alt="704x939" style="">
</div>
<div class="mr1-m mr3-l" style="max-width: 1252px;">
<img class="bare" src="/assets/garage/image-test-pages/1252x939@3x.png" alt="1252x939" style="">
</div>
</div>
<p class="figcaption">
Fixed portrait & landscape. Margin 1 between images always. Page border is: nothing (small), 1 (m), 3 (l).
</p>

### Mixed sizes with house style

<div class="full-width flex justify-center">
<div class="ml1-m ml3-l mr1" style="max-width: 704px;">
<img class="bare" src="/assets/garage/image-test-pages/704x939@3x.png" alt="704x939" style="">
</div>
<div class="mr1-m mr3-l" style="max-width: 939px;">
<img class="bare" src="/assets/garage/image-test-pages/939x939@3x.png" alt="939x939" style="">
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
<img class="bare novmargin" src="/assets/garage/image-test-pages/704x939@3x.png" alt="704x939" style="">
</div>
<div class="mr1-m mr3-l" style="max-width: 939px;">
<img class="bare novmargin" src="/assets/garage/image-test-pages/939x939@3x.png" alt="939x939" style="">
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
<img class="db bare novmargin" src="/assets/garage/image-test-pages/704x939@3x.png" style="max-height: 939px;">
</div>
<div class="mr1-m mr3-l">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/939x939@3x.png" style="max-height: 939px;">
</div>
</div>

This isn't perfect, because I think once the page width is less than even 600px or so, the photo get a bit too small, and this only wraps < 480px. But realistically, this will fix the other major viewing use case (phones), and all the media queries work exactly together, so I think it's worth it.

Doing for 3 imgs too:

<div class="full-width flex flex-wrap flex-nowrap-ns justify-center fig">
<div class="ml1-m ml3-l">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/512x683@3x.png" style="max-height: 683px;">
</div>
<div class="mh1-ns mv1 mv0-ns">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/512x683@3x.png" style="max-height: 683px;">
</div>
<div class="mr1-m mr3-l">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/512x683@3x.png" style="max-height: 683px;">
</div>
</div>

### Height limits

I can't ignore it: I probably implicitly designed for image heights that fit my viewport. Let's think about limiting them.

<div class="full-width flex justify-center ph1-m ph3-l fig">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/mangart-moss.h1878.moz80.jpg" style="max-height: 100vh;">
</div>
<p class="figcaption">
Capping @ view height. Should we also set another max height? It actually seems to look pretty good everywhere.
</p>


Does this work for 2 imgs?

<div class="full-width flex flex-wrap flex-nowrap-ns justify-center fig">
<div class="ml1-m ml3-l mr1-ns mb1 mb0-ns">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/mountains.moz80.jpg" style="max-height: 100vh;">
</div>
<div class="mr1-m mr3-l">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/mangart-moss.h1878.moz80.jpg" style="max-height: 100vh;">
</div>
</div>

Wow, yes, it does beautifully... I guess I should just go for this? Only potential downside would be over-stretching for bigger screen devices. But honestly, being > CSSpx but < PHYSpx isn't the end of the world, it's already better than most photo displays people are going to encounter.

One more test: 1 img portrait.

<div class="full-width flex justify-center ph1-m ph3-l fig">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/mountains.moz80.jpg" style="max-height: 100vh;">
</div>
<p class="figcaption">
Capping @ view height, portrait.
</p>

I think the answer here is that "it depends on the design." For almost all layouts, a portrait photo isn't going to get that big. For laptop/desktop/ipad-in-landscape, the height caps the img, leaving lots of space in the width, and it goes with the flow. For a phone, the width caps it, since they're so tall, and the photo only takes up ~1/2 of the screen. BUT, the one exception is the iPad in portrait mode. It's exactly portrait-photo-size, so a big portrait photo will fill the whole thing.

That's where the design part comes in. If it's a nice photo, it could be really cool. If it's kinda crummy, yeah, it'll be a huge crummy photo. If you want to design around that for iPad users in portrait mode, then throw in a `min(100vh, 939px)` or something. Otherwise, just keep `100vh` and roll with it.

Determination for `max-height`:

- `min(100vh, 939px)` --- general purposes. let images be seen in full, and also keep things at least @2x. wider displays will have photo sets nicely centered in the middle
- `939px` --- portrait images we want as bigger/establishing. this way smaller desktops will have it display larger (than the viewport height), and we're keeping things crisp for ipads rather than having them blow up huge.

### Varying Widths: Region Filling

Ugh, the thing I didn't want to address.

In some situations, this will happen inevitably as long as we're limiting photo heights to viewport heights, and are unwilling to make surrounding photos more narrow (width-limited). Examples:

1. a portrait photo, then a landscape one

2. a landscape photo (height-limited), then two side-by-side photos (width-limited)

I'm still torn philosophically on limiting photos to viewport heights. I think I like it, at least for landscapes. For portraits where the aim is more establishing footage, I'm not so sure; they'd be so tiny on a poorly-dimensioned landscape-oriented screen.

I am pretty confident limiting side-by-side images to narrower widths is bad, though. They are already nearly too small at full-screen with full width access; much smaller and it's basically pointless to have them.

Assuming I do end up with consecutive varying photo row widths, the main thing I can try is some background. Below contains a graveyard (in comments) of approaches, with one that finally worked:
- ❌ SVG-generated fractal noise (colors too random)
- ❌ BG gradient (manual + didn't look good)
- ❌ BG gradient + alpha (manual, still didn't look good)
- ❌ BG image, as addl. element, CSS blurred (could not get horizontal edges crisp)
- ❌ BG image, as parent. element, opacity w/ `background-blend-mode` (could not get blurring, didn't look good without)
- ✅ **BG image, as addl., element, blurred w/ SVG filter ([hat-tip](https://stackoverflow.com/a/48095387)) (looks good, can re-use image, crisp edges). Implemented below:**

<div class="full-width flex flex-wrap flex-nowrap-ns justify-center figtop">
<div class="ml1-m ml3-l mr1-ns mb1 mb0-ns">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/mountains.moz80.jpg" style="max-height: min(100vh, 939px);">
</div>
<div class="mr1-m mr3-l">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/mangart-moss.h1878.moz80.jpg" style="max-height: min(100vh, 939px);">
</div>
</div>

<!-- BG SVG generated noise -->
<!-- Note the added <div> in order to maintain page-BG-color margins. -->
<!-- SVG here: used z-index and position: absolute to get it behind, but it won't respect parent padding, even if I add inherit padding stuff from stackoverflow :-() -->
<!-- <div class="full-width ph1-m ph3-l mv1">
<div class="w-100 h-100 flex justify-center" style="">
<svg style="z-index: -1; position: absolute; padding-left: inherit; padding-right: inherit; left: 0; right: 0;" class="w-100 h-100">
<filter id='noise' x='0%' y='0%' width='100%' height='100%'>
<feTurbulence baseFrequency="0.01" type="fractalNoise" />
</filter>
<rect x="0" y="0" width="100%" height="100%" filter="url(#noise)" fill="none"></rect>
</svg>
<img class="db bare novmargin" src="/assets/garage/image-test-pages/mangart-moss.h1878.moz80.jpg" style="max-height: 100vh;">
</div>
</div> -->

<!-- BG gradient -->
<!-- NOTE: to get more fx like blur and limited opacity, need another <div> or it applies to the image as well. But then we end up with the same breaking-out-of-padding problem as above :-( -->
<!-- <div class="full-width ph1-m ph3-l mv1">
<div class="w-100 h-100 flex justify-center">
<div class="absolute w-100 h-100" style="background-image: linear-gradient(
  45deg,
  hsl(216deg 83% 69%) 0%,
  hsl(202deg 90% 58%) 21%,
  hsl(194deg 100% 46%) 30%,
  hsl(189deg 100% 44%) 39%,
  hsl(182deg 100% 39%) 46%,
  hsl(174deg 100% 38%) 54%,
  hsl(158deg 52% 52%) 61%,
  hsl(129deg 41% 61%) 69%,
  hsl(90deg 41% 59%) 79%,
  hsl(63deg 42% 56%) 100%
); z-index: -1; opacity: 50%; filter: blur(5px); padding: inherit;">
</div>
<img class="db bare novmargin" src="/assets/garage/image-test-pages/mangart-moss.h1878.moz80.jpg" style="max-height: 100vh;">
</div>
</div> -->

<!-- BG color w/ alpha -->
<!-- Boring fx but not breaking out. Added alpha which tones down BG colors. -->
<!-- <div class="full-width ph1-m ph3-l mv1">
<div class="w-100 h-100 flex justify-center" style="background-image: linear-gradient(
  45deg,
  hsla(216deg, 83%, 69%, 0.3) 0%,
  hsla(202deg, 90%, 58%, 0.3) 21%,
  hsla(194deg, 100%, 46%, 0.3) 30%,
  hsla(189deg, 100%, 44%, 0.3) 39%,
  hsla(182deg, 100%, 39%, 0.3) 46%,
  hsla(174deg, 100%, 38%, 0.3) 54%,
  hsla(158deg, 52%, 52%, 0.3) 61%,
  hsla(129deg, 41%, 61%, 0.3) 69%,
  hsla(90deg, 41%, 59%, 0.3) 79%,
  hsla(63deg, 42%, 56%, 0.3) 100%
);">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/mangart-moss.h1878.moz80.jpg" style="max-height: 100vh;">
</div>
</div> -->

<!-- BG image -->
<!-- NOTE: to get more fx like blur and limited opacity, need another <div> or it applies to the image as well. But then we end up with the same breaking-out-of-padding problem as above :-( -->
<!-- <div class="full-width ph1-m ph3-l mv1">
<div class="w-100 h-100 flex justify-center">
<div class="absolute w-100 h-100" style="background-image: url(/assets/garage/image-test-pages/mangart-moss.h1878.moz80.jpg); z-index: -1; filter: blur(15px); opacity: 70%; padding: inherit; background-size: contain;">
</div>
<img class="db bare novmargin" src="/assets/garage/image-test-pages/mangart-moss.h1878.moz80.jpg" style="max-height: 100vh;">
</div>
</div> -->

<!-- BG image, single DIV (parent) -->
<!-- <div class="full-width ph1-m ph3-l mv1" style="background-image: url(/assets/garage/image-test-pages/mangart-moss.h1878.moz80.jpg); background-color: #FFFFFF77; background-blend-mode: screen; background-clip: content-box; background-size: contain;">
<img class="novmargin" src="/assets/garage/image-test-pages/mangart-moss.h1878.moz80.jpg" style="max-height: 100vh;">
</div> -->

<!-- BG image, single DIV (parent), plus pseudo element (totally broken) -->
<!-- <style>
.parent {
    background-image: url(/assets/garage/image-test-pages/mangart-moss.h1878.moz80.jpg);
    background-clip: content-box;
    background-size: contain;
    overflow: hidden;
}
.parent:before {
    content: "";
    position: absolute;
    width : 100%;
    height: 100%;
    background: inherit;
    z-index: 1;
    filter: blur(15px);

    /* background-color: #FFFFFF77; */
    /* background-blend-mode: screen; */
    /* position: absolute; */
    /* width: 100%; */
    /* height: 100%; */
    /* background: inherit; */
    /* z-index: -1; */
    /* filter: blur(15px); */
}
</style>
<div class="full-width ph1-m ph3-l mv1 parent" style="">
<img class="novmargin" src="/assets/garage/image-test-pages/mangart-moss.h1878.moz80.jpg" style="max-height: 100vh; z-index: 2;">
</div> -->

<!-- BG image (this now inserted into every page) -->
<!-- <svg class='hideSvgSoThatItSupportsFirefox dn'>
  <filter id='sharpBlur'>
    <feGaussianBlur stdDeviation='15'></feGaussianBlur>
    <feColorMatrix type='matrix' values='1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 9 0'></feColorMatrix>
    <feComposite in2='SourceGraphic' operator='in'></feComposite>
  </filter>
</svg> -->

<!-- Check svgBlur and bgImageReady CSS classes in style.css -->

<div class="full-width flex justify-center ph1-m ph3-l mv1">
<div class="bgImageReady svgBlur" style="background-image: url(/assets/garage/image-test-pages/mangart-moss.h1878.moz80.jpg)"></div>
<img class="db bare novmargin" src="/assets/garage/image-test-pages/mangart-moss.h1878.moz80.jpg" style="max-height: min(100vh, 939px);">
</div>

<div class="full-width flex justify-center ph1-m ph3-l mv1">
<div class="bgImageReady svgBlur" style="background-image: url(/assets/garage/image-test-pages/704x939@3x.png)"></div>
<img class="db bare novmargin" src="/assets/garage/image-test-pages/704x939@3x.png" style="max-height: min(100vh, 939px);">
</div>


<div class="full-width flex flex-wrap flex-nowrap-ns justify-center figbot">
<div class="ml1-m ml3-l mr1-ns mb1 mb0-ns">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/mountains.moz80.jpg" style="max-height: min(100vh, 939px);">
</div>
<div class="mr1-m mr3-l">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/mangart-moss.h1878.moz80.jpg" style="max-height: min(100vh, 939px);">
</div>
</div>

However, now a new challenge arises: it's too wide.

### Varying Widths: Width Matching [draft]

Because the photos are now all viewport height-limited, it's possible for even side-by-side images to not take up the full width. This means that our new burred image background gets 100% page width when it shouldn't.

Reading a bit about CSS Flexbox, it seems like it really only thinks row-by-row. When there's a new flex row, it doesn't know about the content above it. This seems to be a problem because I explicitly want my rows to be of equal width. CSS Grid is recommended for 2D layouts.

However, thinking a bit more, my constraints are kind of odd:
- the target width should be determined dynamically by the contents of the rows
- the target width will be the largest combined content width
- all rows will achieve this target width
- for rows whose content fills less than the target width
    - the columns inside should spread to fill the remaining space proportionally
    - the content should be centered
    - the backgrounds will have blurred/semi-transparent versions of the images
- all items become 1 per row for smaller displays
- ideally, none of this uses JavaScript
- ideally, this is achieved with minimal manual markup

... phew.

I can see why you'd want to simply design on a fixed-width grid.

<div style="display: grid; grid-template-columns: 1fr max-content 1fr; grid-template-rows: auto auto; grid-gap: 0.25rem;">
<!-- row 1 -->
<div></div>
<div class="bg-pink flex" style="justify-content: center;">
<div class="w3 h3 bg-red"></div>
</div>
<div></div>
<!-- row 2 -->
<div></div>
<div class="bg-pink flex" style="justify-content: center;">
<div class="w3 h3 bg-red mr1"></div>
<div class="w3 h3 bg-red"></div>
</div>
<div></div>
<!-- row 3 -->
<div></div>
<div class="flex" style="justify-content: center;">
<div class="w3 h3 bg-red mr1"></div>
<div class="w3 h3 bg-red mr1"></div>
<div class="w3 h3 bg-red"></div>
</div>
<div></div>
<!-- row 3 -->
<div></div>
<div class="flex" style="justify-content: center;">
<div class="w4 h4 bg-blue mr1"></div>
<div class="w3 h3 bg-blue"></div>
</div>
<div></div>
</div>

### Explicit image sizes: basics

An age-old confusion of mine. Learning in the hopes I can use this to get lazy loading to work.

**Takeaway:** CSS instructions take priority over attribute dimensions with both are given.

> NB: Here I'm using "pixels" to mean (a) CSS pixels when referring to the display, (b) true image pixels when referring to the image size.

No dimensions given; displays at original size:
<img src="/assets/garage/image-test-pages/256x256.png">
<p class="figcaption">{{ '`<img src="/assets/garage/image-test-pages/256x256.png">`' | md | safe }}</p>

Attribute dimensions match image dimensions; same:
<img width="256" height="256" src="/assets/garage/image-test-pages/256x256.png">
<p class="figcaption">{{ '`<img width="256" height="256" src="/assets/garage/image-test-pages/256x256.png">`' | md | safe }}</p>

Attribute dimensions do not match image dimensions; displays attribute dimensions:
<img width="100" height="100" src="/assets/garage/image-test-pages/256x256.png">
<p class="figcaption">{{ '`<img width="100" height="100" src="/assets/garage/image-test-pages/256x256.png">`' | md | safe }}</p>

Attribute dimensions do not match image dimensions, and do not match aspect ratio; displays attribute dimensions:
<img width="150" height="100" src="/assets/garage/image-test-pages/256x256.png">
<p class="figcaption">{{ '`<img width="150" height="100" src="/assets/garage/image-test-pages/256x256.png">`' | md | safe }}</p>

Attribute dimensions do not match image dimensions, but CSS style does; displays CSS style dimensions:

<img style="width: 256px; height: 256px;" width="100" height="100" src="/assets/garage/image-test-pages/256x256.png">
<p class="figcaption">{{ '`<img style="width: 256px; height: 256px;" width="100" height="100" src="/assets/garage/image-test-pages/256x256.png">`' | md | safe }}</p>

Attribute dimensions match neither image dimensions nor aspect ratio, but CSS style matches original (both dimensions and aspect ratio); displays CSS style dimensions:

<img style="width: 256px; height: 256px;" width="150" height="100" src="/assets/garage/image-test-pages/256x256.png">
<p class="figcaption">{{ '`<img style="width: 256px; height: 256px;" width="150" height="100" src="/assets/garage/image-test-pages/256x256.png">`' | md | safe }}</p>

Both attribute dimensions and CSS styles are different than original; displays CSS style dimensions:

<img style="width: 400px; height: 400px;" width="100" height="100" src="/assets/garage/image-test-pages/256x256.png">
<p class="figcaption">{{ '`<img style="width: 400px; height: 400px;" width="100" height="100" src="/assets/garage/image-test-pages/256x256.png">`' | md | safe }}</p>

CSS styles are different than original, but attribute dimensions match original; displays CSS style dimensions:

<img style="width: 400px; height: 400px;" width="256" height="256" src="/assets/garage/image-test-pages/256x256.png">
<p class="figcaption">{{ '`<img style="width: 400px; height: 400px;" width="256" height="256" src="/assets/garage/image-test-pages/256x256.png">`' | md | safe }}</p>

CSS style specifies non-pixel width (`100%`) and no height, while attribute dimensions match original; displays CSS width, but attribute height:

<img style="width: 100%;" width="256" height="256" src="/assets/garage/image-test-pages/256x256.png">
<p class="figcaption">{{ '`<img style="width: 100%;" width="256" height="256" src="/assets/garage/image-test-pages/256x256.png">`' | md | safe }}</p>

CSS style specifies non-pixel width (`100%`) `auto` height, while attribute dimensions match original; displays CSS width, and height to match correct aspect ratio:

<img style="width: 100%; height: auto" width="256" height="256" src="/assets/garage/image-test-pages/256x256.png">
<p class="figcaption">{{ '`<img style="width: 100%; height: auto" width="256" height="256" src="/assets/garage/image-test-pages/256x256.png">`' | md | safe }}</p>

### Explicit image sizes: into house styles

Now, to go more flexible. This uses the house style, which breaks out of the normal margins using the following container.

```html
<div class="full-width flex justify-center ph1-m ph3-l fig">
  <!-- image goes here -->
</div>
```

Here's a normal house-style image, whose dimensions are 2,718 x 2,718.

<div class="full-width flex justify-center ph1-m ph3-l fig">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/939x939@3x.png" style="max-height: min(100vh, 939px);">
</div>

<p class="figcaption">{{ '`<img class="db bare novmargin" src="/assets/garage/image-test-pages/939x939@3x.png" style="max-height: min(100vh, 939px);">`' | md | safe  }}</p>

But if we add the size attributes with the true image size, it goes too wide or too narrow, always taking up `100%` width!

<div class="full-width flex justify-center ph1-m ph3-l fig">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/939x939@3x.png" style="max-height: min(100vh, 939px);" width="2718" height="2718">
</div>

<p class="figcaption">{{ '`<img class="db bare novmargin" src="/assets/garage/image-test-pages/939x939@3x.png" style="max-height: min(100vh, 939px);" width="2718" height="2718">`' | md | safe  }}</p>

Can we fix it? If we add `width: auto` to the CSS, it fixes the case of it going too wide, but it will still go too narrow. In other words, when the image is width-limited, it won't then shrink the height.

<div class="full-width flex justify-center ph1-m ph3-l fig">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/939x939@3x.png" style="max-height: min(100vh, 939px); width: auto;" width="2718" height="2718">
</div>

<p class="figcaption">{{ '`<img class="db bare novmargin" src="/assets/garage/image-test-pages/939x939@3x.png" style="max-height: min(100vh, 939px); width: auto;" width="2718" height="2718">
`' | md | safe  }}</p>

Experiments:
- `aspect-ratio` alone (w/o width spec) doesn't fix anything vs original
- `width: auto` and `aspect-ratio` doesn't improve over `width: auto`
- `object-fit: contain` almost works, ugh so close. it adds vertical whitespace above and below the image when it's small (e.g., try 1/3 screen size). i guess it's maintaining some kind of "box" that's full size while resizing the image in it.
  - also can't get rid of `100vh` in the `max-height` though, even though `object-fit: contain` should height limit as well (?)
- `width: auto; height: auto` works! but... is this really going to allow lazy loading now?
    - update: lazy loading works! the issue was elsewhere (the background blurred SVGs)
  - but the real question is: will this prevent layout shifts?
    - it seems to (see below via Studio page experiment)
  - but the REAL question is: can we fix this for multi-img multi-dim layouts? (see below)

<div class="full-width flex justify-center ph1-m ph3-l fig">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/939x939@3x.png" style="max-height: min(100vh, 939px); width: auto; height: auto;" width="2718" height="2718">
</div>

<p class="figcaption">{{ '`<img class="db bare novmargin" src="/assets/garage/image-test-pages/939x939@3x.png" style="max-height: min(100vh, 939px); width: auto; height: auto;" width="2718" height="2718">`' | md | safe }}</p>

Preventing layout shifts: is this possible since CSS sets max-width and max-height, and width and height to both auto? Theoretically, it seems like it should work; the only information you get when you load the image is its dimensions, which you have if they're in attributions. But event after reading a [lengthy article](https://www.smashingmagazine.com/2020/03/setting-height-width-images-important-again/) about this, I'm still not sure what the answer is. Need to try it.

Easiest spot to see this right now is Studio page w/ slow 3G throttling turned on. Can see each row pop in. Intrinsic usually 216 x 216.

This works on Studio page! With the attributes, the space is reserved before any load. Note: needed to set `height: auto` to get layout correct, and CSS width isn't set. So, I'm optimistic to try.

However, now trying multi-img w/ diff dims, the layout is again broken:

> NOTE: I was testing this by directly embedding images w/ paths generated by eleventy imgs plugin, which I decided to stop using, so the HTML is all broken because the images aren't there. I took screenshots for most of them, which appear **after** the code blocks. This is to help leave a breadcrumb trail if I'm foolish enough to pursue this direction again.

```html
<div class="full-width cb flex flex-wrap flex-nowrap-ns justify-center fig">
<div class="ml1-m ml3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto; width: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/OXm8tvrg-F-1252.jpeg" width="1409" height="1878" srcset="/assets/eleventyImgs/OXm8tvrg-F-1252.jpeg 1252w, /assets/eleventyImgs/OXm8tvrg-F-1409.jpeg 1409w" sizes="100vw"></div>
<div class="mh1-ns mv1 mv0-ns"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto; width: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/yU7E_JSouU-1252.jpeg" width="2504" height="1878" srcset="/assets/eleventyImgs/yU7E_JSouU-1252.jpeg 1252w, /assets/eleventyImgs/yU7E_JSouU-2504.jpeg 2504w" sizes="100vw"></div>
<div class="mr1-m mr3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto; width: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/aPBhDDAiiJ-1252.jpeg" width="2504" height="1878" srcset="/assets/eleventyImgs/aPBhDDAiiJ-1252.jpeg 1252w, /assets/eleventyImgs/aPBhDDAiiJ-2504.jpeg 2504w" sizes="100vw"></div>
</div>
```

![](/assets/garage/image-test-pages/devimg1.moz80.jpg)

This appears to be caused by `srcset` (and `sizes`) attributes. If I remove it (them), the layout is fine again.

```html
<div class="full-width cb flex flex-wrap flex-nowrap-ns justify-center fig">
<div class="ml1-m ml3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto; width: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/OXm8tvrg-F-1252.jpeg" width="1409" height="1878"></div>
<div class="mh1-ns mv1 mv0-ns"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto; width: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/yU7E_JSouU-1252.jpeg" width="2504" height="1878"></div>
<div class="mr1-m mr3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto; width: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/aPBhDDAiiJ-1252.jpeg" width="2504" height="1878" ></div>
</div>
```

![](/assets/garage/image-test-pages/devimg2.moz80.jpg)

It might be we just need `height: auto` and not also `width: auto`?

```html
<div class="full-width cb flex flex-wrap flex-nowrap-ns justify-center fig">
<div class="ml1-m ml3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/OXm8tvrg-F-1252.jpeg" width="1409" height="1878" srcset="/assets/eleventyImgs/OXm8tvrg-F-1252.jpeg 1252w, /assets/eleventyImgs/OXm8tvrg-F-1409.jpeg 1409w" sizes="100vw"></div>
<div class="mh1-ns mv1 mv0-ns"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/yU7E_JSouU-1252.jpeg" width="2504" height="1878" srcset="/assets/eleventyImgs/yU7E_JSouU-1252.jpeg 1252w, /assets/eleventyImgs/yU7E_JSouU-2504.jpeg 2504w" sizes="100vw"></div>
<div class="mr1-m mr3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/aPBhDDAiiJ-1252.jpeg" width="2504" height="1878" srcset="/assets/eleventyImgs/aPBhDDAiiJ-1252.jpeg 1252w, /assets/eleventyImgs/aPBhDDAiiJ-2504.jpeg 2504w" sizes="100vw"></div>
</div>
```

![](/assets/garage/image-test-pages/devimg3.moz80.jpg)

Let's try confirm it w/ the big image:

<div class="full-width flex justify-center ph1-m ph3-l fig">
<img class="db bare novmargin" src="/assets/garage/image-test-pages/939x939@3x.png" style="max-height: min(100vh, 939px); height: auto;" width="2718" height="2718">
</div>

<p class="figcaption">{{ '`<img class="db bare novmargin" src="/assets/garage/image-test-pages/939x939@3x.png" style="max-height: min(100vh, 939px); height: auto;" width="2718" height="2718">`' | md | safe }}</p>

Nope, the width is indeed broken (it stretches beyond its aspect ratio). Why is it OK for the three (update: or two) small images but not one big one?

Let's try some experiments:
- ❌ `height` and `aspect-ratio`: `width` attr then used, `aspect-ratio` ignored

I think the easiest for now is just to remove `width: auto` for 2- or 3- images layouts, but keep it for one big image. Sigh...

Nope, that doesn't even fix it. Enter shorter image:

```html
<div class="full-width cb flex flex-wrap flex-nowrap-ns justify-center mv1">
<div class="ml1-m ml3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/_EDdord68w-313.jpeg" width="2504" height="1878" srcset="/assets/eleventyImgs/_EDdord68w-313.jpeg 313w, /assets/eleventyImgs/_EDdord68w-626.jpeg 626w, /assets/eleventyImgs/_EDdord68w-1252.jpeg 1252w, /assets/eleventyImgs/_EDdord68w-2504.jpeg 2504w" sizes="100vw"></div>
<div class="mh1-ns mv1 mv0-ns"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/tMFXf8ajHv-313.jpeg" width="2504" height="1878" srcset="/assets/eleventyImgs/tMFXf8ajHv-313.jpeg 313w, /assets/eleventyImgs/tMFXf8ajHv-626.jpeg 626w, /assets/eleventyImgs/tMFXf8ajHv-1252.jpeg 1252w, /assets/eleventyImgs/tMFXf8ajHv-2504.jpeg 2504w" sizes="100vw"></div>
<div class="mr1-m mr3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/JU22y1OINo-313.jpeg" width="1440" height="1080" srcset="/assets/eleventyImgs/JU22y1OINo-313.jpeg 313w, /assets/eleventyImgs/JU22y1OINo-626.jpeg 626w, /assets/eleventyImgs/JU22y1OINo-1252.jpeg 1252w, /assets/eleventyImgs/JU22y1OINo-1440.jpeg 1440w" sizes="100vw"></div>
</div>
```

![](/assets/garage/image-test-pages/devimg4.moz80.jpg)

Also (important!), this setting (`height: auto` only) breaks the two big image layout for tall images. Check out "Two Images" at top of this page. They'll be height-limited but will stretch to the full width of the screen.

Seeing if we can fix:

- ❌ `height: 100%;` --- just stretches smaller img vertically
- ❌ `height: 100%; width: auto;` --- takes liberties w/ aspect ratio
  - wide renders at 1.49
  - narrow renders 1.33 (4/3)
  - orig is 1.50
- ❌ `height: 100%; width: auto; aspect-ratio: [what it is]`
  - seems to work for this case
  - reveals its failure in the 1 tall two wide image case: it just stretches the wide images out
- ❌ + adding `aspect-ratio` to the img-containing `<div>` --- does nothing

```html
<div class="full-width cb flex flex-wrap flex-nowrap-ns justify-center fig">
<div class="ml1-m ml3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: 100%; width: auto; aspect-ratio: 2504/1878;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/_EDdord68w-313.jpeg" width="2504" height="1878" srcset="/assets/eleventyImgs/_EDdord68w-313.jpeg 313w, /assets/eleventyImgs/_EDdord68w-626.jpeg 626w, /assets/eleventyImgs/_EDdord68w-1252.jpeg 1252w, /assets/eleventyImgs/_EDdord68w-2504.jpeg 2504w" sizes="100vw"></div>
<div class="mh1-ns mv1 mv0-ns"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: 100%; width: auto; aspect-ratio: 1440/1080;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/JU22y1OINo-313.jpeg" width="1440" height="1080" srcset="/assets/eleventyImgs/JU22y1OINo-313.jpeg 313w, /assets/eleventyImgs/JU22y1OINo-626.jpeg 626w, /assets/eleventyImgs/JU22y1OINo-1252.jpeg 1252w, /assets/eleventyImgs/JU22y1OINo-1440.jpeg 1440w" sizes="100vw"></div>
<div class="mr1-m mr3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: 100%; width: auto; aspect-ratio: 2504/1878;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/tMFXf8ajHv-313.jpeg" width="2504" height="1878" srcset="/assets/eleventyImgs/tMFXf8ajHv-313.jpeg 313w, /assets/eleventyImgs/tMFXf8ajHv-626.jpeg 626w, /assets/eleventyImgs/tMFXf8ajHv-1252.jpeg 1252w, /assets/eleventyImgs/tMFXf8ajHv-2504.jpeg 2504w" sizes="100vw"></div>
</div>
```

![](/assets/garage/image-test-pages/devimg5.moz80.jpg)

Let's try on our cases above:

```html
<div class="full-width cb flex flex-wrap flex-nowrap-ns justify-center fig">
<div class="ml1-m ml3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: 100%; width: auto; aspect-ratio: 1409/1878;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/OXm8tvrg-F-1252.jpeg" width="1409" height="1878" srcset="/assets/eleventyImgs/OXm8tvrg-F-1252.jpeg 1252w, /assets/eleventyImgs/OXm8tvrg-F-1409.jpeg 1409w" sizes="100vw"></div>
<div class="mh1-ns mv1 mv0-ns"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: 100%; width: auto; aspect-ratio: 2504/1878;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/yU7E_JSouU-1252.jpeg" width="2504" height="1878" srcset="/assets/eleventyImgs/yU7E_JSouU-1252.jpeg 1252w, /assets/eleventyImgs/yU7E_JSouU-2504.jpeg 2504w" sizes="100vw"></div>
<div class="mr1-m mr3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: 100%; width: auto; aspect-ratio: 2504/1878;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/aPBhDDAiiJ-1252.jpeg" width="2504" height="1878" srcset="/assets/eleventyImgs/aPBhDDAiiJ-1252.jpeg 1252w, /assets/eleventyImgs/aPBhDDAiiJ-2504.jpeg 2504w" sizes="100vw"></div>
</div>
```

![](/assets/garage/image-test-pages/devimg6.moz80.jpg)

Experimenting here:

```html
<div class="full-width cb flex flex-wrap flex-nowrap-ns justify-center fig">
<div class="helpdiv ml1-m ml3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto; width: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/OXm8tvrg-F-1409.jpeg" srcset="/assets/eleventyImgs/OXm8tvrg-F-1409.jpeg 1409w"></div>
<div class="helpdiv mh1-ns mv1 mv0-ns"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto; width: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/yU7E_JSouU-2504.jpeg" srcset="/assets/eleventyImgs/yU7E_JSouU-2504.jpeg 2504w"></div>
<div class="helpdiv mr1-m mr3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto; width: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/aPBhDDAiiJ-2504.jpeg" srcset="/assets/eleventyImgs/aPBhDDAiiJ-2504.jpeg 2504w"></div>
</div>
```

![](/assets/garage/image-test-pages/devimg7.moz80.jpg)

The taller image is getting:
- 500w: 159/500 32%

```html
<div class="full-width cb flex flex-wrap flex-nowrap-ns justify-center fig">
<div class="ml1-m ml3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto; width: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/_EDdord68w-313.jpeg" width="2504" height="1878" srcset="/assets/eleventyImgs/_EDdord68w-313.jpeg 313w, /assets/eleventyImgs/_EDdord68w-626.jpeg 626w, /assets/eleventyImgs/_EDdord68w-1252.jpeg 1252w, /assets/eleventyImgs/_EDdord68w-2504.jpeg 2504w" sizes="100vw"></div>
<div class="mh1-ns mv1 mv0-ns"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto; width: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/JU22y1OINo-313.jpeg" width="1440" height="1080" srcset="/assets/eleventyImgs/JU22y1OINo-313.jpeg 313w, /assets/eleventyImgs/JU22y1OINo-626.jpeg 626w, /assets/eleventyImgs/JU22y1OINo-1252.jpeg 1252w, /assets/eleventyImgs/JU22y1OINo-1440.jpeg 1440w" sizes="100vw"></div>
<div class="mr1-m mr3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto; width: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/tMFXf8ajHv-313.jpeg" width="2504" height="1878" srcset="/assets/eleventyImgs/tMFXf8ajHv-313.jpeg 313w, /assets/eleventyImgs/tMFXf8ajHv-626.jpeg 626w, /assets/eleventyImgs/tMFXf8ajHv-1252.jpeg 1252w, /assets/eleventyImgs/tMFXf8ajHv-2504.jpeg 2504w" sizes="100vw"></div>
</div>
```

All images, including the middle (shorter) one are getting the same W at layout time. But because the middle one is shorter, it doesn't take up the height. This makes me think that the browser is using the width only of srcset to assign width proportions, which then means they don't match heights. The above two even worked on Safari on first load (!) and now are broken on all future reloads (!!).

Working (w/o `srcset`):

```html
<div class="full-width cb flex flex-wrap flex-nowrap-ns justify-center fig">
<div class="ml1-m ml3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto; width: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/OXm8tvrg-F-1409.jpeg" width="1409" height="1878"></div>
<div class="mh1-ns mv1 mv0-ns"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto; width: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/yU7E_JSouU-2504.jpeg" width="2504" height="1878" ></div>
<div class="mr1-m mr3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto; width: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/aPBhDDAiiJ-2504.jpeg" width="2504" height="1878" ></div>
</div>
```

![](/assets/garage/image-test-pages/devimg8.moz80.jpg)

Wow, I hate this.

OK, so the width and height attributes don't seem to actually be reserving space in the layout. If removing those fixes things, that would be worth it.

```html
<div class="full-width cb flex flex-wrap flex-nowrap-ns justify-center fig">
<div class="ml1-m ml3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/OXm8tvrg-F-1252.jpeg" srcset="/assets/eleventyImgs/OXm8tvrg-F-1252.jpeg 1252w, /assets/eleventyImgs/OXm8tvrg-F-1409.jpeg 1409w" sizes="100vw"></div>
<div class="mh1-ns mv1 mv0-ns"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/yU7E_JSouU-1252.jpeg" srcset="/assets/eleventyImgs/yU7E_JSouU-1252.jpeg 1252w, /assets/eleventyImgs/yU7E_JSouU-2504.jpeg 2504w" sizes="100vw"></div>
<div class="mr1-m mr3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/aPBhDDAiiJ-1252.jpeg" srcset="/assets/eleventyImgs/aPBhDDAiiJ-1252.jpeg 1252w, /assets/eleventyImgs/aPBhDDAiiJ-2504.jpeg 2504w" sizes="100vw"></div>
</div>
```

The tall img is now broken again, doesn't seem easily fixable. The other one is fine.

```html
<div class="full-width cb flex flex-wrap flex-nowrap-ns justify-center fig">
<div class="ml1-m ml3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/_EDdord68w-313.jpeg" srcset="/assets/eleventyImgs/_EDdord68w-313.jpeg 313w, /assets/eleventyImgs/_EDdord68w-626.jpeg 626w, /assets/eleventyImgs/_EDdord68w-1252.jpeg 1252w, /assets/eleventyImgs/_EDdord68w-2504.jpeg 2504w" sizes="100vw"></div>
<div class="mh1-ns mv1 mv0-ns"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/tMFXf8ajHv-313.jpeg" srcset="/assets/eleventyImgs/tMFXf8ajHv-313.jpeg 313w, /assets/eleventyImgs/tMFXf8ajHv-626.jpeg 626w, /assets/eleventyImgs/tMFXf8ajHv-1252.jpeg 1252w, /assets/eleventyImgs/tMFXf8ajHv-2504.jpeg 2504w" sizes="100vw"></div>
<div class="mr1-m mr3-l"><img class="db bare novmargin " style="max-height: min(100vh, 939px); height: auto;" loading="lazy" decoding="async" alt="" src="/assets/eleventyImgs/JU22y1OINo-313.jpeg" srcset="/assets/eleventyImgs/JU22y1OINo-313.jpeg 313w, /assets/eleventyImgs/JU22y1OINo-626.jpeg 626w, /assets/eleventyImgs/JU22y1OINo-1252.jpeg 1252w, /assets/eleventyImgs/JU22y1OINo-1440.jpeg 1440w" sizes="100vw"></div>
</div>
```

Abandoning this direction. Eleventy Imgs is too slow with the current num. images anyway, given we need to restart the server every time because it caches files wrong. I'm also pretty sure that with all the auto dimensions it wouldn't reserve space anyway.

## Width-limiting

We can width-limit individual images. Is it best to width-limit containers so that we can margin-align multiple images?

<div class="full-width cb flex justify-center ph1-m ph3-l figtop mb1">
  <div style="max-width: 1140px;">
    <img class="db bare novmargin " src="/assets/garage/photo-notebook/aperture-pourover-full.moz80.jpg" loading="lazy" decoding="async">
  </div>
</div>

<div class="full-width cb flex justify-center mv1 ph1-m ph3-l">
  <div class="flex flex-wrap flex-nowrap-ns justify-center" style="max-width: 1140px;">
    <div class="mr1-ns mb1 mb0-ns">
      <img class="db bare novmargin " src="/assets/garage/image-test-pages/signs-2by3.moz80.jpg" loading="lazy" decoding="async">
    </div>
    <div class="">
      <img class="db bare novmargin " src="/assets/garage/image-test-pages/signs-2by3.moz80.jpg" loading="lazy" decoding="async">
    </div>
  </div>
</div>

<div class="full-width cb flex justify-center mt1 figbot ph1-m ph3-l">
  <div class="flex flex-wrap flex-nowrap-ns justify-center" style="max-width: 1140px;">
    <div class="">
      <img class="db bare novmargin " src="/assets/garage/image-test-pages/signs-2by3.moz80.jpg" loading="lazy" decoding="async">
    </div>
    <div class="mh1-ns mv1 mv0-ns">
      <img class="db bare novmargin " src="/assets/garage/image-test-pages/signs-2by3.moz80.jpg" loading="lazy" decoding="async">
    </div>
    <div class="">
      <img class="db bare novmargin " src="/assets/garage/image-test-pages/signs-2by3.moz80.jpg" loading="lazy" decoding="async">
    </div>
  </div>
</div>

One thing I can't remember, even looking at my notes above, is why I'm using padding to create page edge margins with single large images, but using margins for two or three images.

I do see that I switched to margins for between-image spacing to get the property of margins collapsing.^[Not sure if _collapsing_ is right term. Thing where if left says `mr1` and right says `ml1` then there is a `1` margin between them, not `2`.] But I don't know whether it was necessary to switch from padding for page-margin spacing. I guess I'll try it and find out.

Removing height-limiting means single and double images now create clean margins. For a smaller screen (e.g., 1336 x 679), portrait (2x3) images will now bleed off. This could be alleviated by making the max-width dynamic rather than static. E.g., the width of a container could be capped at a value such that a 2x3 image at roughly half its size won't be taller than 100vh. That's `3/2 * 0.5w ≤ 100vh`, so `w ≤ 133.3vh`?

<div class="full-width cb flex justify-center figtop mb1 ph1-m ph3-l">
  <div class="flex flex-wrap flex-nowrap-ns justify-center" style="max-width: min(1140px, 133.3vh);">
    <div class="mr1-ns mb1 mb0-ns">
      <img class="db bare novmargin " src="/assets/garage/image-test-pages/signs-2by3.moz80.jpg" loading="lazy" decoding="async">
    </div>
    <div class="">
      <img class="db bare novmargin " src="/assets/garage/image-test-pages/signs-2by3.moz80.jpg" loading="lazy" decoding="async">
    </div>
  </div>
</div>
<div class="full-width cb flex justify-center mv1 ph1-m ph3-l">
  <div class="flex flex-wrap flex-nowrap-ns justify-center" style="max-width: min(1140px, 133.3vh);">
    <div class="mr1-ns mb1 mb0-ns">
      <img class="db bare novmargin " src="/assets/garage/image-test-pages/signs-2by3.moz80.jpg" loading="lazy" decoding="async">
    </div>
    <div class="">
      <img class="db bare novmargin " src="/assets/garage/photo-notebook/aperture-pourover-full.moz80.jpg" loading="lazy" decoding="async">
    </div>
  </div>
</div>
<div class="full-width cb flex justify-center mv1 ph1-m ph3-l">
  <div class="flex flex-wrap flex-nowrap-ns justify-center" style="max-width: min(1140px, 133.3vh);">
    <div class="mr1-ns mb1 mb0-ns">
      <img class="db bare novmargin " src="/assets/garage/photo-notebook/aperture-pourover-full.moz80.jpg" loading="lazy" decoding="async">
    </div>
    <div class="">
      <img class="db bare novmargin " src="/assets/garage/photo-notebook/aperture-pourover-full.moz80.jpg" loading="lazy" decoding="async">
    </div>
  </div>
</div>
<div class="full-width cb flex justify-center ph1-m ph3-l figbot mt1">
  <div style="max-width: min(1140px, 133.3vh);">
    <img class="db bare novmargin " src="/assets/garage/photo-notebook/aperture-pourover-full.moz80.jpg" loading="lazy" decoding="async">
  </div>
</div>

<p class="figcaption">Wow, I think that works.</p>

Of course, single portrait images will still be massive, but that's just inevitable. This way, at least, they still match the margins because the container is limited, not the image.

<div class="full-width cb flex justify-center ph1-m ph3-l figbot mt1">
  <div style="max-width: min(1140px, 133.3vh);">
    <img class="db bare novmargin " src="/assets/garage/image-test-pages/signs-2by3.moz80.jpg" loading="lazy" decoding="async">
  </div>
</div>

With the new styles, there won't be a way to insert height-limited single portrait photos. But they are so rare right now that I can build that in when desired.

I'm debating whether to try to add this to the existing styles, or to make a new shortcode. There are more differences than I'd anticipated in the features needed:

feature | full-width (old) | width-limited (new)
--- | --- | ---
video embeds | ✅ | ✅
svg bg blur | ✅ | ❌
max height | ✅ | ❌
extra div | ❌ | ✅
2/3-img margin &rarr; padding | 👌 | ✅
array processing | ✅ | ✅
swap to options | ❌ | ✅

I'm curious enough about how my DX can be improved that I'm going to try it.

This was added as `v2` house styles (see top of this page).

An additional improvement will be in image size savings. Here's the math for landscape images:
- `v1`: height limit of 1878px &rarr; 2815 x 1878 &cong; 5.29M px
- `v2`: width limit of 2280px &rarr; 2280 x 1522 &cong; 3.47M px &cong; 65.6% of the previous size

There's also a chance this helps me start integrating source sets (multiple image sizes) or even adding dimensions to reserve space, though I don't want to jinx it.

## Reminder: Matching Heights

Another thing I'm noticing re-reading my old design notes is I'd tested my layouts all assuming side-by-side images have the same height. I wonder if this was related to the issues I had above when trying to use auto-generated image sizes: that if the heights don't match, my CSS might not work. I remember the issue being weirder though.

{% img [[
  "/assets/garage/image-test-pages/704x939@3x.png",
  "/assets/garage/image-test-pages/256x256@2x.png"
]] %}

<p class="figcaption">But yeah, different heights, they definitely don't match.</p>

Out of curiosity, I checked `eleventy-img` again, and there is indeed no way to specify height resizes, only width. The [issue](https://github.com/11ty/eleventy-img/issues/31) that contains that feature request has been open since November 2020 and as of writing (June 2023) it remains the top feature request but is still unimplemented. Damn.
