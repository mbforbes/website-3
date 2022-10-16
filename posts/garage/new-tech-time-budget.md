---
title: New tech time budget
date: 2022-10-15
---

Starting a new project, each new technology you use adds a time cost for figuring out how it works.

You really notice this when you don't have a lot of time to work on personal projects. Because when you start a new project---if it's been long enough since your last one---you'll feel so out-of-date with everything that you'll feel compelled to make half a dozen new technology choices. The worst case version of this is that you then spend all your time getting up to speed with the new tech, run out of steam, and never finish anything.

I am envious of people who have a stack they're really comfortable with and in which they can just try out new ideas. I've never stuck on one tech stack or even area long enough to develop that. You could say it's a prerequisite to get [lots of practice]({{ "/garage/producing-lots-of-work/" | url }}).

---

A recent example: I'm starting a new project for fun that will probably use a web browser (HTML/CSS/JavaScript, maybe some shaders/WebGL) as a frontend. I tried making a few small switches:

1. **npm &rarr; yarn** --- no prob (just a couple bits of Googling, haven't used anything but the basics and it's been the same)

2. **[Tachyons](https://tachyons.io/) &rarr; Tailwind CSS** --- ehh, this is OK, though the Tailwind setup involves installing their CLI tool, making their own special config file, adding stuff to a CSS file, running (and presumably re-running) a build script, and then linking to this in your file. I temporarily skipped this and went right for the development version of dumping a one-liner in my HTML header (which they ominously discourage) and am now struggling with the normal "learn the differences" adoption cost.

3. **CSS Flexbox &rarr; CSS Grid** --- getting things laid out in CSS, a traditional pastime of mine that is pareto-optimally most annoying _and_ on which I spend the most time, I'm now at my limit, my enthusiasm has been burned through quickly, and I want to blast back to something I'm more familiar with.[^pixi]

[^pixi]: Like PixiJS, which I loved using in [Fallgate]({{ "/posts/fallgate/" | url }}), but is now v5 instead of v3, so I feared they finished fragmenting the whole thing into little pieces like they were threatening to do, and in the front page of their docs, the first link is a dead one that just goes to "TODO." This is the price of not staying current.

---

All of this (handling new tech time sinks) is manageable if you can commit to something and work at it bit-by-bit daily. I really notice it as a problem when: it's the evening, I have lots of energy and nothing to do and am alone, and want to get into [mad scientist mode](https://alex.miller.garden/notes/mad-scientist-mode/) and hack on something for fun, just to make something small in a couple hours and call it done. But I think and realize I don't have enough comfort in any technology stack to do it. Then I just watch YouTube.

---

Related work:

- [Choose Boring Technology](https://boringtechnology.club/) --- similar idea, but for different reasons (longterm operational cost in company)
