---
title: Website graveyard
date: 2021-08-23
image: /assets/garage/website-graveyard/mortrag.jpg
---

I think it's important to create [experiments and prototypes](/garage/benefits-of-creating-prototypes-that-fail/), and also to let them go.

To celebrate these, I've created a tiny catalog here of abandoned websites I've made.

## Mortrag

Like many people, I really cut my teeth programming by building websites.

It was a blast. I remember working on these websites for so many hours during a day I would forget to eat. Or scheming up website features I could make and being so excited I couldn't sleep.

The first series of websites I made were for _Mortrag,_ a self-described nerd club. They were raw HTML/CSS static sites, hosted on Freewebs (yes), then Geocities (yes!), then Google Pages. They are so old that the Internet Archive doesn't even have good scrapes of them.

I eventually bought a domain name and web hosting, which suddenly let us run server-side code. Having a bad taste in my mouth from trying to learn Java in middle school, and being terrified of this camel thing called Perl, I stumbled upon a language called PHP. I wrote code for months (years?) in Windows Notepad, not even knowing the concept of syntax highlighting. I am thankful it---the crumbling mountain of PHP---has been lost to the annals of time.

![](/assets/garage/website-graveyard/mortrag.jpg)

I had a brief stint with rekindling the Mortrag website, and spent a month or two learning Ruby on Rails with the aim of writing a new one from scratch.

![](/assets/garage/website-graveyard/mortrag-ror.jpg)

{% include "programming-language-tooltips.njk" %}
{% set item = collections.software | selectAttrEquals(["data", "title"], "alpha1") | first %}
{% include "software-long.njk" %}

Ruby on Rails blew my mind. It was so powerful. It made me realize just how much boilerplate I was writing in PHP.

But, alas, the time for making Mortrag websites had passed. I moved on.


## My first personal website

![](/assets/garage/website-graveyard/prjpages.jpg)

{% set item = collections.software | selectAttrEquals(["data", "title"], "prjpages") | first %}
{% include "software-long.njk" %}

Coming off of the high of seeing how brilliant Ruby on Rails was compared to PHP, I wanted to try the new hotness: Node.js. But not just that: building on a library called Express, running the site on Heroku, writing posts in markdown, storing structured data with CSON (like JSON with Coffeescript), rendering with Jade (HTML templates), styling with Bootstrap and SASS---everything, everything!

It's funny how much you realize in hindsight.

I hadn't been familiar the concept of generating a static website, so I just assumed I needed to have a sever. Do my own route handling, that kind of thing.[^cs] This added headaches and complexity.

[^cs]: Add this to the long list of practical stuff you don't get from a CS degree.

Also, if there a few names from that technology list you don't recognize, there's the next lesson: relying on too much shiny new tech. This made debugging a pain.

I wrote more about the nuts and bolts of this website failing in [creative friction](/posts/creative-friction/). With the rose tinted glasses of several years of hindsight, I can comfortably recline and proclaim: but hey, what a great learning experience!


## schmidlak

![](/assets/garage/website-graveyard/schmidlak.jpg)

{% set item = collections.software | selectAttrEquals(["data", "title"], "schmidlak") | first %}
{% include "software-long.njk" %}

I made this for my friend Cooper.

## mlbc

![](/assets/garage/website-graveyard/mlbc.jpg)

{% set item = collections.software | selectAttrEquals(["data", "title"], "mlbc") | first %}
{% include "software-long.njk" %}

Machine learning bootcamp (`mlbc`). A statistics study group I helped organize in the first year of my PhD. This website mostly had our schedule and my manifesto, but also some nice typeset math on a couple topics.

## snurfle

![](/assets/garage/website-graveyard/snurfle.jpg)


{% set item = collections.software | selectAttrEquals(["data", "title"], "snurfle") | first %}
{% include "software-long.njk" %}

A joke website I made.

It took a few times, but at this point I learned not everyone loves having websites made for them as birthday presents. Who would have thought?

---

Related: [video game graveyard](/garage/video-game-graveyard/), [personal infrastructure graveyard](/garage/personal-infrastructure-graveyard/).
