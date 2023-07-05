---
title: "Don't Justify Web Text"
subtitle: "Or at least hyphenate"
date: 2021-03-29
tags: "design"
image: /assets/posts/web-justified-text/paper-annotated.jpg
---

In print, or when typeset with a good program, justified text is beautiful. All of the academic writing in my field is set justified by default, and I think it looks lovely:

<div class="flex">
<img src="/assets/posts/web-justified-text/paper.jpg" class="sc bare mh2 flex-auto" loading="lazy" decoding="async">
<img src="/assets/posts/web-justified-text/paper-annotated.jpg" class="sc bare mh2 flex-auto" loading="lazy" decoding="async">
</div>

You get these really nice ultra long vertical lines, broken up into a satisfying rhythm by stuff like headers, figures, tables, and equations.

Grab any book and it’s probably justified. I just took one off my bookshelf at random—_White,_ by Kenya Hara:

![](/assets/posts/web-justified-text/book.jpg)

So, what about the web?

## It’s the Hyphenation, Dummy

Whatever is doing your type layout has got to be able to hyphenate words. If you just slap on a `text-align: justify` CSS, you’ll get goofy spread out text:

<div class="flex">
<img src="/assets/posts/web-justified-text/web-justify.jpg" class="sc bare mh2 flex-auto" loading="lazy" decoding="async">
<img src="/assets/posts/web-justified-text/web-justify-annotated.jpg" class="sc bare mh2 flex-auto" loading="lazy" decoding="async">
</div>

<p class="figcaption">I marked somewhat awkward spaces in orange, and very ugly ones in red.</p>

The last time I’d looked, hyphenation (CSS: `hyphens: auto`) wasn’t widely available. But, lo and behold, wait a few months, and it’s starting to emerge:

![](/assets/posts/web-justified-text/web-hyphen.jpg)

<p class="figcaption">Hey, much better!</p>

This is with Chrome. For, e.g., Safari on macOS and iOS, you’ve still got to use one of those janky CSS `-webkit-` prefixes. Edge apparently isn’t quite there yet entirely.[^compat]

[^compat]: Here's a [thorough table](https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens#browser_compatibility) of browser compatibility for hyphenation, and here's a [condensed one](https://caniuse.com/css-hyphens) (AKA, English-centric).

### Aside: Hyphenation

When I looked this up a while back, it was the first time I’d really thought about hyphenation. Why would it be hard? As far as I can tell, there are a couple main aspects:

1.	**Where** are you allowed to hyphenate? At syllable boundaries. First of all, this requires knowing where the syllables in all words are. In other words, you suddenly need a huge dictionary with syllable markings for all words. Second, this means the process is now language-specific. Compared to just splatting down symbols on the page and wrapping, knowing about syllables seems way more complex.

2.	**How** do you decide when to hyphenate? There’s some algorithm running making tradeoffs between shoving words further apart and splitting them up. Decisions you make on one line affect the next. Apparently this is surprisingly computationally intensive, which might have factored into it languishing for so long.

The second point especially should reveal that hyphenating justified text involves an algorithm, and the algorithm can be of different quality in different implementations.

## Justify + Hyphenation on the Web: It’s Still not Great

Here’s another example of justified text with and without hyphenation in Chrome (this is Chrome 89, on March 29, 2021).

Justified:

![](/assets/posts/web-justified-text/web2.jpg)

Justified, with hyphenation:

![](/assets/posts/web-justified-text/web2.jpg)

Notice the difference? Exactly; there is none. Chrome couldn’t figure out a good way to lay this out, even with hyphenation turned on.

Compare this with LaTeX,[^latex] which aggressively hyphenates. You will almost never see the kind of floaty word spacing like above. Instead, you’ll see dense blocks rich with hyphenation:

![](/assets/posts/web-justified-text/paper-paragraph.jpg)

[^latex]: I would like to take this opportunity to complain that LaTeX iS cApItAlIzEd lIkE tHiS.

In the above paragraph, of the nine lines that reach the right margin, five (over half!) are hyphenated and split.[^hyphens]

[^hyphens]: Once I realized how dense hyphenated words are in printed text, I was surprised that it never bothers me when reading. My guess is that growing up reading books, we’re so used to parsing hyphenated words that we don’t even notice. I wonder whether this might be different for a window of generations that grows up reading text mostly online, but before the web is universally justified and hyphenated. (Or, will it ever be?)

## Recommendation: Don’t Do It

I’m not actually in a position to recommend any design decisions to anybody. But my personal preference is still for left-aligned text on the web. If and when a major shop like the NYT, Medium, or Substack justifies their text online, it might be worth looking into.

I only write this because I come across hand-designed blogs semi-regularly that use justified text and no hyphenation.[^theory] Once you are aware of it, you can’t un-see those ghastly word gaps. If this is you, maybe consider turning on hyphenation right now.

[^theory]: These often look OK on a desktop monitor---and I suspect that's where they were designed---but break down when you [read them on your phone](/posts/fixing-mobile-page-layouts/).

Or better yet, just align left.

## Gallery of ~~Shame~~ Opportunity

I've started collecting pages I find with justified text without hyphenation that ends up looking awkward. To, uhhh, raise awareness?

<div class="flex items-center flex-wrap fig">

  <div class="w-50 w-third-ns tc ph1 ph2-ns mb1 mb2-ns">
      <img src="/assets/posts/web-justified-text/jpegxl.jpg" class="br3 br4-ns novmargin" loading="lazy" decoding="async">
      <p class="f6"><span class="strike">From <a href="https://jpegxl.info/">jpegxl.info</a></span> hyphens have been added!</p>
  </div>

  <div class="w-50 w-third-ns tc ph1 ph2-ns mb1 mb2-ns">
      <img src="/assets/posts/web-justified-text/kylemcdonald.jpg" class="br3 br4-ns novmargin" loading="lazy" decoding="async">
      <p class="f6">From <a href="https://kylemcdonald.net/psac/">Kyle McDonald</a></p>
  </div>


  <div class="w-50 w-third-ns tc ph1 ph2-ns mb1 mb2-ns">
      <img src="/assets/posts/web-justified-text/publicdelivery.jpg" class="br3 br4-ns novmargin" loading="lazy" decoding="async">
      <p class="f6">From <a href="https://publicdelivery.org/damian-ortega-cosmic-thing/">Public Delivery</a></p>
  </div>

</div>
