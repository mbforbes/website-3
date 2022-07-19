---
title: Why
date: 2020-07-20
tags: programming
image: /assets/posts/spark-joy-python/spark-joy-python-wide.jpg
series: Sparking Joy with Python
seriesOrder: 1
---

![Marie Kondo holding up the python logo]({{ "/assets/posts/spark-joy-python/spark-joy-python-narrow.jpg" | url }})

<p class="figcaption">
Adapted from
<a href="https://www.flickr.com/photos/riseconf/27113243380/in/album-72157668861374906/">
photo by RISE</a>,
CC BY 2.0.
</p>

I’ve been writing Python for about eight years.

When you come from Java, Python is magic. You can get so much done in so little code.

```java
// Java be like
public static void main(
    String[] args) {
```

```python
# Python be like
', '.join([f"last: {x[-1]:.2f}"
          for x in d.values()])
```

I think I was too confused as an undergrad to really appreciate Python.[^1] But at some point, I looked back at Java and just—yikes! So much typing to _do_ anything.

## The world discovers Python
Machine learning runs on Python.

Matlab and Julia were fighting the good fight back in 2012, and it sort of looked like anybody’s ball game. Back then, I picked numpy. Once deep learning exploded, the heavy hitters Tensorflow and Pytorch both chose Python as their interface.

And since then, it’s Python, all the way down. Absolute globs, scads, and mountains of Python.

I write this only to tell you why I still use Python—because it’s the only first-class citizen in machine learning.[^2]

## I discover TypeScript
During 2017 and 2018, I spent my free time writing TypeScript for a little game called [Fallgate]({{ "/posts/fallgate/" | url }}). TypeScript is based on JavaScript, which everyone loves to hate, and so I was prepared to hate TypeScript.

But then the funniest thing happened. I actually had a really great time writing TypeScript.

## The Elephant in the Room
Yes, I was making a game with TypeScript, and attempting to do natural language processing (NLP) research with Python.

And yes, game programming, in my opinion, is a much more fun genre of _programming_ than natural language processing.

Game programming has a stimulating feedback loop. When I built a new system for animation, lighting, particles, or movement, I'd immediately _see_ the effects of the new feature. Plus, the actual code I wrote was interesting. The game programming centered around making real-time systems that efficiently managed interlocking behaviors for thousands of little game world entities. I got to try out new design patterns and play around in geometry, physics, and graphics.

On the other hand, programming for NLP research, I spend most of my time pushing big sludge piles of text data around. I scrape, annotate, clean, format, chunk, and batch text. I pour through text and find mountains of badly encoded files, non-linguistic junk like HTML, and of course, scads of idiots’ Internet blatherings—like this blog post! From a purely time-based perspective, I spend shockingly few hours actually building those cool neural network models everyone is excited about. And when I do, the models themselves were only a few dozen lines of code.[^3]

<div class="flex">
<div class="w-50">
<img src="{{ "/assets/posts/spark-joy-python/game-before.gif" | url }}">
</div>
<div class="w-50">
<img src="{{ "/assets/posts/spark-joy-python/game-after.gif" | url }}">
</div>
</div>

<p class="figcaption">
Figure 1: Game programming before and after.
</p>


<div class="flex">
<div class="w-50">
<img src="{{ "/assets/posts/spark-joy-python/nlp.gif" | url }}">
</div>
<div class="w-50">
<img src="{{ "/assets/posts/spark-joy-python/nlp.gif" | url }}">
</div>
</div>

<p class="figcaption">
Figure 2: NLP programming before and after.
</p>

But aside from the (admittedly large) difference in _what_ I was doing, there was a qualitative difference in the feel of the activity of programming.

## Joy
Programming in TypeScript brought me joy. It was easy. I felt like I always had a better handle on what options were available to me. I also felt more confidence about what was going to happen when my code ran.

Only through this contrast of using both languages in the same day did I realize how little joy I got from Python.[^4]

Why does it matter if Python sparks joy? When I first chose this headline, I thought it was funny. Now that I’m actually writing this, I’m becoming convinced it might be quite serious. We pour hundreds of the precious hours of our only life into our work. Seeking joy in the day to day, minute-to-minute experience of programming might be one of the more important things we can do.

What follows is a few posts in which I share my attempts to spark joy of Python back into my life. The first one is about static typing. I think it is the most important factor.

## Disclaimers

**Familiarity** — I’m assuming in these posts you're moderately familiar with writing Python code. For example, I assume you understand kinds of stuff like:

- Why people dislike `from <name> import * `
- What if `__name__ == "__main__"` does
- That list comprehensions are idiomatic
- What `virutalenv`s are and why people use them

**Unfamiliarity** — I’m also assuming you’re not a Python expert. Maybe you’re someone who picked it up as your first or second language in the last year or two. If you know too much, you will probably think that what I write is obvious, wrong, or both.

**Solo coding** — I realized after almost finishing a draft that some of these practices are geared towards effectively programming by yourself.

How much discipline is necessary in solo coding? I found that after I stopped working for Google, I over-engineered most things I wrote, because I thought that writing production code for a company was "good practice" in general, and that I would be a more effective grad student if I wrote the same kind of code for my research. Many grad students (at least stereotypically) swing far on the other side of the spectrum: writing super hacky, unreadable code that barely works through a publication submission.

The best approach, at least for me, is probably somewhere in the middle. I realized after a few years that speed of creation in research code trumps industrial robustness,[^5] but there were still a few habits that would minimize my own burden down the road.

[^1]:	Side bar, undergrads are way too competent these days.

[^2]:	It’s this, or spend all your time making Haskell/Scala/whatever bindings for everything and never actually get any work done. And even if you do get that house of cards built, god only knows research code doesn’t need any more help falling over.

[^3]:	Which, by the way, is a miracle (that neural network models are a dozen lines of code). It’s how it should be. But that does mean that you spend all your time doing everything _other_ than writing the neural network itself.

[^4]:	I also got joy from Ruby. Which is spooky, because Ruby is trying for you to feel that way. But it’s a completely different joy than with TypeScript. To me, writing TypeScript feels like going on a hike with a really knowledgeable friend who has planned everything and knows the names of all the plants. Writing Ruby feels like going to Amsterdam as a nineteen-year-old. But for better or for worse, now that I’m hooked on static typing, I don’t know if I can go back.

[^5]:	One habit I still can’t kick is sprinkling `assert`s and sanity checks everywhere.
