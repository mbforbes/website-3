---
title: Image Placeholder Test Page
date: 2023-07-08
updated: 2023-07-09
---

Is it possible to have images save space and render placeholders before they've loaded?

## Site-wide

I went down the `eleventy-img` rabbit hole in the [image layout test page](/garage/image-layout-test-page/) (under _Explicit image sizes_ headings). However, two issues with attempting this for all images:

1. Given how much the layout for images in my `img` v1 macro required CSS, I don't even know whether providing their dimensions would have reserved space. IIRC, the browser wasn't saving space in advance.

2. Given the number of images, and that I `rm -rf _site/` before running eleventy to remove caching errors, the startup time for eleventy-img became astronomical.

In an ideal world, I'd use something like [thumbhash](https://evanw.github.io/thumbhash/), but I wasn't smart enough to figure out how to plug-and-play it. The best I figured it out, it requires (a) integrating hash generation into your asset pipeline, (b) on rendering, creating a canvas element and running a javascript function to load the hash and draw the image. While (a) would be doable, I'm not sure what the best practice for (b) would be. Is it lightweight enough to run in blocking JS at the start of page load? If not, and it runs in a `defer`'d script, would it run so late that images would just load anyway?

So, fully fixing this site-wide would involve:

1. **Build HTML/CSS layout** --- Testing my v2 CSS macro and potentially developing it until browsers are able to save space for images in advance given w/h attrs.

2. **+ `srcset`** --- Refining the above using srcset (experience has taught this changes image layout behavior).

3. **Determine image size styles** --- The simplest version of this likely has three widths: mobile, small desktop/tablet, full-size. Have to figure out the rules for these.

4. **Faster eleventy-img or cache correctness** --- Either profiling and patching eleventy-img (optimistically: direct copying enough? maybe not w/ wanting small sizes of everything...) or re-assessing whether I'm OK with keeping the image cache under most occasions, and profiling startup times keeping it.

5. **thumbhash profile and frontend integration** --- Investigating `thumbhash` time requirements on page loads, especially on mobile. Checking out both blocking and defer options. The, integrating the scripts into my site.

6. **thumbhash backend integration** --- Adding `thumbhash` generation into the build pipeline, either inside, alongside, or separate to the eleventy-img pipeline.

7. **potential v1&rarr;v2 migration** --- To fix this for all old posts would require changing over the layouts. This probably wouldn't be too bad, though I might run into tough decisions where I have a full-page v1 grid I want to keep, but I can't do it unless I backport all the above fixes to the v1 styles, which would run me back into the layout issues^[Extensive struggles documented in [image layout test page](/garage/image-layout-test-page/)] and the eleventy-img inability to choose a height export. I'd need to either keep v1 and load big images w/ layout shifts, abandon v1, struggle more with the layout, patch eleventy-img, or some combination.

It's risky because any of these could fail. Thumbhash has alternatives, or I could use the same SVG placeholder for all them.

## Cover images

The best bang for the buck is to start with cover images.

Cover images are huge and right at the top of a post. Even on fast connections they pop in. They're both the most important to fix, and the most possible: early experiments indicate adding w/h does allow Chrome at least to save space for them. Plus, I can sidestep all the layout and eleventy-img optimization issues, because they can exist in a separate macro.

Any space-saving involves adding dimensions, which means the eleventy-img plugin, which means I'd might as well serve smaller images. And that alone would help a lot, even if I fail to integrate `thumbhash`. Let's go through this in order.

### 1. Building HTML/CSS Layout

Working with a test image and throttling to make sure space is reserved.

<img src="/assets/garage/image-placeholder-test-page/test-cover.moz80.jpg" class="db w-100 h-auto bg-navy" width="2280" height="1522" style=""/>

<p class="figcaption">
{{ '`<img src="/assets/garage/image-placeholder-test-page/test-cover.moz80.jpg" class="db w-100 h-auto bg-navy" width="2280" height="1522" style=""/>`' | md | safe }}
</p>

The above works inline. Testing in layout (`default.njk`) it works too.

### 2. + `srcset`

Gotta learn how this works. Here's a [good guide](https://cloudfour.com/thinks/responsive-images-101-part-4-srcset-width-descriptors/) linked by MDN. Some notes:

- In `srcset`, the `w` unit (`srcset="foo.jpg 500w, ..."`) is the image's true resolution (well, width).

    - The display density unit (`2x`) has few conceivable use cases, because the odds an image is displayed at the same virtual pixel size (e.g., 300 x 300) but then requires different density versions (1x, 2x, 3x) seems very low to me. I guess it would only apply to images that are always small on every device, like fixed-size stamps or icons. For responsive images, I don't see it being useful.
        - E.g., an 100% image is 375px width on mobile with 3x display density = 1125px. On desktop at say 1000px, 2x display density = 2000px. So the 3x pixel density image is smaller than the 2x pixel density image? It doesn't make any sense.

- **The browser starts requesting images before the CSS (and JS) are even loaded,** so we can't use CSS or JS to determine which images to load. They're not available. All the browser knows is the viewport size.

- An image's size might not scale exactly with the viewport. E.g., in a card layout, an image is 100% viewport width on mobile, but only a fraction (maybe 1/5) on a desktop. The `sizes` attribute lets us describe the relation.

    - The `sizes` attribute is kind of a lightweight re-description of your image sizing CSS. It describes what % of the viewport width an image will take up (e.g., `100vw` = 100% width, or `33vw` = 33% width) based on the size of the viewport (e.g., `max-width 480px`.)

    - Because my cover images will take up 100% of the viewport width, `sizes` shouldn't matter.

- I think the missing link here is the connection between `srcset` and `sizes`. At first glance, `sizes` appears to be referring to directly picking an image in `srcset`, but I think that's not true. I think it's like:

    1. Use `sizes` to determine size of image display
    2. **Use pixel density to determine desired image dimensions**
    3. Find closest match in `srcset`

  (At least, I hope this is how it works.)

I'm going to make a few versions of the test cover image above and manually add srcset and see what the browser loads at different viewport sizes. Hopefully I can determine whether it accounts for pixel density.

The following image has three size variants (2280, 1140, and 570 px width) with watermarks to show which is being rendered. For simplicity, I've set the anticipated display to `100vw`. On desktop, it will actually display inline, so those browsers will pick a bigger image than is needed.

<img
    src="/assets/garage/image-placeholder-test-page/test-cover.2280w.moz80.jpg"
    srcset="/assets/garage/image-placeholder-test-page/test-cover.2280w.moz80.jpg 2280w,
            /assets/garage/image-placeholder-test-page/test-cover.1140w.moz80.jpg 1140w,
            /assets/garage/image-placeholder-test-page/test-cover.570w.moz80.jpg 570w"
    sizes="100vw"
    class="db w-100 h-auto bg-navy"
    width="2280"
    height="1522"
    style="" />

<p class="figcaption">
{{
    '`<img
    src="/assets/garage/image-placeholder-test-page/test-cover.2280w.moz80.jpg"
    srcset="/assets/garage/image-placeholder-test-page/test-cover.2280w.moz80.jpg 2280w,
            /assets/garage/image-placeholder-test-page/test-cover.1140w.moz80.jpg 1140w,
            /assets/garage/image-placeholder-test-page/test-cover.570w.moz80.jpg 570w"
    sizes="100vw"
    class="db w-100 h-auto bg-navy"
    width="2280"
    height="1522"
    style="" />`' | md | safe
}}
</p>

Debugging. Tl;dr it wasn't working because I had the full image above.

- Chrome is making it hard to tell what image is being used. It shows "Current source" differently depending on which link you're hovering over. Choosing a tiny window (235px wide), it's saying for `src` and both 2280 and 1140 `srcset` urls it's using the 2280 image, and the 570 image for the 570 size. Like, OK, but... what single image are you actually rendering? I'm going to add indicator text to the images so I can tell.^[Having figured this whole thing out, the current source display is working, and was indeed using the large image size all the time. There is still some occasional confusion when changing responsive sizes, and the smallest size being listed as a different source when not being used. Though there might be something more going on---perhaps with what it _would_ be showing?]

- Now with indicator text, I can see it's using the 2280w image every time, no matter if I choose a mobile device size or a tiny window. I can get it to randomly show the 570w or 1140w images if I change in-between responsive sizes. But then once I reload, it goes back to 2280. Even if I pick iPhone SE (375px w) and throttle to Fast 3G, it uses the 2280w img. (I'm guessing throttling doesn't do anything.)

- Ooh, could it be because the full-size image is already provided above? That might be it. Let me change it. Yep, that was totally it. **So browsers are smart---might as well use one of the (bigger) srcset images if you already have to get it for another purpose.**

- Now, Chrome does request different images depending on device. Small for tiny iPhones, medium for normal iPhones and smaller desktop widths, and large for iPads and big desktop sizes. Interestingly, it seems to be pretty smart and a little conservative---e.g., I'm pretty sure my laptop's true pixel density is < 2, like 1.5 or something, and it's requesting the M image for longer than you would for a strict 2x upgrade to the L size. My iPhone requests the M image, which seems appropriate for its pixel density (375x812 @3x). ([Quick link to screen resolution test](https://screenresolutiontest.com/))

Question: now that I'm providing `srcset` and `sizes`, do I still need `width` and `height` attrs? And if so, do they just ignore smaller screens / `srcset` sizes and provide the full, original dims?

<img
    src="/assets/garage/image-placeholder-test-page/test-cover.2280w.moz80.jpg"
    srcset="/assets/garage/image-placeholder-test-page/test-cover.2280w.moz80.jpg 2280w,
            /assets/garage/image-placeholder-test-page/test-cover.1140w.moz80.jpg 1140w,
            /assets/garage/image-placeholder-test-page/test-cover.570w.moz80.jpg 570w"
    sizes="100vw"
    class="db w-100 h-auto bg-navy"
    style="" />

<p class="figcaption">{{ "Same as above, omitting `width` and `height` attrs. The browser won't save space for this image." | md | safe }}</p>

Yes, we do still need them. Otherwise the browser doesn't save space for the image. Fortunately, choosing the whole `srcset` / image source choosing works fine even with the `width` and `height` just set to the original image dims.

### 3. Determine image size styles

Since these are huge images and they'll be full-screen w/ no width limit, I think it makes sense to export to 4K for future-proofing.

Then, might as well go down by halves.
- 3840 (4k)
- 1920 (1080p)
- 960
- 480 &larr; probably too low to be realistically needed

One Q is whether to add something between 4k and 1080p, since that's a huge gap and there are biggest savings at the large end. I think I'll punt on this for now, can always add more.

Already exported images are mostly 2504 x 1878, which will reduce to:
- 2504
- 1252
- 626
- 313 &larr; probably too low to be realistically needed

Going to check image sizes when generating and use the heuristic to keep halving while > 500px.

### 4. Faster eleventy-img or cache correctness

Skipping since there won't be that many cover images.

### 4.5 Actually integrating all this

Before I get to thumbhash, I can implement the above into the site! I implemented this as the `coverImg` macro in my eleventy config:

```js
eleventyConfig.addShortcode("coverImg", async function (path, classes = "", style = "") {
    let localPath = path[0] == "/" ? path.substring(1) : path;
    let stats = Image.statsSync(localPath);
    let w = stats.jpeg[0].width;  // NOTE: Change if I ever use more than jpegs
    let ws = [];
    while (w > 500) {
        ws.push(w);
        w = Math.round(w / 2);
    }

    let metadata = await Image(localPath, {
        widths: ws,
        formats: ["auto"],
        outputDir: "./_site/assets/eleventyImgs/",
        urlPath: "/assets/eleventyImgs/",
    });
    return Image.generateHTML(metadata, {
        sizes: "100vw",
        class: classes,
        style: style,
        // cover image is @ page top, so we actually want it to load ASAP
        // loading: "lazy",
        // decoding: "async",
        alt: "",
    });
});
```

This works! Cover images now save space rather than causing layout shifts (just a navy background color for now), and smaller sizes are generated and loaded when appropriate.

### 5/6 thumbhash

It's surprisingly hard to figure out how to use it! Even the example JavaScript code says "you'll probably generate the hashes on the server," but there's no example JavaScript code to do this on the server (i.e., in Node). A lovely commenter gave an example Node implementation in an issue that uses a Rust canvas library:

https://github.com/evanw/thumbhash/issues/2

I want to make sure this installs before proceeding.
