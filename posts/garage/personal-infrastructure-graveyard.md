---
title: Personal infrastructure graveyard
date: 2021-08-24
image: /assets/garage/personal-infrastructure-graveyard/levelup-1.jpg
---

I think it's important to create [experiments and prototypes]({{ "/garage/benefits-of-creating-prototypes-that-fail/" | url }}), and also to let them go.

To celebrate these, I've created a tiny catalog here of abandoned personal infrastructure I've made.

## org

{% include "programming-language-tooltips.njk" %}

{% set item = collections.software | selectAttrEquals(["data", "title"], "org") | first %}
{% include "software-long.njk" %}
![]({{ "/assets/garage/personal-infrastructure-graveyard/org.jpg" | url }})

I built this in 2013. What's interesting is how markdown editor / viewers are [still](https://www.zettlr.com/) [things](https://macdown.uranusjr.com/) [people](https://ulysses.app/) [build](https://obsidian.md/) [today](https://typora.io/). Markdown is a great markup language. People like keeping notes.

Today, after years trying several of the above, I've decided that absolutely minimal latency, scanning documents, embedding photos, cloud sync, apps for every device, and not paying a monthly fee are the features I like the most (in that order). A great note taking app was hiding under my nose the whole time: Apple Notes. So I use that.

## levelup

{% set item = collections.software | selectAttrEquals(["data", "title"], "levelup") | first %}
{% include "software-long.njk" %}
![]({{ "/assets/garage/personal-infrastructure-graveyard/levelup-1.jpg" | url }})

The first UI was based on a video game I was endeared to at the time called Persona 3.

![]({{ "/assets/garage/personal-infrastructure-graveyard/levelup-2.jpg" | url }})

The next UI took a more minimal approach.

I've tried many apps for habit, goal, and time tracking over the years as well. At this point, it seems like something that is more difficult to fit into an app. Priorities shift, the lifestyle evolves, and the more infrastructure I build around a process, the more it seems to inevitably get in the way. Right now, I use [Things](https://culturedcode.com/things/) to track recurring todos and things I don't want to forget, but use pen and paper for planning my daily work structure. I think there still might be a gap to be filled there for medium-term planning and goals.[^goals]

[^goals]: Though GitHub issues / milestones / projects have been working swell for [this summer]({{ "/garage/summer-2021-website-goals/" | url }}).

---

Related: [website graveyard]({{ "/garage/website-graveyard/" | url }}), [video game graveyard]({{ "/garage/video-game-graveyard/" | url }}).
