---
title: Speeding up DOMContentLoaded
date: 2023-02-23
---

## context: big webpages

I've become what I despise. I am now someone who makes 100MB+ webpages.

My travel blog posts, despite living on my meticulously hand-coded website, are weighing in at ~115MB. Too many photos. And worse, now that I switched to Cloudflare (to get around GitHub Pages' 1GB website size limit), it's slow to load. Pages hang.

I want to improve that.

## `DOMContentLoaded`: `async`, no actually `defer`

Measuring my site speed on a local server using throttling in Chrome dev tools to try to replicate Cloudflare's slow serving.

- Start: **14.9s** on "Fast 3G" throttling

- &rarr; **5.41s**: Replacing big non-minified JS library with minified version

    - This won't actually have an effect once deployed, because Cloudflare is auto-minimizing my CSS and JS

- &rarr; **1.91s**: Making all scripts `async`

    - But now the page is broken because they have dependencies! E.g., one script has to depend on others to load first.

    - Can switch these to `defer`. This is very tempting. Then, the scripts run after the document is parsed, but before `DOMContentLoaded` is fired. This means that the page becomes interactive early---much before 5.41s---but the `DOMContentLoaded` time goes back up to 5.41s. This would mostly solve the problem, but it would make measuring speed more difficult, as then there would be no obvious number for when the page is ready. Furthermore, it seems that there are potentially problems w/ [Firefox not executing fully in-order](https://stackoverflow.com/questions/32413279/defer-scripts-and-execution-order-on-browsers), though this may be fixed, since [MDN says they will be](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-defer).

    - Tried `async` issues for now to see whether this is viable:

        - Bundled two libs together (leaflet and leaflet-curve)

        - Using `async` and `Promise`, set up a flow to check each of whether the DOM is ready, then whether the each library is loaded.

        - But then it turns out Stamen also depends on leaflet. Bundled that too.

At this point w/ async, there's still bugs with callbacks not being triggered. It could be that the `onload` even isn't what I want, and I need to listen to some other event (though I don't think `<script>` has others by default?) or make my own. Here's a snippet:

```js
async function makeDOMPromise() {
    return new Promise((resolve, reject) => {
        if (document.readyState == "loading") {
            console.log("This before DOM.")
            document.addEventListener("DOMContentLoaded", () => {
                console.log("DOM resolving");
                resolve();
            });
        } else {
            console.log("This after DOM.")
            resolve();
        }
    });
}

async function makeLibPromise(readyFn, scriptID, name) {
    return new Promise((resolve, reject) => {
        if (readyFn) {
            console.log("This before", name)
            document.getElementById(scriptID).onload = () => {
                console.log(name, "resolving)
                resolve();
            };
        } else {
            console.log("This after", name)
            resolve();
        }
    });
};

async function waitForLoaded() {
    await makeDOMPromise();
    await makeLibPromise(() => { typeof L === "undefined" }, "scriptLeaflet", "leaflet");
    await makeLibPromise(() => { typeof anime === "undefined" }, "scriptAnime", "anime");
    console.log("Done")
    main();
}

waitForLoaded();
```

I'll see orders like:

```txt
This after DOM.
This before leaflet
```

or

```txt
This after DOM.
This before leaflet
leaflet resolving
This before anime
```

In other words, even if we run before the script has setup the global variables we wan't, we don't see the `onload` event from at least one of the scripts. This bug _always_ happens if the developer console is closed, and _never_ happens if it's open and _Disable cache_ is checked.

Regardless, this is a massive effort overhead already if things could be resolved with `defer`, so I'm going to try that and just download Firefox to test that things do run. I did even see a [blog post](https://medium.com/@kvsushmapriyadharssini/loading-scripts-async-vs-defer-7cefc6488d45) which (if it's correct) says `defer` won't block HTML parsing the way `async` can.

## TTI (Time to Interactive), not `DOMContentLoaded`

I think TTI (Time to Interactive) might be a better metric to optimize for. After all I don't really care if my map scripts are running as long as the page is interactive. (And when they're `defer`'d, they'll run after the page is interactive but before `DOMContentLoaded` fires.)

I want to test out the effect of `defer`. Whether the page is better to use with it.

Annoyingly, this (TTI) seems to be kind of a heuristic metric made up by Chrome, and despite them [saying it's important to measure](https://web.dev/tti/), there doesn't seem to be any way to do it on your own. It's not reported on the Network tab, and there's no standard web event you can hook into to report it. You have to run Lighthouse. And Lighthouse doesn't adhere to the throttling setting in Network, it seems to run its own throttling I can't see how to configure. So I can't get a good sense of how `defer` vs not affects things locally. (Running on my local server, the TTI improves from 0.8 to 0.5 w/ `defer`).

I can kind of simulate this w/ my website in the wild because it's extremely slow to load here. (I don't know whether the slowness is Cloudflare in general, or because I'm in Taiwan.) I was worried that Cloudflare will start caching stuff and make successive runs artificially faster, but given the extreme variance in measurements I'm about to describe, this doesn't seem to be an issue.

Lighthouse says a page **without** `defer` had 20s TTI. Then, a different page **with** `defer` took 3s, 44s, and 15s on successive runs. The same page.

This is so wildly all over the place it's hard to get any kind of information from it. Fortunately, I can tell from my own browsing experience and other general things reported by Lighthouse that there are some low hanging fruit I should fix.

- [x] map image previews
- [x] vimeo hogging all the bandwidth
- [x] lazy load images

## Map Image Previews

I've done this before, I've just stopped making them because I'm lazy. The maps are at the top of the page, and since they have so many tiles to load, _and_ they don't start loading until the JavaScript is done running, they take a while. The top of the page is blank for a long time.

Did this, and it indeed really helps the immediate page view.

## Vimeo hogging all the bandwidth

This took some Googling and ChatGPT suggestions to figure out how to begin.

I still want the video to auto-play so it has a "moving picture" feel to it.

The main options I can see are:
1. Inject the Vimeo JS or `iframe` later on (e.g., w/ scroll detection)
2. Using `iframe` lazy loading [built into browsers](https://web.dev/iframe-lazy-loading/)

I'm shocked that `iframe` lazy loading exists. Lazy loading images has never worked for me, even though my pages are like perfect candidates for it. So, let's try this briefly before moving onto image lazy loading. After all, if this doesn't work, but I can solve it for images, maybe I can come back and solve it for this.

Unbelievably, amazingly, miraculously, this totally worked!

## Lazy load images

Ahh, my old nemesis. We meet again.

First, I want to understand something I've never understood: when you provide explicit `width` and `height` attributes on your `<img>` element, is this (a) a signal about the original size, or (b) an instruction about the rendered size?

Time to head to the old [Image layout test page](/garage/image-layout-test-page/).

I wrapped that up, and learned you can use CSS to override the sizes you provide. But I'm not sure they really help in that case.

Regardless, I did a whole exploration of lazy loading in the [Image lazy load test page](/garage/image-lazy-load-test-page), and with incredible success. We got the weight of the page from **99MB** down to **5MB**

I'm thrilled with this, and excited to push the change. This is yet another time that I'm glad I wrote wrappers to generate my image layouts, because now all my image collections will benefit from this speedup.

## Final step: `defer` and preview all the things

I am paying for two things I haven't refactored or automated: my map scripts are all separate (despite being nearly the same code), and I have to manually make the screenshot previews for each interactive map.

- [x] fix rogue `<img>` tags throughout the site (add `loading="lazy"` and `decoding="async"`)
    - also, consolidated some into house styles 😎
- [x] move included maps into folder
- [ ] `defer` all recent maps scripts (fix in source repo first)
    - [x] uk-vs-gb (sneaky one)
    - [ ] scotland roadtrip
    - [ ] london
    - [ ] serbia
    - [ ] bosnia
    - [ ] bosnia-extra
- [ ] add all missing placeholder images
    - [ ] bosnia
    - [ ] bosnia-extra
    - [ ] serbia
