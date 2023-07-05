---
title: Decluttering with Tools
date: 2020-07-20
tags: programming
image: /assets/posts/spark-joy-python/spark-joy-python-wide.jpg
series: Sparking Joy with Python
seriesOrder: 3
---

![Marie Kondo holding up the python logo](/assets/posts/spark-joy-python/spark-joy-python-narrow.jpg)

<p class="figcaption">
Adapted from
<a href="https://www.flickr.com/photos/riseconf/27113243380/in/album-72157668861374906/">
photo by RISE</a>,
CC BY 2.0.
</p>

Use a code formatter to wash away all of your stupid opinions about how your code should look. Ditch linters. Debug with a REPL. Use a newer language. And pick an editor that works on your servers. Ahh.

## Black
Do you ever try to align variables to function indentations?

```python
check_this_call_out(argument1,
                    here_is_arg2,
                    look_at_arg3)

oh_another(slightly,
           different,
           indentation)

this_one_is_way_too_long_so(
    lets, get, back, to, basics,
)

```

When do you switch? Do you put trailing commas? When you start adding type annotations, things get even hairier.

My life improved when I stopped ever dealing with any of that crap. Enter [Black](https://github.com/python/black), a python formatter. Directly from their GitHub:

> By using it, you agree to cede control over minutiae of hand-formatting. In return, Black gives you speed, determinism, and freedom from pycodestyle nagging about formatting. You will save time and mental energy for more important matters.

I've never minded python's indentation-instead-of-braces style, but I have minded rearranging stuff around manually and thinking about when to put what where. After writing in Go for a while and similarly relinquishing formatting to `gofmt`, this comes as a welcome relief. Simply set up your editor to run your formatter when you save a file.[^1]

## Ditch linters

Every linter I have used whined about non-vital things. I have abandoned all such noise. Black declutters, mypy (from the previous post) tells me when things are truly wrong. (Sometimes.)

## `code.interact(…)`

Whenever, I don’t know what’s going on, I just drop in this line:

```python
code.interact(local=dict(globals(), **locals()))
```

That line drops you into an interactive python prompt with the complete state of your program. (Don’t forget to `import code` before using.) I use it so much I made a button on my keyboard vomit out that whole line.

This single line joins together file-based programming (is there a better word for that?), with interactive experimentation. If you send it “end of file” (ctrl-D for me) your program keeps on running where it left off.

If you don’t have anything like this, it’s an immense help. I use it:

- when my program has **a bunch of state** that I want to play around with. Maybe there are variables that took a while to compute, or I’ve defined a lot of functions I want to try out.

- when I’m **writing the first draft** of something. I always have some of those lines sprinkled throughout (to check on things), and one at the end of the program (so I can inspect the results so far)

- when I’m neck-deep in a neural net and I want to **check out tensor shapes and contents** (assuming you’re using something like pytorch that lets you do that)

- when there’s an an **exception I don’t understand**, I toss one beforehand

If you’re already using grownup tools, that’s great, keep doing that. Here are some that are probably better but I’ve been too lazy to really figure out:

- `pdb.set_trace()` — Launches a debugger, **but** you are now in a special prompt with a whole set of special debugger commands. There is probably one to send you into a REPL. But I always just want a REPL.

- `IPython.embed()` — I actually did figure this one out recently! (In other words, I learned how to really use IPython.) **But** this seems to explode when you have threads going on (like in a web server). `code.interact(...)` handled the same situation fine.

- using breakpoints with an editor — seems great. **But** you have to figure out how to hook your editor up to Python, or figure out how to run python from within your editor. I tried this once, and my code ran way slower. So I never tried it again.

## Python 3
I started writing this blog post so long ago that this idea was somewhat controversial. At this point, it seems pretty much accepted. Python 3 is smooth sailing. Strings just work, and you get support for cooler stuff like cleaner type annotation syntax. Here's a [cheat sheet](http://ptgmedia.pearsoncmg.com/imprint_downloads/informit/promotions/python/python2python3.pdf) if you need help.

## VS Code’s Remote Development

For the first time, I have a twenty-first century editor that can edit code that lives on a remote server as well as my desktop.

For me, the editor is the lynchpin that holds together other joy-sparking tools:

- it runs **mypy** to tell me about errors I’ve made

- it gives me type-aware **autocomplete** (sometimes) and shows me where functions and classes are defined (usually)[^2]

- it runs **Black** to format my code

- it its filled with non-python-specific but still joy-sparking programming features like key binding support, color themes, a wide variety of plugins, a comprehensible but vast config system, and a development team that works on it constantly and seems to really give a damn.[^3]

It is such a joy to have a really solid editor that _just works_ locally and remotely. I can’t tell you how many times I’ve played the “`git push` here and `git pull` there” game, `ssh`’d in for Emacs to change “just one little thing,” or spent hours trying to jurry rig mount filesystems that end up crashing my Mac so I could use Sublime. This all strikes me as one of those things programmers of the future will be shocked we took so long to figure out after inventing the Internet.

## Summary
Pick few tools to help you with common tasks and declutter annoying ones.

[^1]:	There are also other Python formatters. My point isn't that Black is the best, but just that you should use one.
<!-- Sorry, I already hedged about this point in the intro, but I’m hedging more here. -->

[^2]:	[Jedi](https://github.com/davidhalter/jedi) really deserves credit here, as it’s doing the heavy lifting. I didn’t include it above because it’s not a conscious choice of mine, it’s just what VS Code picks by default.

[^3]:	Devs giving a damn is one step removed from directly sparking joy. But it shines through a product in myriad ways. You can really tell, and because of it the joy factor is significantly upped.
