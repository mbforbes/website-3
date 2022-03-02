---
title: Animating SVGs from Sketch with anime.js
date: 2021-07-31
---

Animating SVGs is great, it makes [posts more lively]({{ "/posts/every-phd-is-different/" | url }}).

Animating SVGs, at least in the pipeline I'm using (Sketch and anime.js), is also stupidly difficult for obscure reasons. I am going to try to document and improve my process.[^ppl]

[^ppl]: This is one of those notes that will probably be relevant to a maximum of three other people, ever, on planet earth. But if any one of those people is just starting down this path and running into these problems, I hope this saves you a massive amount of the confusion that I slogged through.

**Contents**
1. [Exporting from Sketch](#sketch)
2. [Embedding SVG files](#embedding)
3. [Animating with anime.js](#animating)

<a name="sketch"></a>

## Exporting from Sketch

There are two main problems.

### 1. Mitigating `transform`s

Many SVG elements are positioned using `transform` attributes.

As far as I can tell, the animation library (anime.js) cannot apply _relative_ mutations to the `transform` attribute of SVGs. In plain language, this means you can't move stuff around. That's a big problem because moving stuff around is kind of the essence of animating.

To make this work, you need to be able to produce SVG elements without any `transform` attribute. That way, anime.js can apply _absolute_ changes via the `transform` attribute.

~~There are good things about Sketch's SVG export. For example, if you name layers, it keeps these names as SVG `id` attributes in the export. This lets you select them with your animation library and move them. Yay.~~

> **Update 10/18/21:** This appears to be gone or broken now, too. The latest SVG I exported from Sketch didn't output any `id`s for groups I named.

The bad thing about Sketch's SVG export is that you lack control over how things get exported. So there are `transform`s on all sorts of stuff, making a bunch of stuff unusable for animation.

The good news is that Sketch supports plugins, and there is an [SVG plugin](https://github.com/sketch-hq/svgo-compressor) that claims to give you control over these issues with features like:

- `moveGroupAttrsToElems` --- "Moves group attrs to the content elements."
- `convertPathData` --- "Optimizes path data: writes in shorter form, applies transformations."

The bad news is, while the plugin appears to do some things, neither of those features actually work. After applying `moveGroupAttrsToElems`, all groups (`<g>`) still have `transform` (and many other) attributes on them. Similarly, after applying `convertPathData`, some paths (`<path>`) still have `transform` attributes on them.

I opened an issue for [the first problem](https://github.com/sketch-hq/svgo-compressor/issues/79), but as there are unresolved issues on that repository that are five years old---including a [very similar report](https://github.com/sketch-hq/svgo-compressor/issues/20) to my own that's been closed and still broken for three years---I am not optimistic.[^oss]

[^oss]: For those wondering about the failings of open source, this is it: software that _nearly_ works but has fallen out of maintenance.)

**My current workaround is:** because, after running the plugin, _most_ groups have `transform`s on them, but _most_ children (like paths) contained in the groups don't, I use anime.js to select all _children_ of a group, using a selector like `#group-id *`. Then, I add `transform` animations to the children directly, which give them relative motion.

### 2. Converting text to shapes

Not everyone has the same fonts installed. Text in SVG, by default, simply contains the font that's supposed to be used, and the text to render. If someone doesn't have the font you want installed, text will not display properly.

Sketch has a way to convert text to outlines. This is a destructive process; once you do it, you can no longer edit the text or any of its properties (like typeface, size, weight). Obviously, this makes iterating unpleasant.

Sketch lacks any SVG export option to automatically convert text to shapes. This is a bummer. (It was [suggested](https://sketchtalk.io/discussion/3654/automatically-convert-text-to-outlines-on-export) three years ago into the pointless void of product forums.)

One [workaround](https://www.reddit.com/r/sketchapp/comments/csn0rs/converting_text_to_outlines_on_svg_export/exm71et/) I've seen is to "intersect" all text with a box of the same color as the text. As far as I can tell, this must be done separately per text color, and text must either be grouped first (or each text won't mutually intersect and become blank) or intersected with a separate box. Doing this makes the text export as paths, but can still be edited by selecting the layer.

Unfortunately, the workaround, at least as I've implemented it, is not only tedious, but pollutes the sketch with these background objects that make selecting both the text and other content quite difficult.

**My current workaround is:** to wait until my _final_ draft, and convert all text to outlines then. I am also trying to start keeping little samples of non-converted text around outside the arboard area so that I know what it was in case I need to make more edits down the road.


<a name="embedding"></a>

## Embedding SVG files

~~As far as I can tell, you cannot animate an SVG file with anime.js if it's not literally dumped inside the source HTML page.~~ This was the approach I took for the diagrams I'd made so far. Today, I finally went down the full rabbit hole to solve this issue.

You cannot do `<img src="picture.svg" />`. The image will be rendered, but the DOM won't have all the SVG nodes, so they can't be selected by the animation library. This one is obvious.

You can do `<object data="picture.svg"></object>`, but it requires two workarounds.[^crazy]

The crux of the issue is that contents of the SVG will be inserted, but anime.js won't be able to find the SVG nodes with its element selectors. This is because the SVG is actually inside a new `document` within the `<object>` node.

The first workaround you must do is to get the `document` inside the `<object>` element, and explicitly query your nodes.

For example, if we have the object

```html
<object id="my-diagram" type="image/svg+xml" data="picture.svg"></object>
```

... then we can get the document that gets loaded inside it with

```js
document.getElementById('my-diagram').contentDocument
```

However, if you do this immediately, or even after the `DOMContentLoaded` event fires, you will be successfully given an empty `document`. Bummer. The contents haven't loaded yet.

So, instead, you can wait for it to load (thanks, as usual, to [a StackOverflow answer](https://stackoverflow.com/a/27808044/3838962)):

```js
document.getElementById('my-diagram').addEventListener("load", function() {
    const innerDoc = document.getElementById('my-diagram').contentDocument;
};
```

<p class="figcaption">I probably could have shortened this by relearning how <code>this</code> works.</p>

Then, using that `innerDoc`, you can write your own query selector to send to anime.js:

```js
// continuing the above, inside the anonymous function
anime({
    targets: innerDoc.querySelectorAll("#fun-group *"),
    translateX: 10,
    ...
});
```

This _still_ doesn't work. This is quite bizarre, because you can verify with Chrome's developer tools that `innerDoc.querySelectorAll("#fun-group *")` does return a `NodeList` (well, if you have matching stuff in your SVG). And, if you run the same thing on an `<svg>` directly inside the page, it works.

And, so we are on to our second quandary: how to tell anime.js about these foreign document nodes we've been able to successfully query?

First, we enter a debugging process you can skip over.

> Aside: Debugging anime.js
>
> - the `targets` appear saved correctly (as `animatables`), but the list of `animations` is empty (in `createNewInstance()`)
> - `getAnimationType()` matches no `if` statement (and so returns `undefined`)
>   - however, `el` is a `NodeList`, but it looks like the code is expecting it to be a single element
>   - this makes me think that maybe the code that array-ifies the passed values is broken; the `NodeList` is passing its checks, but it shouldn't be, because it's not being unpacked correctly for later.
> - `toArray()` checks `o instanceof NodeList`, which fails, even though Chrome's debugger says its a `NodeList`. So I wonder if the issue is that it's a "foreign" `NodeList` because it's from a different DOM? Anyway, when this check fails, `toArray()` returns `[o]`, which means we now have `[NodeList]`---in other words, an array of length 1 containing a NodeList. That seems to be wrong.
> - oooh, I totally mised it then---`animatables` above in `createNewInstance()` was actually an `[NodeList]` (array with the `NodeList` as a single element). Or maybe I saw this and assumed it was OK because `animatables` is plural and I thought maybe there could have been multiple selectors? Either way.
> - I think the root of this might be the `o instanceof NodeList` check. I might try to experiment with this using the raw selection.
> - Yeah, right when I get the elements, `els instanceof NodeList` fails. I suspect fundamentally solving this might require next-level DOM wizardry. Instead, the workaround in the [issue](https://github.com/juliangarnier/anime/issues/548) I came across works: sending in the `NodeList` by spreading it first with `[...els]`.

The tl;dr: is that anime.js has a bug where it can't identify the foreign `NodeList` as a `NodeList`, so it wraps it in an array, which screws up the later steps, so no animations end up being made.

Enter the second workaround, given by the [GitHub issue](https://github.com/juliangarnier/anime/issues/548) that sent me further down this hole: repackaging the `NodeList` as an array, simply by spreading it out.

In other words:

```js
const nodeList = innerDoc.querySelectorAll("#fun-group *");
anime({
    // targets: nodeList, // this is what we were doing
    targets: [...nodeList], // this is what works
    translateX: 10,
    ...
});
```

Putting this all together:

```js
// IDK whether this outer event listener is necessary, but I don't think
// it can hurt (famous last words).
document.addEventListener('DOMContentLoaded', function () {
    // Wait for the SVG contents to load
    document.getElementById('my-diagram').addEventListener("load", function() {
        // Grab the inner document
        const innerDoc = document.getElementById('my-diagram').contentDocument;
        anime({
            // Query the inner doc for the nodes, and repackage them
            // as a vanilla array.
            targets: [...innerDoc.querySelectorAll("#fun-group *")],
            translateX: 10,
            ...
        });
    });
});
```

[^crazy]: As an aside, I don't understand how these problems aren't trivially solved. Why is what I'm doing a corner case? I would think that if you wanted to make animations online, the simplest content to use would be SVG. Rather than positioning everything by hand with HTML `<div>`s or something, you can use graphical software to draw diagrams and export them as SVG. Plus, SVG is native browser tech, and it's vectorized so it renders nicely at different scales. Sketch is super mainstream vector software. As far as I can tell, besides a couple CSS libraries with gaudy effects, anime.js is a mainstream animation library. I'm not even tied to Sketch or anime.js, they just seem like obvious default choices for "how to make a simple animation on your website." So, why is getting the pipeline working so hard?!?


**In summary, my current workarounds are:** (1) wait for the `<object>` to load and get the nodes we want to animate ourselves, (2) unpack them to a vanilla array before sending into anime.js.

<a name="animating"></a>

## Animating with anime.js

I've run into two main issues.

### 1. Cannot apply relative changes to `transform`s

As I mentioned above to motivate trying to clean up Sketch's SVG exports, I do not think anime.js can apply relative changes to `transform` attributes.

anime.js can:

1. Apply relative changes to scalars using strings like `+=10`, `-=10`, and `*=10`.
2. Apply full overwrites of SVG `transform` attributes by:

    1. Overwriting the `transform` attribute directly by mutating its values

    2. Implicitly overwriting the `transform` attribute by adding a `style="transform: translateX(...) translateY(...);"`. This will then be applied _instead_ of the `transform` attribute (rather than composing them).

Unfortunately, I don't think there is a way of combining points 1 and 2: using relative changes to mutate `transform` values.

**My current workaround is:** to attempt to avoid this by trying to get SVG to output things that I want to animate that don't have `transform` attributes at all. That way I can use point 2 above to apply fresh `transform`s to move them relative to where they start.

### 2. Cannot easily compose motion

This may be a limitation of my own understanding. The main feature presented by anime.js for complex motion is a timeline. This works for _sequential_ motion. But I do not know how to accomplish _concurrent_ motion.

By _concurrent_ motion, I simply mean: imagine that you want a circle to do two things at the same time:

1. bob up and down
2. travel around the page

This motion should be compositional: the circle travels around, bobbing up and down all the while.

I do not know how to easily accomplish this with anime.js.

**My current workaround is:** to avoid using compositional motion.


### Other little bugs

Just keeping a note here in case they're note part of the above (though I'm not sure).

- SVG rotations (can't easily pick a center point)
- SVG translateX/Y on Safari
