---
title: Fallgate
subtitle: We made a pixel-art action-adventure game
date: 2019-01-04
tags: project
image: /assets/posts/fallgate/title.jpg
---

![A screenshot of the game Fallgate]({{ "/assets/posts/fallgate/title.jpg" | url }})

Fallgate is a game my friend [Cooper](http://schmidlak.com/) and I made as a
hobby project. It is a pixel-art action-adventure game about questing through a
forest, vanquishing blops and eating doughnuts.

We co-designed the game and the levels. Cooper did the art and animations, and I
did the programming, sounds, and music.

You can play the game online for free. Not even ads!

<p class="db tc ba b--green ttu tracked w-100 pa2 mb0 dim pointer">
  <a href="https://mbforbes.github.io/fallgate" class="green">
    🎮 play fallgate
  </a>
</p>
<p class="tc f7 f6-ns mid-gray mt1">desktop only, Chrome optimal</p>

## Screenshots

![A screenshot of the game Fallgate]({{ "/assets/posts/fallgate/forest-spears.jpg" | url }})

![A screenshot of the game Fallgate]({{ "/assets/posts/fallgate/power-stab.jpg" | url }})

![A screenshot of the game Fallgate]({{ "/assets/posts/fallgate/combo.jpg" | url }})

![A screenshot of the game Fallgate]({{ "/assets/posts/fallgate/castle-entrance.jpg" | url }})

## Music

Here are two of the tracks I composed for Fallgate. The rest can be found in the game!


<audio preload="auto" controls>
 <source src="{{ "/assets/posts/fallgate/castle.mp3" | url }}"
         type="audio/mp3">
</audio>

<p class="audiocaption i">
Castle Theme from Fallgate
</p>

<audio preload="auto" controls>
 <source src="{{ "/assets/posts/fallgate/winter.mp3" | url }}"
         type="audio/mp3">
</audio>

<p class="audiocaption i">
Winter Theme from Fallgate
</p>

## Making Fallgate

What a ride! Fallgate was the first game Cooper and I saw to completion. Both of us work
other jobs full-time, so we built it during evenings and weekends. It took us two
years.

<!-- This includes some impromptu months off, and some "crunch time" to meet our own
imposed deadlines.
-->

<!--
We made it simply because we love games and have dreamed of making a game together. Our
budget was $0. There are no ads or in-game purchases, and we don't anticipate attempting
to make any money off of it. We posted it on other platforms that host games (itch.io, Newgrounds, Kongregate) in hopes that more people will play it, but don't anticipate making a dime (and haven't yet).
-->

### A Hobby from Scratch

We made almost everything in Fallgate from scratch, including all of the pixel art and
the game engine. This of course meant we traded development speed for having complete
control over minutiae, and it naturally limited the scope of what we could build. But
way more interestingly, we got to learn how all kinds of things in games tick by
crafting the features ourselves.

### Baking a Cake

Reinventing the wheel in this case was more like baking a layer cake where you don't
know how many layers there are, what they're made of, or really how to bake a cake at
all. But you've eaten professionally made cakes before and they tasted pretty good.
There are many surprises. For example, the first step is figuring out that you need an
oven.[^engine]

This analogy may sound dramatic, but we were routinely shocked not only by how
complicated it is to make even a small, simple game like ours, but by how bad we were at
even _estimating_ this difficulty!

### Upcoming Explorations

I'm excited to write more about making Fallgate. But it's too much for this post alone.
Let me instead give you a taste of some topics I'd like to delve into in the future:

- **Studying published games** --- We did this to figure out what kinds of
  effects or features we could add to our game. Sometimes we would go in with a specific
  inquiry in mind, such as, _"what effects do games use when you collect an item?"_ or,
  _"how do you make movement fun?"_ Other times, we would pick a game we
  enjoyed and play it with a magnifying glass[^magnifying] for thirty minutes.

- **System design** --- Some things we knew we needed, but weren't sure how to build
  them or what shape they would take. For me, these were things like an events system,
  collision detection optimization, or a GUI framework we could both use. A big
  challenge for me was balancing simplicity (_"what do we need right now?"_) with extendability (_"oh crap, I wrote this whole thing assuming X but now we want Y"_).

- **Experience design** --- Aesthetics are features. This took a long time for me to
  understand. While it's important to understand what a game's mechanics are
  fundamentally doing, it's at least equally important to be conscious of how you're
  communicating the game to the player through shapes, color, animations, particles,
  timing, sounds, and music. We found after nine months of development our game simply
  wasn't fun. Both mechanics and aesthetics were vital for breathing life into it.

- **Level design** --- We spent so long building the game's framework (engine, monsters,
  combat, etc.) that I forgot level design existed until late in our development. I was
  surprised that it is a totally new craft compared to everything I'd done for the game
  so far. You get to play with a deliciously nuanced toolkit, like teaching the player
  mechanics _via_ the gameplay itself, balancing the difficulty curve, and sprinkling in
  surprises. We designed all of our levels collaboratively on whiteboards.

<!--
- **Technical implementation** --- Great fun and excitement comes from building a
  codebase you'll extend for two years that should run fast on many platforms while
  having basically no constraints and no idea what you're doing.
-->

Fallgate isn't perfect. And several times, we ruthlessly gutted our project vision just
to finish. But it was so much fun to make that I'm already itching to tell you more
about it.

---

Thanks to [Cooper Smith](https://schmidlak.com/) for reading drafts of this. (And making the game with me!)

[^engine]: If you're ambitious, curious, or foolish, you'll start by designing and building an oven (game engine) yourself.

[^magnifying]: Sometimes this was a figurative magnifying glass, where we would play a certain segment over and over and try to figure out exactly what was happening. But sometimes it was almost a literal magnifying glass---we would take recordings or screenshots and zoom way in to see how effects were rendered.
