---
title: Image lazy load test page
date: 2023-02-24
---

## Attribute Investigation

NB: The following numbers change as I add more text here because the images are getting pushed further down the page.

- As expected, raw images don't lazy load (115 requests, 74MB)
  > e.g., `<img src="/assets/posts/2022-israel/IMG_1748.moz80.jpg" />`

- Doing raw widths and heights works (15 requests, < 1MB; throttled 17 requests, < 1MB)
  > e.g., `<img src="/assets/posts/2022-israel/IMG_1748.moz80.jpg" width="1125" height="1163" loading="lazy"/>`

- Doing house styles without width+height... works!? (-36 requests, 12MB; throttled 49--52 requests, 26MB)
  > e.g., `<div class="full-width flex justify-center ph1-m ph3-l fig"><img class="db bare novmargin" src="/assets/posts/2022-israel/IMG_1748.moz80.jpg" style="max-height: min(100vh, 939px);" loading="lazy" /></div>`

- Adding `width` and `height` attributes doesn't help (36 requests, 12MB; throttled 48 requests, 26MB). I guess it wants their layout size rather than source size.
  > e.g., `<div class="full-width flex justify-center ph1-m ph3-l fig"><img class="db bare novmargin" src="/assets/posts/2022-israel/IMG_1748.moz80.jpg" style="max-height: min(100vh, 939px); width: auto; height: auto;" width="1125" height="1163" loading="lazy" /></div>`

    - I'm not going to add `width` and `height` attributes for now because there seems to be no lazy loading benefit and it would be annoying to try to get them all. I think I'd have to incorporate a new Eleventy plugin into my build. Though my one remaining question is whether they'd prevent the layout from jumping around (given that I'll be using `width: auto; height: auto;` too)?

OK, so I don't understand why this isn't working in a normal page, then. Trying on an actual page:

Testing via Israel Blogpost:

- Live online, no lazy: 331 requests, **180MB**
- Laptop, no lazy: 249 requests, **99MB**
    - What’s all the extra stuff online?!
- Laptop, lazy: 210 requests, **74MB**[^maps]
    - So this does work, but not great. Only 25% savings.
    - Adding to cityMap images: 205 requests, **73MB**
    - Realized inline images don't have lazy load tag (!). Wonder whether I can easily add.
    - Realized background images for blur stretching images might be causing them to be fetched in advance. It's prefetching ~33 JPEGs total.
    - Disabling blur background feature: 131 requests, **7.5MB**. Wow, this worked wonders. Now it's only loading the 2 top map images (which we want), the first few post images (which is fine), and all the inline ones (which we might be able to fix).

[^maps]: Without the interactive maps, it's 117 requests, 72MB (vs ~73MB). So map tiles are lots of requests but small images. Not worth stressing about.

OK, we have our work cut out for us:
- [x] Can we keep the blur stretch feature without preloading all the images?
- [x] Can we automatically add `loading="lazy"` to inline markdown images?

## Lazy Loading Background Blur Images

Nice [guide](https://web.dev/lazy-loading-images/) with snippet for accomplishing this for background images, where it's not natively done in browsers.

This totally worked! Wow, it's so thrilling when things are possible. It looks like this:

```js
let lazyBGs = [].slice.call(document.querySelectorAll(".svgBlur"));
if ("IntersectionObserver" in window) {
    let lazyBGObserver = new IntersectionObserver((elements, _observer) => {
        elements.forEach((el) => {
            if (el.isIntersecting && el.target.hasAttribute("data-background-image")) {
                // replace the background-image style with the contents of the data-background-image attribute
                el.target.style.backgroundImage = el.target.getAttribute('data-background-image');
                lazyBGObserver.unobserve(el.target);
            }
        });
    });

    lazyBGs.forEach((lazyBG) => {
        lazyBGObserver.observe(lazyBG);
    });
}
```

With that, we've kept the weight down to **~7MB.**

## Making Inline Markdown Images Lazy

Some pointers [here](https://github.com/11ty/eleventy/discussions/1714). The super simple [markdown-it-image-lazy-loading](https://www.npmjs.com/package/markdown-it-image-lazy-loading) plugin worked a like a charm. We're now down to **3MB** (!!!), which is just the images Chrome fetches that are at the top of the page. Amazing. (Once I turn the interactive maps back on, this goes up to 5MB, which is totally acceptable.)

## Big List of Images for Testing

I'm omitting the gazillion image tags and variants I used for testing here. Here's a script to generate different versions for posterity:

```bash
#!/bin/bash

#
# Prepare a list of images from a file called imgs.txt that has local paths, one
# per line, like:
#      assets/posts/2022-israel/IMG_1748.moz80.jpg
# ... and spits out a bunch of HTML tags (including leading slash) for testing
# many images per page and lazy loading, like:
#    <img src="/assets/posts/2022-israel/IMG_1748.moz80.jpg" />
#

set -eu -o pipefail

while read f; do
    # no lazy load:
    # identify ${f} | pyp 'fn, _, dims, *rest = x.split(" "); x,y = dims.split("x"); print(f"<img src=\"/{fn}\" />")'

    # works:
    # identify ${f} | pyp 'fn, _, dims, *rest = x.split(" "); x,y = dims.split("x"); print(f"<img src=\"/{fn}\" width=\"{x}\" height=\"{y}\" loading=\"lazy\" />")'

    # house style w/ lazy only ... works??
    # identify ${f} | pyp 'fn, _, dims, *rest = x.split(" "); x,y = dims.split("x"); print(f"<div class=\"full-width flex justify-center ph1-m ph3-l fig\"><img class=\"db bare novmargin\" src=\"/{fn}\" style=\"max-height: min(100vh, 939px);\" loading=\"lazy\" /></div>")'

    # combines house style w/ explicit width + height, but also CSS `width: auto; height: auto;` (no improvement)
    identify ${f} | pyp 'fn, _, dims, *rest = x.split(" "); x,y = dims.split("x"); print(f"<div class=\"full-width flex justify-center ph1-m ph3-l fig\"><img class=\"db bare novmargin\" src=\"/{fn}\" style=\"max-height: min(100vh, 939px); width: auto; height: auto;\" width=\"{x}\" height=\"{y}\" loading=\"lazy\" /></div>")'
done < imgs.txt
```
