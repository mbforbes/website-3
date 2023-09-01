---
title: Sidenote test page
date: 2023-03-05
---

I'd like to try putting sidenotes in the margins for large enough pages. (This page has previews of the sidenotes if your browser is wide enough and you have JavaScript on.)

Gwern has a [review](https://gwern.net/sidenote) of a bunch of sidenote implementations.

I checked out Tufte-CSS, and it's not simple enough to drop in because my markdown parser (`markdown-it-footnote`) isn't spitting footnotes in elements near my main text.<span class="sidenote">
<span class="sidenote-number">01</span>
Here's an example side note that I could inject.
Don't look for a reference in the text, as this is a manual one I used to develop the HTML and CSS.
(Mainly CSS.)
It's quite long to test whether the one after it plays nice---i.e., delays its start till after this one is done, even if it means it won't line up with where it's supposed to start any more.
It's quite long. It's actually very, very long. Don't you know?
It's quite long. It's actually very, very long. Don't you know?
It's quite long. It's actually very, very long. Don't you know?
It's quite long. It's actually very, very long. Don't you know?
</span> Someone made<span class="sidenote">
<span class="sidenote-number">02</span>
This one is positioned to start just a couple words after the last. Also, hey look, we have to make sure the next wide image stays out of way of this text.</span> an extension called [`markdown-it-sidenote`](https://www.npmjs.com/package/markdown-it-sidenote/v/4.1.0), but it doesn't support named footnotes, which are most of mine, and I don't feel like rewriting all mine to support this.

NOTE: Adding `clear: both` works for image.

{% img2 "/assets/garage/image-test-pages/939x939@3x.png" %}

Since my markdown renderer isn't rendering inline footnote elements (near the references)---and instead puts them all at the end---I don't think a CSS-only solution will work.

My priorities are:
1. Not spending a ton of time on this
2. Desktop: put footnotes in the side
    - non overlapping, esp. big ones
    - render in lighter text
    - style differently than the ugly blue `[X]` style now
    - clicking on the footnote reference should highlight the footnote if it's visible rather than scrolling way to the bottom

Nice to haves:
1. For mobile, insert them on click

Open questions:
1. If the footnotes are rendered as sidenotes, do I remove them from the bottom of the page? I don't feel strongly about this, so if one way is easier than the other (and the easiest is probably doing nothing) I should probably start with that.

My notes on related work:
- Gwern's website is more confounding to use by the day (now there's an inexplicable empty sidebar, at least half the links are broken, and I can neither select text nor view the source), so I should take his preferences with a grain of salt
- Stratechery's footnotes ([e.g.](https://stratechery.com/2015/beyond-disruption/))
    - I like his styling for clicking to expand
    - I don't like that the margins aren't sidenotes on desktop
- OpenAI's footnotes ([e.g.](https://openai.com/research/jukebox))
    - I like their sidenote styling (smaller font, adaptive width, disappears)
    - I don't like that clicking on a reference takes you to the bottom of the page, or that this also breaks after window resizes
- Bob Nystrom ([e.g.](https://gameprogrammingpatterns.com/double-buffer.html))
    - I like the aside styling and that the side bar disappears on mobile
    - I don't want mine to appear inline by default on mobile
    - I don't like (for my style of writing) that the specific location that the sidenote is attached to isn't visible. (I guess technically these are _margin notes._)

## Implementation notes

- page width: 48rem (includes padding)
