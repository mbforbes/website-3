---
title: Does k-means on an image's colors make a good palette?
date: 2021-08-22
image: /assets/garage/k-means-colors/example.hsv.palette-1-36.png
---

I was trying to come up with a color palette for an illustration, and I came across this image:

![bird flying with associated color palette]({{ "/assets/garage/k-means-colors/inspiration.jpg" | url }})

<p class="figcaption">
<a href="https://www.printmag.com/post/50-best-color-sites-graphic-designers">
source
</a>
</p>

For whatever reason, this made me wonder: how do people extract color palettes from images? Can we do this automatically?

Could it perhaps be that, if we simply run k-means on the RGB colors of each pixel, we'll recover the palette?

Rather than Google for the answer, I was struck by a desire to rekindle my [spirit of discovery]({{ "/garage/spirit-of-discovery/" | url }}) and find out for myself.

## k-means, RGB

Running k-means on the RGB colors of the image with `k = 7`, I came up with:

![7-color palette]({{ "/assets/garage/k-means-colors/example.rgb.palette-7.png" | url }})

<p class="figcaption">k-means on RGB pixels, <code>k = 7</code></p>

Hmm, definitely missing some of the colors we'd like, at least a red and a green.

I tried with different values of `k`. Here's 1 through 12:

![7-color palette]({{ "/assets/garage/k-means-colors/example.rgb.palette-1-12.png" | url }})

<p class="figcaption">k-means on RGB pixels, <code>k ∈ {1 ... 12}</code></p>

The k-means implementation I'm using is pretty stable (I think the initialization may use a deterministic heuristic). We can notice that by:

- `k = 7`, we get a nicer blue
- `k = 8`, the yellow/green splits into lighter and darker greens
- `k = 10`, we finally get a red

> Aside: I sorted the colors in the display of these palettes using HSV so they're easier to compare. It turns out [sorting colors is challenging](https://www.alanzucconi.com/2015/09/30/colour-sorting/) in its own right! You can already tell this by the inconsistencies in ordering the darker greens (bottom three) and grays (throughout).

So the answer seems to be: no, it's not quite as simple as running k-means on the RGB colors. My hunch is that RGB is a bad way of featurizing the colors. My guess is that what we are looking for in a palette---distinct, strong colors---is not reflected in perceptual RGB distances.

## k-means, HSV

Just as I finished writing the above, and was considering Googling how people do this, I realized I'd missed a totally obvious connection.

I had run k-means on the pixels in RGB color space. But I had then sorted the output palette using a different color space: HSV. What if we ran k-means on the pixels in HSV?

![]({{ "/assets/garage/k-means-colors/reference.palette.jpg" | url }})
![]({{ "/assets/garage/k-means-colors/example.rgb.palette-7.png" | url }})
![]({{ "/assets/garage/k-means-colors/example.hsv.palette-7.png" | url }})

<p class="figcaption" markdown="1">
<span class="b">Top:</span>
reference.
<span class="b">Middle:</span>
RGB k-means.
<span class="b">Bottom:</span>
HSV k-means.
</p>

HSV shows minor changes from RGB: just the first three colors.

Here's k-means on HSV for several `k` values:

![]({{ "/assets/garage/k-means-colors/example.hsv.palette-1-12.png" | url }})

<p class="figcaption">k-means on HSV pixels, <code>k ∈ {1 ... 12}</code></p>

Very interesting! We see a brighter green than ever appears in the RGB clusters, but only for `k ∈ {3, 4}`. A second blue appears for `k = 12`. And, no red so far.

Just for fun, I tried running it up to `k = 36` to see what would happen.

![]({{ "/assets/garage/k-means-colors/example.hsv.palette-1-36.png" | url }})

<p class="figcaption">k-means on HSV pixels, <code>k ∈ {1 ... 36}</code></p>

Looks like red was just around the corner. It's a shame we never get that brilliant green back. I still think we can do better than this, but cranking `k` way up like this would reveal one computer/human hybrid approach: the computer over-generates a large palette, then the human samples from it to make a smaller one.

## Wrapping up

I've got to stop working on this now and get back to my other [summer goals]({{ "/garage/summer-2021-website-goals/" | url }}). If you're curious, here's my code:

{% include "programming-language-tooltips.njk" %}
{% set item = collections.software | selectAttrEquals(["data", "title"], "k-means-colors") | first %}
{% include "software-long.njk" %}

As a final thought, I was wondering whether different color spaces are linear transformations of each other, and whether k-means or the algorithm I'm using is agnostic to linear transformations. Keeping the spirit of flying fast and loose, I haven't looked either up, but if I were to keep going, these facts would inform what approach I take next. I wonder whether there is a color embedding that would make k-means find perceptually good color palettes?
