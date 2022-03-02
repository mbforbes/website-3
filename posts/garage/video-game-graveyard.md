---
title: Video game graveyard
date: 2021-08-23
image: /assets/garage/video-game-graveyard/gamejam2-1.jpg
---

I think it's important to create [experiments and prototypes that don't end up working out]({{ "/garage/benefits-of-creating-prototypes-that-fail/" | url }}).

To celebrate these, I've created a tiny catalog here of abandoned early game explorations and prototypes.

{% include "programming-language-tooltips.njk" %}

## Early experiments

<div class="mt5"></div>
{% set item = collections.software | selectAttrEquals(["data", "title"], "cybernet") | first %}
{% include "software-long.njk" %}
![]({{ "/assets/garage/video-game-graveyard/cybernet.jpg" | url }})

<div class="mt5"></div>
{% set item = collections.software | selectAttrEquals(["data", "title"], "libgdx-testgame") | first %}
{% include "software-long.njk" %}
![]({{ "/assets/garage/video-game-graveyard/libgdx-testgame.jpg" | url }})

<div class="mt5"></div>
{% set item = collections.software | selectAttrEquals(["data", "title"], "wasabi") | first %}
{% include "software-long.njk" %}
![]({{ "/assets/garage/video-game-graveyard/wasabi.jpg" | url }})


## gamejam1

Platformer. Collaboration with Cooper Smith.

![]({{ "/assets/garage/video-game-graveyard/gamejam1.jpg" | url }})


## gamejam2

Strike game + aliens. Collaboration with Cooper Smith. Had a great time programming the camera for this one!

![]({{ "/assets/garage/video-game-graveyard/gamejam2-1.jpg" | url }})

![]({{ "/assets/garage/video-game-graveyard/gamejam2-2.jpg" | url }})

![]({{ "/assets/garage/video-game-graveyard/gamejam2-3.jpg" | url }})


## gamejam3

Text adventure + disaster. Collaboration with Cooper Smith feat. Arby's.

![]({{ "/assets/garage/video-game-graveyard/gamejam3.jpg" | url }})


## gamejam4

Asteroids clone + future. Collaboration with Cooper Smith. We kinda phoned it in on this one.

![]({{ "/assets/garage/video-game-graveyard/gamejam4.jpg" | url }})


## gamejam5

GTA + dark ages. Collaboration with Cooper Smith. Ended up becoming foundation for [Fallgate]({{ "/posts/fallgate/" | url }}).

![]({{ "/assets/garage/video-game-graveyard/gamejam5.jpg" | url }})


## gamejam6

Fighting + wild west. Collaboration with Cooper Smith. Fun to reverse engineer fighting games. I'm pretty sure it's all about hit boxes.

![]({{ "/assets/garage/video-game-graveyard/gamejam6.jpg" | url }})


## gamejam7

This is the only one that doesn't belong in the graveyard, but didn't want to leave you hanging wondering what happened between 6 and 8. This was [Fallgate]({{ "/posts/fallgate/" | url }})! (Also a collab with Cooper Smith.)


## gamejam8

Breakout clone. Collaboration with Cooper Smith. First attempt seriously going for it in Unity. Kind of a rough time.

![]({{ "/assets/garage/video-game-graveyard/gamejam8.jpg" | url }})


---

Related: [website graveyard]({{ "/garage/website-graveyard/" | url }}), [personal infrastructure graveyard]({{ "/garage/personal-infrastructure-graveyard/" | url }}).
