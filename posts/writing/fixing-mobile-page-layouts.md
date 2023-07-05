---
title: Fixing Mobile Page Layouts
date: 2021-07-22
tags: design
image: /assets/posts/fixing-mobile-page-layouts/header.jpg
---

<style>
/* "ScreenShot" */
.sc {
  border-width: .125rem;
  border-style: solid;
  border-color: #565656;
}

.br5 {
  border-radius: 2rem;
}

/* This is the -ns (not small) media query (at least currently) */
@media screen and (min-width: 30em) {
  .br5-ns {
    border-radius: 2rem;
  }
}

.small {
  width: 300px;
}
</style>

<svg viewBox="0 0 1200 675" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="header-page" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <polygon id="Rectangle" fill-opacity="0.4" fill="#FFD700" transform="translate(600.000000, 184.000000) rotate(-270.000000) translate(-600.000000, -184.000000) " points="467.5 -416.5 732.5 -416.5 732.5 784.5 467.5 784.5"></polygon>
        <polygon id="Rectangle-Copy-2" fill-opacity="0.4" fill="#FF4136" transform="translate(549.500000, 227.000000) rotate(-270.000000) translate(-549.500000, -227.000000) " points="296 143 803 143 803 311 296 311"></polygon>
        <polygon id="Rectangle-Copy-2" fill-opacity="0.4" fill="#FF4136" transform="translate(285.500000, 198.000000) rotate(-270.000000) translate(-285.500000, -198.000000) " points="87 163 484 163 484 233 87 233"></polygon>
        <path class="phone" d="M479.907982,-118.053476 C496.159808,-118.053476 502.109331,-116.502711 508.065839,-113.317135 C513.71401,-110.29646 518.146728,-105.863743 521.167403,-100.215572 C524.352978,-94.2590639 525.903743,-88.3095411 525.903743,-72.0577145 L525.903743,-72.0577145 L525.903743,440.057715 C525.903743,456.309541 524.352978,462.259064 521.167403,468.215572 C518.146728,473.863743 513.71401,478.29646 508.065839,481.317135 C502.109331,484.502711 496.159808,486.053476 479.907982,486.053476 L479.907982,486.053476 L298.899505,486.053476 C284.553931,486.053476 278.214467,484.860913 272.83727,482.367516 C271.841166,481.892614 271.291663,481.611287 270.741648,481.317135 C265.096164,478.297898 260.664977,473.86796 257.644396,468.223633 C254.375493,461.970192 252.903743,455.918645 252.903743,440.057715 L252.903743,440.057715 L252.903743,-72.0577145 C252.903743,-87.0838596 254.224649,-93.3060142 256.946804,-98.865159 L257.176895,-99.3270608 C257.254675,-99.4806328 257.333538,-99.6338678 257.413485,-99.7869401 C260.664977,-105.86796 265.096164,-110.297898 270.741648,-113.317135 C271.291663,-113.611287 271.841166,-113.892614 272.398962,-114.160582 C278.214467,-116.860913 284.553931,-118.053476 298.899505,-118.053476 L298.899505,-118.053476 Z" id="phone-top" stroke="#5B5B5B" stroke-width="8" transform="translate(389.403743, 184.000000) rotate(-270.000000) translate(-389.403743, -184.000000) "></path>
        <polygon id="Rectangle" fill-opacity="0.4" fill="#FFD700" transform="translate(600.000000, 491.000000) rotate(-270.000000) translate(-600.000000, -491.000000) " points="467.5 -109 732.5 -109 732.5 1091 467.5 1091"></polygon>
        <path class="phone" d="M915.407982,188.946524 C931.659808,188.946524 937.609331,190.497289 943.565839,193.682865 C949.21401,196.70354 953.646728,201.136257 956.667403,206.784428 C959.852978,212.740936 961.403743,218.690459 961.403743,234.942285 L961.403743,234.942285 L961.403743,747.057715 C961.403743,763.309541 959.852978,769.259064 956.667403,775.215572 C953.646728,780.863743 949.21401,785.29646 943.565839,788.317135 C937.609331,791.502711 931.659808,793.053476 915.407982,793.053476 L915.407982,793.053476 L734.399505,793.053476 C720.053931,793.053476 713.714467,791.860913 708.33727,789.367516 C707.341166,788.892614 706.791663,788.611287 706.241648,788.317135 C700.596164,785.297898 696.164977,780.86796 693.144396,775.223633 C689.875493,768.970192 688.403743,762.918645 688.403743,747.057715 L688.403743,747.057715 L688.403743,234.942285 C688.403743,219.91614 689.724649,213.693986 692.446804,208.134841 L692.676895,207.672939 C692.754675,207.519367 692.833538,207.366132 692.913485,207.21306 C696.164977,201.13204 700.596164,196.702102 706.241648,193.682865 C706.791663,193.388713 707.341166,193.107386 707.898962,192.839418 C713.714467,190.139087 720.053931,188.946524 734.399505,188.946524 L734.399505,188.946524 Z" id="phone-bottom" stroke="#5B5B5B" stroke-width="8" transform="translate(824.903743, 491.000000) rotate(-270.000000) translate(-824.903743, -491.000000) "></path>
        <polygon id="Rectangle-Copy-2" fill-opacity="0.4" fill="#FF4136" transform="translate(985.000000, 491.000000) rotate(-270.000000) translate(-985.000000, -491.000000) " points="852.5 407 1117.5 407 1117.5 575 852.5 575"></polygon>
        <polygon id="Rectangle-Copy-2" fill-opacity="0.4" fill="#FF4136" transform="translate(721.000000, 491.000000) rotate(-270.000000) translate(-721.000000, -491.000000) " points="588.5 456 853.5 456 853.5 526 588.5 526"></polygon>
    </g>
</svg>

Some webpages are too damn hard to read on my phone, like this one:

<img src="/assets/posts/fixing-mobile-page-layouts/before-ios.jpg" class="sc small br5" loading="lazy" decoding="async" />

<p class="figcaption">Squint harder</p>

The font is tiny, the page is wide, and the text is wrapping at a weird place. I must read these on my phone like a PDF: scrolling in and panning along each line.[^reader]

[^reader]: In hindsight, Safari's _Reader View_ almost completely solves this (for web pages, not PDFs). So I should just use that more. But it does mess up content on some pages, which you won't know is happening while you're reading it, and, you know, \*waves hands\* fixing stuff is fun etc.

This post is my guide to fixing these issues. It's aimed at folks like me who aren't quite web developers, but blog or run small sites that could use a little fine-tuning.

### Contents

-   **How to Fix Common Problems** --- Four tricks I use to fix pages.

    1. [Set the Viewport](#viewport)
    2. [Scroll Over-Wide Elements](#over-wide)
    3. [Typographic Cleanup](#typography)
    4. [Test on Your Actual Phone](#phone)

-   **Walkthroughs** --- Tutorials of repairing pages.

    - [Git Best Practices](#gitbestpractices)
    - [Poisson's Equation](#poisson)
    - [F#](#fsharp)
    - [Hydroponic](#hydroponic)
    - [Diffusion Models](#diffusion)

> _**Disclaimer:** I'm not a web developer. I have no idea what I'm doing, really._

## How to Fix Common Problems

<a name="viewport"></a>

### 1. Set the Viewport

Does the page look like a desktop site zoomed way out? You might need to tell web browsers to render the web page at the actual device's width.[^actual] Add this HTML tag:

[^actual]: "Actual" device's width is already a simplification, because screens have pretend pixels (e.g., "oh hey, I'm 375 x 812") and actual pixels (e.g., "shh I'm actually 1125 x 2436 lol"). As usual, to read way more than you wanted to about this check out [Mozilla's docs on the viewport meta tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag).

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1"
>
```

In action, this makes the following change:

<div class="flex items-center">
<img src="/assets/posts/fixing-mobile-page-layouts/before-ios.jpg" class="sc w-40 bare br4 br5-ns" loading="lazy" decoding="async" />
<div class="mh2 mh3-ns" style="flex-grow: 1">
  <img src="/assets/posts/fixing-mobile-page-layouts/arrow.svg" class="w-100" loading="lazy" decoding="async" />
</div>
<img src="/assets/posts/fixing-mobile-page-layouts/1-meta.jpg" class="sc w-40 bare br4 br5-ns" loading="lazy" decoding="async" />
</div>

Now the text renders into a more reasonable area. This makes the font look bigger and the lines wrap much earlier. But the page still has a problem that's making the text only take up half the page. Something is too wide.

<a name="over-wide"></a>

### 2. Scroll Over-Wide Elements

Over-wide elements are easy to miss even from your phone, because your phone might mask them with a horizontal scroll bar. If you accidentally scroll right, though, you'll fly off the content.

<div class="flex">
<img src="/assets/posts/fixing-mobile-page-layouts/overwide-diagnose-1.jpg" class="sc bare mh2 br4 br5-ns flex-auto" loading="lazy" decoding="async" />
<img src="/assets/posts/fixing-mobile-page-layouts/overwide-diagnose-2.jpg" class="sc bare mh2 br4 br5-ns flex-auto" loading="lazy" decoding="async" />
</div>

<p class="figcaption">&rarr; Agh!</p>

Once you notice this happens, you can pinch to zoom out and survey the mess. Some element is probably too wide. Find the culprit.

<div class="flex">
<img src="/assets/posts/fixing-mobile-page-layouts/overwide2-before.jpg" class="sc bare mh2 br4 br5-ns flex-auto" loading="lazy" decoding="async" />
<img src="/assets/posts/fixing-mobile-page-layouts/overwide-before-annotated.jpg" class="sc bare mh2 br4 br5-ns flex-auto" loading="lazy" decoding="async" />
</div>

<p class="figcaption">Left: zoomed out. Right: the problem child.</p>

Ah ha. In this case, it's text in `<pre>` blocks. We can add some simple CSS to limit their width.

```css
pre {
    max-width: 100%;
    overflow-x: scroll;
}
```

This solves it. Here's the before and after.

<div class="flex items-center">
<img src="/assets/posts/fixing-mobile-page-layouts/overwide-before.jpg" class="sc w-40 bare br4 br5-ns" loading="lazy" decoding="async" />
<div class="mh2 mh3-ns" style="flex-grow: 1">
  <img src="/assets/posts/fixing-mobile-page-layouts/arrow.svg" class="w-100" loading="lazy" decoding="async" />
</div>
<img src="/assets/posts/fixing-mobile-page-layouts/overwide-after.jpg" class="sc w-40 bare br4 br5-ns" loading="lazy" decoding="async" />
</div>

No more scroll bar, and the width is correct. This section is a bit weird because of overly wide indentation. Here's the same result on body text.

<div class="flex items-center">
<img src="/assets/posts/fixing-mobile-page-layouts/overwide2-before.jpg" class="sc w-40 bare br4 br5-ns" loading="lazy" decoding="async" />
<div class="mh2 mh3-ns" style="flex-grow: 1">
  <img src="/assets/posts/fixing-mobile-page-layouts/arrow.svg" class="w-100" loading="lazy" decoding="async" />
</div>
<img src="/assets/posts/fixing-mobile-page-layouts/overwide2-after.jpg" class="sc w-40 bare br4 br5-ns" loading="lazy" decoding="async" />
</div>


#### What About Bigger Screens?

This article is only about making pages look better on mobile. I try not to _break_ anything for larger screens, but naively applying some of these changes will make desktop layouts more cramped.

<img src="/assets/posts/fixing-mobile-page-layouts/device-diagram.svg" class="w-100" loading="lazy" decoding="async" />

<p class="figcaption">
  <span class="b">Left:</span>
  For mobile devices, everything must adhere to the body width to avoid making the page scroll horizontally; individual wide elements can scroll on their own.

  <span class="b">Center:</span>
  For larger screens, we can keep the same strategy as with mobile displays and clip everything to the body region, but wide elements will still need to scroll.

  <span class="b">Right:</span>
  If we instead let wide elements spill outside the body area when there is room on larger displays, they won't need to be scrolled.
</p>

When there's more screen space, it probably makes sense to let larger elements take up more room rather than clipping them and making them scroll horizontally. Consider housing wide content in containers that can break out from the body text.

<a name="typography"></a>

### 3. Typographic Cleanup

There are a few bits of low hanging fruit that will make a page go from functional to comfortably readable. (Don't worry, I'm not going to make the text <span class="black-30">annoyingly light gray</span> or anything.)

1. **Margins.** Content should have a bit of breathing room, but not waste real estate.

2. **Font size.** Text be readable without squinting, but not so big to cause short line lengths.

3. **Line height.** Picking around `1.5` is a standard typography trick for body text and helps with readability.

We can apply all these changes to our running example.

<div class="flex items-center">
<img src="/assets/posts/fixing-mobile-page-layouts/4-body.jpg" class="sc w-40 bare br4 br5-ns" loading="lazy" decoding="async" />
<div class="mh2 mh3-ns" style="flex-grow: 1">
  <img src="/assets/posts/fixing-mobile-page-layouts/arrow.svg" class="w-100" loading="lazy" decoding="async" />
</div>
<img src="/assets/posts/fixing-mobile-page-layouts/5-done.jpg" class="sc w-40 bare br4 br5-ns" loading="lazy" decoding="async" />
</div>

<a name="phone"></a>

### 4. Test on Your Actual Phone

This last trick is the most important and also the easiest to skip. Believe me, I forget to do it, too. But there's no getting around it.[^visitors]

[^visitors]: I was in vague denial that everyone who visited my website would be on a desktop. Then I added some basic analytics. Nope, mostly phones.

Yes, test it using your browser's _pretend I'm a phone_ mode first. But to this day, I've never made a page where I didn't find something to change when I actually looked at it on my phone. It's easier to recognize bad proportions on the physical device you glue to your poor eyeballs all day.

Furthermore, sometimes the browser simulators are just plain wrong. In fact, our running example is exactly one such case. I describe this more in the [walkthrough below](#gitbestpractices).

## Walkthroughs

Click on any picture to jump to the walkthrough for fixing the mobile layout on that page.

<div class="flex items-center flex-wrap">

  <div class="w-third w-25-ns tc ph1 ph2-ns mb1 mb2-ns">
    <a href="#gitbestpractices">
      <img src="/assets/posts/fixing-mobile-page-layouts/before-ios.jpg" class="sc br3 br4-ns dim" loading="lazy" decoding="async" />
    </a>
  </div>

  <div class="w-third w-25-ns tc ph1 ph2-ns mb1 mb2-ns">
    <a href="#poisson">
      <img src="/assets/posts/fixing-mobile-page-layouts/poisson-start-out.png" class="sc br3 br4-ns dim" loading="lazy" decoding="async" />
    </a>
  </div>

  <div class="w-third w-25-ns tc ph1 ph2-ns mb1 mb2-ns">
    <a href="#fsharp">
      <img src="/assets/posts/fixing-mobile-page-layouts/f-sharp-orig.jpg" class="sc br3 br4-ns dim" loading="lazy" decoding="async" />
    </a>
  </div>

  <div class="w-third w-25-ns tc ph1 ph2-ns mb1 mb2-ns">
    <a href="#hydroponic">
      <img src="/assets/posts/fixing-mobile-page-layouts/hydroponic-start.jpg" class="sc br3 br4-ns dim" loading="lazy" decoding="async" />
    </a>
  </div>

  <div class="w-third w-25-ns tc ph1 ph2-ns mb1 mb2-ns">
    <a href="#diffusion">
      <img src="/assets/posts/fixing-mobile-page-layouts/diffusion-start.jpg" class="sc br3 br4-ns dim" loading="lazy" decoding="async" />
    </a>
  </div>


</div>

> _**Disclaimer:** I'm nitpicking microscopic **stylistic** issues on these ages for the sake of illustration. Their actual **content** is largely fascinating, technical, and well-written. I humbly offer these example fixes because I like what the authors are doing and would like to enjoy it even more on my phone._


<a name="gitbestpractices"></a>

## Git Best Practices

This is the site that I used as the running example for the first section. This page is called [Commit Often, Perfect Later, Publish Once: Git Best Practices](https://sethrobertson.github.io/GitBestPractices/). The page looks like this on my phone:

<img src="/assets/posts/fixing-mobile-page-layouts/before-ios.jpg" class="sc small br5" loading="lazy" decoding="async" />

Now, I can't be too hard on the designer.[^designer] First, the page is from 2012---ancient Internet history.

[^designer]: I was writing "author" until I realized, oh yeah, this is a design issue, and, like it or not, self-publishing on the web a designer of us all makes.

Second, it's actually kind of hard to tell this was going to happen. Normally, I would guess that they simply didn't test it using developer tools. But if you ask Chrome and Safari what the page should look like on an iPhone X, they both say, "just fine:"

<div class="flex">
<img src="/assets/posts/fixing-mobile-page-layouts/before-chrome.jpg" class="pr2 pr3-ns flex-auto" loading="lazy" decoding="async" />
<img src="/assets/posts/fixing-mobile-page-layouts/before-safari.jpg" class="flex-auto" loading="lazy" decoding="async" />
</div>

This is annoying, because it means we have to debug on the phone itself. No problem, just download the page, whip up a `python -m http.server`, find the laptop's local IP address with `ifconfig | grep 192`, and point the ol' telephone to `192.168.0.xxx:8000`. We're in.

#### Fixing it

These fixes are exactly the ones I describe in detail in the first section, so I'll run through them quickly.

First, we adjust the viewport ([fix #1](#viewport)).

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1"
>
```

Then, we stop `<pre>`-formatted blocks from stretching out the page width ([fix #2](#over-wide)).

```css
pre {
    max-width: 100%;
    overflow-x: scroll;
}
```

For the final tweaks ([fix #3](#typography)), we apply:

1. **Narrower margins.** We don't need _that_ much of a buffer on our phones. I'll take it from `3em` &rarr; `1em`.[^screen]

2. **Bigger font size.** It's just in the squint-y range for me. `16px` &rarr; `18px`.

3. **Taller line height.** The usual `normal` &rarr; `1.5`.

[^screen]: Keep in mind for a real project we'd probably have the measurements change based on the screen size using CSS media queries.

Apply them all, here's the before/after.

<div class="flex items-center">
<img src="/assets/posts/fixing-mobile-page-layouts/before-ios.jpg" class="sc w-40 bare br4 br5-ns" loading="lazy" decoding="async" />
<div class="mh2 mh3-ns" style="flex-grow: 1">
  <img src="/assets/posts/fixing-mobile-page-layouts/arrow.svg" class="w-100" loading="lazy" decoding="async" />
</div>
<img src="/assets/posts/fixing-mobile-page-layouts/5-done.jpg" class="sc w-40 bare br4 br5-ns" loading="lazy" decoding="async" />
</div>

Hooray, super readable!

### Extra credit: typography

If we wanted to, one last thing I'd tweak is the indentation, which is so comically large as to end up taking up nearly half the screen width (really only glaring on an actual phone, AKA ([fix #4](#phone)):

<img src="/assets/posts/fixing-mobile-page-layouts/6-extra-credit.jpg" class="sc small br5" loading="lazy" decoding="async" />

... but eh, I'd say we've done enough for one evening. Let's call it an exercise for the reader.

<a name="poisson"></a>

## Poisson's Equation

This page is called [Poisson's Equation is the Most Powerful Tool not yet in your Toolbox](https://mattferraro.dev/posts/poissons-equation). The page's viewport seems good, but you can accidentally scroll to the right, revealing a bigger page and likely overly wide elements ([fix #2](#over-wide)).

<div class="flex">
<img src="/assets/posts/fixing-mobile-page-layouts/poisson-start.png" class="sc bare mh2 br4 br5-ns flex-auto" loading="lazy" decoding="async" />
<img src="/assets/posts/fixing-mobile-page-layouts/poisson-start-out.png" class="sc bare mh2 br4 br5-ns flex-auto" loading="lazy" decoding="async" />
</div>

<p class="figcaption">Left: the default view on pageload. Right: Zooming out to the page's true width after noticing horizontal scrollbars.</p>


If we scroll down, we can see the worst offenders are, again, over-wide `<pre>` regions for code. They are already the correct width, but when their content overflows, it spills out.

<div class="flex">
<img src="/assets/posts/fixing-mobile-page-layouts/poisson-overwide.jpg" class="sc bare mh2 br4 br5-ns flex-auto" loading="lazy" decoding="async" />
<img src="/assets/posts/fixing-mobile-page-layouts/poisson-pre-box.jpg" class="sc bare mh2 br4 br5-ns flex-auto" loading="lazy" decoding="async" />
</div>


We can fix these,

```css
pre {
    overflow-x: scroll;
}
```

... but rendered math is still an issue. Like the `<pre>` chunks, they're also set to a good width, but spill out.

<div class="flex">
<img src="/assets/posts/fixing-mobile-page-layouts/poisson-pre-done-annotated.jpg" class="sc bare mh2 br4 br5-ns w-50 flex-auto" loading="lazy" decoding="async" />
<img src="/assets/posts/fixing-mobile-page-layouts/poisson-math-box.jpg" class="sc bare mh2 br4 br5-ns w-50 flex-auto" loading="lazy" decoding="async" />
</div>

The math chunks are all in `<div>`s with the CSS class `math`, so we can just add another selector to our rule:

```css
pre, .math {
    overflow-x: scroll;
}
```

And with that, we've tamed the over-wide elements and the page displays nicely.

<img src="/assets/posts/fixing-mobile-page-layouts/poisson-fixed.png" class="sc small br5" loading="lazy" decoding="async" />

### Extra credit: code and scrollbars

If I were to add finishing touches, the two things I'd tweak would be the code and math.

The font size for code blocks is bigger than it needs to be ([fix #3](#typography)) and lacks syntax highlighting. If we make those two changes and then reduce the indentation from four to two spaces, we can even fit all the code without any scrolling---we just need to wrap two of the comments.

<div class="flex items-center">
<img src="/assets/posts/fixing-mobile-page-layouts/poisson-extra-code.jpg" class="sc w-40 bare br4 br5-ns" loading="lazy" decoding="async" />
<div class="mh2 mh3-ns" style="flex-grow: 1">
  <img src="/assets/posts/fixing-mobile-page-layouts/arrow.svg" class="w-100" loading="lazy" decoding="async" />
</div>
<img src="/assets/posts/fixing-mobile-page-layouts/poisson-extra-code-fixed.jpg" class="sc w-40 bare br4 br5-ns" loading="lazy" decoding="async" />
</div>

> _Aside: This was another place where it was instrumental to check on my physical phone ([fix #4](#phone)). Only there did I notice the code font was so large, and only there could I verify that it was still readable after reducing the font size._

The second aspect I'd improve is the math display---or more generally, the remaining elements that are have their own horizontal scroll bars because of their width.

When possible, it's nice to have your content fit inside the display so people don't have to scroll horizontally to see it. But it's not always worth the effort to make that happen. I think typeset math is one of those occasions. It's enough work just to make LaTeX display your math nicely, let alone making a version that fits on portrait-sized mobile screen.

But when we _do_ have content that needs scrolling, I think it's good to _show_ people that scrolling is available. In other words, to show them when an element has the scrolling **affordance**. Showing content that's cut off is a hint, but this isn't reliable unless calculated explicitly, as the content might be cut off in a way that doesn't reveal there's more to see.

As I mentioned above, Apple's browser seems to go out of its way to hide scroll bars. Even when they appear because you accidentally found something scrollable, they vanish a bit later. Can we make sure that our extra wide content has scroll bars them?

In short, I couldn't robustly figure this out. Using the `::-webkit-scrollbar` CSS selector, I could get really big chonky ones to always appear on Chrome, but not using Safari on my phone. [Mozilla says this feature isn't standardized yet](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar), but that it should work on Safari and all iOS browsers 🤷‍♂️

<div class="flex">
<img src="/assets/posts/fixing-mobile-page-layouts/poisson-want-scrollbars.jpg" class="sc bare mh2 br4 br5-ns w-50 flex-auto" loading="lazy" decoding="async" />
<img src="/assets/posts/fixing-mobile-page-layouts/poisson-big-scrollbars.png" class="sc bare mh2 br4 br5-ns w-50 flex-auto" loading="lazy" decoding="async" />
</div>

<p class="figcaption">Left: no scrollbars still on my phone. Right: I could get big ugly ones on Chrome on my desktop.</p>

<a name="fsharp"></a>

## F#

This page is called [F# Is The Best Coding Language Today](https://danielbmarkham.com/fsharp-is-the-best-programming-language-today/). Once again, a good viewport, but an over-wide `<pre>` code block. Jeez, what is it with these code blocks?

<div class="flex">
<img src="/assets/posts/fixing-mobile-page-layouts/f-sharp-orig.jpg" class="sc bare mh2 br4 br5-ns w-50 flex-auto" loading="lazy" decoding="async" />
<img src="/assets/posts/fixing-mobile-page-layouts/f-sharp-orig-code.jpg" class="sc bare mh2 br4 br5-ns w-50 flex-auto" loading="lazy" decoding="async" />
</div>

<p class="figcaption">Left: After loading the page, noticing it's got a horizontal scroll bar, and zooming out. Right: The culprit code block.</p>

Two oddities with this one:

1. Not only is the code overly wide, but the left part is also cut off and can't be revealed. Not sure how that one happened.

2. The page becomes a broken, un-styled mess when I download it to make tweaks. I'm guessing it's blocking some CSS from being loaded.

Because of 2., I only made minimal tweaks in the browser's developer tools to fix things ([fix #2](#over-wide)).

```css
/* Attached these to the <figure> element,
   the literal root of figurative evil. */
max-width: 100%;
/* Once again, you'd want to tweak font
   sizes for desktop vs mobile. */
font-size: 14px;
```

<div class="flex">
<img src="/assets/posts/fixing-mobile-page-layouts/f-sharp-fixed.png" class="sc bare mh2 br4 br5-ns w-50 flex-auto" loading="lazy" decoding="async" />
<img src="/assets/posts/fixing-mobile-page-layouts/f-sharp-fixed-code.png" class="sc bare mh2 br4 br5-ns w-50 flex-auto" loading="lazy" decoding="async" />
</div>

<p class="figcaption">Fixed view of the top of the page (left), and the code block (right).</p>


This fixes the page and makes the code readable. Hooray!

### Extra credit

Nothing else major here, but I would wrap the comments in the code earlier so we could get rid of horizontal scrolling entirely. The URL, which would be hard to wrap, could simply be moved outside of the code.

<a name="hydroponic"></a>

## Hydroponic

This page is called [Automated Hydroponic System Build](https://kylegabriel.com/projects/2020/06/automated-hydroponic-system-build.html). In a crazy turn of events, 🚨 _it's not code in a `<pre>` block this time!_ 🚨 This page actually contains pretty huge chunks of code, but they all obey the body width. What's the issue, then?

<div class="flex">
<img src="/assets/posts/fixing-mobile-page-layouts/hydroponic-start.jpg" class="sc bare mh2 br4 br5-ns w-50 flex-auto" loading="lazy" decoding="async" />
<img src="/assets/posts/fixing-mobile-page-layouts/hydroponic-problem.jpg" class="sc bare mh2 br4 br5-ns w-50 flex-auto" loading="lazy" decoding="async" />
</div>

An overly long URL, yeeted into the comments by none other than the author himself. Bummer.

In fact, there's a different comment from another person that includes a URL that would also stretch the page ([fix #2](#over-wide)). This means that any commenter can break the mobile page layout 😱

I checked out the source, and saw each comment has `class="comment-body"`. So if we simply add the CSS:

```css
.comment-body {
    overflow-wrap: break-word
}
```

... then everything is groovy.

<div class="flex">
<img src="/assets/posts/fixing-mobile-page-layouts/hydroponic-start-fixed.jpg" class="sc bare mh2 br4 br5-ns w-50 flex-auto" loading="lazy" decoding="async" />
<img src="/assets/posts/fixing-mobile-page-layouts/hydroponic-problem-fixed.jpg" class="sc bare mh2 br4 br5-ns w-50 flex-auto" loading="lazy" decoding="async" />
</div>

<a name="diffusion"></a>

## Diffusion Models

This page is called [What are Diffusion Models?](https://lilianweng.github.io/lil-log/2021/07/11/diffusion-models.html) This time, it's pesky math again, stretching a good viewport too wide.

<div class="flex">
<img src="/assets/posts/fixing-mobile-page-layouts/diffusion-start.jpg" class="sc bare mh2 br4 br5-ns w-50 flex-auto" loading="lazy" decoding="async" />
<img src="/assets/posts/fixing-mobile-page-layouts/diffusion-problem.jpg" class="sc bare mh2 br4 br5-ns w-50 flex-auto" loading="lazy" decoding="async" />
</div>

We can tell MathJax to stay in its lane ([fix #2](#over-wide)) by adding the CSS:

```css
.MathJax_Display {
    overflow-x: scroll;
}
```

... and the page is back in its box.

<div class="flex">
<img src="/assets/posts/fixing-mobile-page-layouts/diffusion-start-fixed.jpg" class="sc bare mh2 br4 br5-ns w-50 flex-auto" loading="lazy" decoding="async" />
<img src="/assets/posts/fixing-mobile-page-layouts/diffusion-problem-fixed.jpg" class="sc bare mh2 br4 br5-ns w-50 flex-auto" loading="lazy" decoding="async" />
</div>

<script src="/assets/lib/anime-3.2.1.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        // cover
        anime({
            targets: '#header-page *',
            // transform: ["translate(-3,0)", "translate(3,0)"],
            // translateX: [-3, 3],
            // translateY: [-1, 2],
            opacity: [0, 1],
            easing: 'easeInOutSine',
            // endDelay: 1000,
            duration: 750,
            delay: anime.stagger(150),
            // loop: true,
            // direction: "alternate",
        });
    });
</script>
