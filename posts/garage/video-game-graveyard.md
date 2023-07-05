---
title: Video game graveyard
date: 2021-08-23
image: /assets/garage/video-game-graveyard/gamejam2-1.jpg
---

I think it's important to create [experiments and prototypes that don't end up working out](/garage/benefits-of-creating-prototypes-that-fail/).

To celebrate these, I've created a tiny catalog here of abandoned early game explorations and prototypes.

{% include "programming-language-tooltips.njk" %}

## Early experiments

<div class="mt5"></div>
{% set item = collections.software | selectAttrEquals(["data", "title"], "cybernet") | first %}
{% include "software-long.njk" %}
![](/assets/garage/video-game-graveyard/cybernet.jpg)

<div class="mt5"></div>
{% set item = collections.software | selectAttrEquals(["data", "title"], "libgdx-testgame") | first %}
{% include "software-long.njk" %}
![](/assets/garage/video-game-graveyard/libgdx-testgame.jpg)

<div class="mt5"></div>
{% set item = collections.software | selectAttrEquals(["data", "title"], "wasabi") | first %}
{% include "software-long.njk" %}
![](/assets/garage/video-game-graveyard/wasabi.jpg)


## gamejam1

Platformer. Collaboration with Cooper Smith.

![](/assets/garage/video-game-graveyard/gamejam1.jpg)


## gamejam2

Strike game + aliens. Collaboration with Cooper Smith. Had a great time programming the camera for this one!

![](/assets/garage/video-game-graveyard/gamejam2-1.jpg)

![](/assets/garage/video-game-graveyard/gamejam2-2.jpg)

![](/assets/garage/video-game-graveyard/gamejam2-3.jpg)


## gamejam3

Text adventure + disaster. Collaboration with Cooper Smith feat. Arby's.

![](/assets/garage/video-game-graveyard/gamejam3.jpg)


## gamejam4

Asteroids clone + future. Collaboration with Cooper Smith. We kinda phoned it in on this one.

![](/assets/garage/video-game-graveyard/gamejam4.jpg)


## gamejam5

GTA + dark ages. Collaboration with Cooper Smith. Ended up becoming foundation for [Fallgate](/posts/fallgate/).

![](/assets/garage/video-game-graveyard/gamejam5.jpg)


## gamejam6

Fighting + wild west. Collaboration with Cooper Smith. Fun to reverse engineer fighting games. I'm pretty sure it's all about hit boxes.

![](/assets/garage/video-game-graveyard/gamejam6.jpg)


## gamejam7

This is the only one that doesn't belong in the graveyard, but didn't want to leave you hanging wondering what happened between 6 and 8. This was [Fallgate](/posts/fallgate/)! (Also a collab with Cooper Smith.)


## gamejam8

Breakout clone. Collaboration with Cooper Smith. First attempt seriously going for it in Unity. Kind of a rough time.

![](/assets/garage/video-game-graveyard/gamejam8.jpg)


---

Related: [website graveyard](/garage/website-graveyard/), [personal infrastructure graveyard](/garage/personal-infrastructure-graveyard/).
