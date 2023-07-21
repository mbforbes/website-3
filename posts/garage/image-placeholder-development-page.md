---
title: Image Placeholder Development Page
date: 2023-07-08
updated: 2023-07-16
---

Is it possible to have images save space and render placeholders before they've loaded?

## Site-wide

I went down the `eleventy-img` rabbit hole in the [image layout test page](/garage/image-layout-test-page/) (under _Explicit image sizes_ headings). However, two issues with attempting this for all images:

1. Given how much the layout for images in my `img` v1 macro required CSS, I don't even know whether providing their dimensions would have reserved space. IIRC, the browser wasn't saving space in advance.

2. Given the number of images, and that I `rm -rf _site/` before running eleventy to remove caching errors, the startup time for eleventy-img became astronomical.

In an ideal world, I'd use something like [thumbhash](https://evanw.github.io/thumbhash/), but I wasn't smart enough to figure out how to plug-and-play it. The best I figured it out, it requires (a) integrating hash generation into your asset pipeline, (b) on rendering, creating a canvas element and running a javascript function to load the hash and draw the image. While (a) would be doable, I'm not sure what the best practice for (b) would be. Is it lightweight enough to run in blocking JS at the start of page load? If not, and it runs in a `defer`'d script, would it run so late that images would just load anyway?

So, fully fixing this site-wide would involve:

1. **Build HTML/CSS layout** --- Testing my v2 CSS macro and potentially developing it until browsers are able to save space for images in advance given w/h attrs.

2. **+ `srcset`** --- Refining the above using `srcset` (experience has taught this changes image layout behavior).^[Upon further consideration, adding `srcset` may have simply caused images with varying heights to be used, which breaks my flexbox layout. So solving the varying-heights issue might be sufficient to get `srcset` working.]

3. **Determine image size styles** --- The simplest version of this likely has three widths: mobile, small desktop/tablet, full-size. Have to figure out the rules for these.

4. **Faster eleventy-img or cache correctness** --- Either profiling and patching eleventy-img (optimistically: direct copying enough? maybe not w/ wanting small sizes of everything...) or re-assessing whether I'm OK with keeping the image cache under most occasions, and profiling startup times keeping it.

    - Followup thought: I could get image stats without copying / resizing. If I can get this to be quick, this might be worth it on its own for sizes, and maybe even thumbhash placeholders.

5. **thumbhash profile and frontend integration** --- Investigating `thumbhash` time requirements on page loads, especially on mobile. Checking out both blocking and defer options. The, integrating the scripts into my site.

6. **thumbhash backend integration** --- Adding `thumbhash` generation into the build pipeline, either inside, alongside, or separate to the eleventy-img pipeline.

    - Followup thought: These could be cached, which would make lookups much faster if I'm doing it for hundreds of images.

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



<details>
<summary>Debugging why this wasn't working. Tl;dr I had the full image above.</summary>

- Chrome is making it hard to tell what image is being used. It shows "Current source" differently depending on which link you're hovering over. Choosing a tiny window (235px wide), it's saying for `src` and both 2280 and 1140 `srcset` urls it's using the 2280 image, and the 570 image for the 570 size. Like, OK, but... what single image are you actually rendering? I'm going to add indicator text to the images so I can tell.^[Having figured this whole thing out, the current source display is working, and was indeed using the large image size all the time. There is still some occasional confusion when changing responsive sizes, and the smallest size being listed as a different source when not being used. Though there might be something more going on---perhaps with what it _would_ be showing?]

- Now with indicator text, I can see it's using the 2280w image every time, no matter if I choose a mobile device size or a tiny window. I can get it to randomly show the 570w or 1140w images if I change in-between responsive sizes. But then once I reload, it goes back to 2280. Even if I pick iPhone SE (375px w) and throttle to Fast 3G, it uses the 2280w img. (I'm guessing throttling doesn't do anything.)

- Ooh, could it be because the full-size image is already provided above? That might be it. Let me change it. Yep, that was totally it. **So browsers are smart---might as well use one of the (bigger) srcset images if you already have to get it for another purpose.**

</details>

Now Chrome requests different images depending on device. Small for tiny iPhones, medium for normal iPhones and smaller desktop widths, and large for iPads and big desktop sizes. Interestingly, it seems to be pretty smart and a little conservative---e.g., I'm pretty sure my laptop's true pixel density is < 2, like 1.5 or something, and it's requesting the M image for longer than you would for a strict 2x upgrade to the L size. My iPhone requests the M image, which seems appropriate for its pixel density (375x812 @3x). ([Quick link to screen resolution test](https://screenresolutiontest.com/))

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

### 5/6. thumbhash

It's surprisingly hard to figure out how to use it! Even the example JavaScript code says "you'll probably generate the hashes on the server," but there's no example JavaScript code to do this on the server (i.e., in Node). A lovely commenter gave an example Node implementation in an issue that uses a Rust canvas library:

https://github.com/evanw/thumbhash/issues/2

I want to make sure this installs on my website deployment server before proceeding. (OK, it does.)

I then ran into problems getting the correct hashes to render. The following table's "actual" column runs thumbhash and outputs hex representation. (It's working now. The hashes are very close.)

img | expected (hex) | actual (hex)
--- | --- | ---
`test-cover.moz80.jpg` | `8F E8 09 0D 82 BE 89 57 7F 77 87 6D 77 98 77 68 04 91 B9 FA 76` | `8F E8 09 0D 82 BE 89 57 7F 77 87 6D 77 98 77 68 04 91 B9 FB 66`

<p class="figcaption">
{{ "This used to use the `thumbhashhex` macro on `'/assets/garage/image-placeholder-test-page/test-cover.moz80.jpg'`, but I removed that internally for API smoothness." | md | safe }}
</p>

The following table shows base64-encoded hashes.

img | b64 hash
--- | ---
`test-cover.moz80.jpg` | {% thumbhash '/assets/garage/image-placeholder-test-page/test-cover.moz80.jpg' %}
`test-cover.570w.moz80.jpg` | {% thumbhash '/assets/garage/image-placeholder-test-page/test-cover.570w.moz80.jpg' %}

<p class="figcaption">Note: I can't get these tables to not overflow and instead scroll on small screens. I hate HTML and CSS.</p>

The following two images renders these base64-encoded hashes as images:

<img class="w-100" style="aspect-ratio: 3/2;" data-thumbhash-b64="{% thumbhash '/assets/garage/image-placeholder-test-page/test-cover.moz80.jpg' %}" />

<p class="figcaption">Rendered thumbhash of test-cover.moz80.jpg</p>

<img class="w-100" style="aspect-ratio: 3/2;" data-thumbhash-b64="{% thumbhash '/assets/garage/image-placeholder-test-page/test-cover.570w.moz80.jpg' %}" />

<p class="figcaption">Rendered thumbhash of test-cover.570w.moz80.jpg, i.e., a pre-shrunk version of the above image.</p>

The next image tests rendering: taking a reference hex thumbhash from the thumbhash demo webpage and displaying it as the `background` style of the `<img>` element.

<img class="w-100" style="aspect-ratio: 3/2;" data-thumbhash-hex="8F E8 09 0D 82 BE 89 57 7F 77 87 6D 77 98 77 68 04 91 B9 FA 76" />

<p class="figcaption">{{ "Rendering of pre-computed thumbhash `8F E8 09 0D 82 BE 89 57 7F 77 87 6D 77 98 77 68 04 91 B9 FA 76` from reference implementation." | md | safe }}</p>

<script type="module">
    // some code from https://github.com/evanw/thumbhash/blob/main/examples/browser/index.html

    import * as ThumbHash from '/assets/lib/thumbhash.js';

    function hex2bin(hexStr) {
        const hex = hexStr.replace(/[\s,\[\]]/g, '');
        if (hex.length & 1 || /[^0-9a-fA-F]/.test(hex)) {
            console.error("Failed test");
            return
        }
        const hash = new Uint8Array(hex.length >> 1)
        for (let i = 0; i < hex.length; i += 2)
            hash[i >> 1] = parseInt(hex.slice(i, i + 2), 16)
        return hash
    }

    const hexEls = document.querySelectorAll('[data-thumbhash-hex]');
    for (let el of hexEls) {
        const hexHash = el.getAttribute("data-thumbhash-hex");
        const binHash = hex2bin(hexHash);
        const placeholderURL = ThumbHash.thumbHashToDataURL(binHash);
        el.style.background = `center / cover url(${placeholderURL})`;
    }
</script>

From the above tests, I learned that I was rendering the thumbhashes fine, but I wasn't generating them correctly. I guess this isn't too surprising given I'm using the code in a random GitHub comment.

This repository might offer some guidance about using the napi-rs package I'm using:
https://github.com/amehashi/thumbhash-node

Ah, solved the bug! One line was using the original widths instead of the smaller resized ones. This might have been grabbing a bunch of empty pixels.

```diff-js
-const imageData = ctx.getImageData(0, 0, width, height);
+const imageData = ctx.getImageData(0, 0, resizedWidth, resizedHeight);
```

My next question is about what to actually do on pageload. I can think of a few options:

1. Send thumbhash

    a. render immediately (blocking, early JS)

    b. render later, blocking (blocking, late JS)

    c. render later, nonblocking (deferred JS)

2. Send full PNG placeholder

The PNG data is about 4.2KB. This isn't much; 100 images would be 420KB. But it's certainly more elegant to send the base64 thumbhash, which is 29B.

**Testing 1. send thumbhash**

Starting with least-obtrusive first.

- **c.** If the (module) script is loaded with all the `defer`ed scripts, with or without `async`, on either fast or slow 3G, the cover image is ~50-75% loaded by the time the thumbhash background appears.

- **b.** If the non-module script is placed near the bottom of the page, but is blocking, it pops in very quickly (image maybe 1% loaded), and takes 2-6ms to run. (Surprisingly, the script executes slower on fast/slow 3G throttling. Why?)

This seems like a good balance. But if there are 100 images, will it take 600ms to run? Probably not, since JIT / startup time, but I'm curious.

One bummer for now is that eleventy is a bit slow already generating pages because of doing the thumbhashes.

&nbsp; | `npm run build`
--- | ---
base | 7.0s (3x avg)
\+ coverImg thumbhashes | 9.6s (3x avg)

There are some silly things I'm doing in the Eleventy config file (e.g., `await thumbhash` to load the library... every function call?), and I'm not precomputing / caching the thumbhashes, which I totally could do. But ~10s for every reload is already getting pretty crazy.

### 7. v1/v2 migration

n/a


## Main images

I'm a fool, but I want this to work. Scrolling through a big page of jumping images is dreadful.


### 0. Optimizing eleventy reloads

In-memory optimizing won't help w/ build, but will help with rebuilds, and it's easy. Benchmarking (th = thumbhash, EI = EleventyImage)

&nbsp; | time (3x avg)
--- | ---
base (no th, no EI) | 4.06, 3.96, 4.15
\+ EI 1x | 4.18, 3.72, 4.00
\+ EI 3x | 4.02, 3.72, 3.70
current (th, EI) | 7.15, 7.15, 7.05

So thumbhash is the slow thing now. Let's try an in-memory cache for thumbhashes (thCache).

&nbsp; | time (3x avg)
--- | ---
thCache, EI | 4.05, 3.68 3.70

It works!

### 0.5 Better Image Placeholder Tests

If I can get an HTML/CSS layout that shows whether the browser is saving space for the image, that would be great because I wouldn't have to constantly simulate a slow network to test. I'm wondering if having an invalid `src` attribute will do.

<img src="foo" class="bg-navy" />

<p class="figcaption">
{{ '`<img src="foo" class="bg-navy" />`' | md | safe }}
</p>

<img src="foo" width="300" height="300" class="bg-navy" />

<p class="figcaption">
{{ '`<img src="foo" width="300" height="300" class="bg-navy" />`' | md | safe }}
</p>

It works!

### 1. v2 HTML/CSS layout

The first thing is to get the image layout working w/ non-height matching images. As-always, this work is done over at the [image layout test page](/garage/image-layout-test-page/).

> Actually, I should just see if I can output the dimensions and have solid backgrounds (and possibly thumbhashes) first. Then I can worry about the non-matching heights and eleventyImg sizes later. But I did get a working draft of the non-matching heights hacked up, so can reference that down the line.

Surprisingly, the solution to varying heights and having a layout that works with explicit width / height attributes was the same thing: manually specifying image-containing div widths.

My remaining question is how to output CSS.

### 4/6/7. caching (sizes and thumbhash), v1

This is all getting unstructured. Since I realized I could potentially get the same layout to work w/o srcset and different sizes (just keeping original height-matching images), adding width, height, and thumbhash, I'm trying that for v1, which will affect all the posts that currently exist.

Currently, a few problems:
- the startup time is now 200+ seconds (😱)
    - don't know if this is eleventyImg or thumbhash or both
- some layouts are screwed up

Startup time --- 202s, 202s. Either the disk cache doesn't work, or it does but hashing hundreds (thousands?) of images is slow. The PR describing the disk cache says it runs image contents through hash. There are several issues about it being slow (https://github.com/11ty/eleventy-img/issues/170), it all seems like it should be improved in v3 of the plugin, but it's still mind-numbingly slow.

w/o thumbhash
- 23.7 s startup
- 4.6 s reload

w/ thumbhash
- 202.5 s startup
- 4.35 s reload

OK, so basically thumbhash cache is working, but has to be disk cached to be viable. Also, if I'm just getting dimensions, I may be able to drastically speed up if eleventy img is hashing images when I try to get the stats. The image size module is doing some legit EXIF parsing (https://github.com/image-size/image-size/blob/main/lib/types/jpg.ts) so should be quick.

no thumbhash, eleventyImg for size
- 24.5 s startup
- 4.3 s reload

no thumbhash, `image-size` module for size
- 8.78 s startup
- 4.9, 4.7, 4.8 s reload

So startup is way faster, but they cache sizes. But I can cache sizes too.

no thumbhash, `image-size` with my own cache
- 8.5 s startup
- 4.3, 3.9, 4.2 s reload

Now, with thumbhash disk cache:
- first build: 182 s
- next builds: 4.8, 5.1, 4.8 s
- reloads: 4.2, 4.5, 4.0 s

Good news: ~1600-sized caches have sped initial builds to 5s and reloads to 4s, all v2 and v1 images have placeholder sizes and thumbhashes. Bad news: v1 layouts aren't working -- images stretched. Need a designated v1 test page and to finally hammer it out, or to just migrate to v2. Remaining big complications / questions:

- is the v2 width-limited style just better enough to migrate v1 pages to it? do we recompute the height limit that was 3:2-specific to account for v1 images? if not, perhaps taking inspiration from the v2 design could help v1 work.

- will eleventyImg be fast enough to do the whole site w/ multiple sizes? May be worth a timing check... if not, is it worth implementing on my own?

- if we will support varying heights, how do we output the classes?

- how do we support inline images? it turns out there are plenty of them. The current lazy load plugin for markdown-it is quite simple, I could replace with my own plugin, and if the rest of the code is in scope, I could use the caches + thumbhashes.

CURSPOT actual:
- [x] figure out a layout that works for v1 (max-width math)
- [x] implement it
- [x] height-limiting
- [x] maybe actually do default height-limiting
- [x] fix videos (tiny, many diff behaviors, also e.g. youtube vs vimeo)
- [x] SHIP
- [ ] double or 1.5x fig spacing?
- [ ] SHIP
- [x] inline images
- [x] SHIP
- [ ] maps and city pics
- [ ] SHIP
- [ ] multiple sizes (test speed, but probably DIY...)
