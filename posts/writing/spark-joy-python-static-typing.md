---
title: Static Typing Is the Key to Joy
date: 2020-07-20
tags: programming
image: /assets/posts/spark-joy-python/spark-joy-python-wide.jpg
series: Sparking Joy with Python
seriesOrder: 2
# layout: layouts/big-header.njk
---

![Marie Kondo holding up the python logo](/assets/posts/spark-joy-python/spark-joy-python-narrow.jpg)

<p class="figcaption">
Adapted from
<a href="https://www.flickr.com/photos/riseconf/27113243380/in/album-72157668861374906/">
photo by RISE</a>,
CC BY 2.0.
</p>

Static typing is the main point of this series of posts. Static type checking, when living inside your editor, improves your quality of life.

Let’s jump right in, and I’ll armchair philosophize later on about why I think it’s important.

## Without Static Typing

It is difficult to overstate the difference static typing makes in your minute-to-minute work. Returning to Python after writing Typescript, I was shocked and appalled at how much time I spent doing the following activities:

### 1. Reading code to figure out the types of a function's arguments

```python
# Good luck figuring what this
# returns without reading the code
# or writing massive docstrings
# everywhere.
def preprocess(path):
    ...

# Good luck figuring out the
# argument types.
def score(item, scorer, bst, wrst):
    ...
```

I write more about docstrings in _Part IV_, but succinctly: I think docstrings are often
a waste of time because (a) you have to type a lot, (b) they silently go out of date,
(c) often you really just need the type and can infer the rest. And perhaps most
importantly, (d) most research code just flat out isn’t gonna have detailed,
per-argument docstrings.

### 2. Waiting for my code to run for minutes before discovering I'd misspelled a variable name, gotten my imports wrong, or messed up an indentation.

```python
# help me red squiggles
lesser = 45
... # omitted
foo(leser)  # oops


# I also forget stuff
os.path.join(foo, bar)
# --> oops what's "os" says python

# look it happens sometimes
do_this()
if stuff:
	go_fast()

run_slow()

    and_this()  # oops, uhhh
```

## mypy
It turns out Python's developers sort of saw the whole “oh hmmm actually we might want static types" thing coming at least 13 years ago,[^1] and started adding optional static type annotations to Python. [mypy](http://mypy-lang.org/) is the gold standard static type checker, currently worked on by Guido himself (or at least last time I checked).

Integrated with your editor (I'm using VS Code), you get those wonderful red squiggles when you screw up something obvious.[^2]

## Simple checks

mypy can infer obvious types and tell you when you do a dumb thing:

```python
a = 5
a + 'hello'
# Error: Unsupported operand types
# for + ("int" and "str")
```

## Typos
Do you ever misspell variables?

```python
def bigger(bill: int):
    bill += 8
    blil += 17
    # Error: Name 'blil' is not
    #        defined
    bill += 25

```

Do you ever do bad bracket things?

```python
a = [('hi', 'max') for _ in range(7)
print("hi")
# Error: invalid syntax
```

_It gets mad at the `print` when really I’m missing a `]` on the previous line. But I can’t be too grumpy, that’s probably a hard one._

## Returns
Do you ever forget to return things?

```python
def r_map(
    v: List[str]
) -> Dict[str, int]:
    res = {
        w: i
        for i, w in enumerate(v)
    }
    # Error: Missing return
    #        statement
```

## Imports
Do you ever forget to import stuff?

```python
raw = '~/favorite-triangles.txt'
full = os.path.expanduser(raw)
# Error: Name 'os' is not defined
```

## I thought I needed another section here
I have a lot more to say below about the shortcomings I’ve encountered with mypy, and an embarrassing from-first-principles attempt at saying why IDEs can be nice.

But I’ve run into one of those problems here where you said the most important things you wanted to say, and they didn’t take up that many words on the page. And since people seem to pay attention to number of words—at least without strong clues otherwise—I think I need to point this out specifically:

The above is great! It’s _so much better_ than not having those things. If you remove most misspellings, forgotten brackets, forgotten returns, and forgotten imports, you take away, I don’t know, maybe 80% of the reasons my Python programs used to die in the middle of running.

This is fantastic. It is a massive improvement. I would encourage you to add some kind of real-time static Python checking to your workflow if you don’t have it already. Thank you, Python devs, for thinking of this and making it.

OK, now that that’s out of the way, I’m going to give some real estate to complaining. Not because it’s relevant here, but because I’m probably not going to write about mypy ever again, so this is as good a spot as any.

## Shortcomings
After using mypy for a year or two, I could go on and on about what it doesn’t get _quite_ right. I’ll spare you and try to keep this relatively brief.

The crux of it is this: mypy can’t actually figure out types that well, so it mostly catches typos and other shallow mistakes. This is very helpful. It’s certainly better than nothing. But it is very different from a static type analyzer knowing the type of _everything_ in your program, and being able to fully trust it.

I think there’s a qualitative leap that happens between a tool that works, say, 80% of the time, and one that works 98% of the time.[^3] I roughly correlate this with “how long will I spend trying to fix problems with the tool before giving up on it.” (mypy: 5–10 minutes; TypeScript: roughly forever.)

This is the hardest part to come up with concrete examples for, but here are some of my pain points:

### Shortcoming: A big library without annotations

I [ran into this](https://github.com/python/mypy/issues/3987) when trying to get mypy to help me out with some pytorch basics. I wanted some way to differentiate an `IntTensor` vs a `FloatTensor`. I was willing to do some digging, fixing, and writing some small type annotations myself. But the only true solution seemed to be the gargantuan task of writing type annotations for the entirety of pytorch. Again, I can’t really knock them for this one, because TypeScript also requires type annotations for any library you’re using. But TypeScript’s seem to be more ubiquitous.[^4]

### Shortcoming: Missing types

I was trying to say that something was specifically a `collections.defaultdict`, but I could not figure out how to do this. Could be just me, and this could be fixed now, but it’s something I’ve run into a few times. It’s frustrating to not be able to type something you know exists.

### Shortcoming: Tensor Shapes
This isn’t really a reasonable request, because I suspect it’d make the type system really complicated:

```python
a = torch.randn((4, 5))
b = torch.randn((6, 7))
m = a * b  # Shapes mismatch
```

Nevertheless, practically speaking, it’s a big one.

### Shortcoming: Confusion about aliases

I ran into this when mypy got mad about the distinction between `torch.optim.Optimizer` (I think this is what you use in code) and `torch.optim.optimizer.Optimizer` (I think this might be the underlying thing, and mypy couldn’t figure out that the shorter alias is legit).

This is an instance of “the program runs fine, but the type checker yells at me that there’s an error.” I respond with `# type: ignore` and deduct ten points from Guidoriffendor.

### Shortcoming: Spurious errors

This doesn't happen too often but it drives me nuts when it does.

One thing I like to do sometimes is print each item of a list on a new line. Here's a concise way I found of doing that, and what mypy thinks about it:

```python
# x is some list
[print(_) for _ in x]
# Error: "print" does not return a
#        value
```

This ends up creating a list of `len(x)` `None`s. It's never even assigned to anything. Seems pythonic to me. Maybe using a `None` return type is a faux pas. But my expectation with mypy is that if it says "Error," the program should crash.

### Shortcoming: Literals

I use a lot of strings to represent categorical variables, so the strings can only take on a few values. Every time I’ve tried to define literal types that restrict these, I have found sorrow.

```python
Number = Literal["One", "Two"]

def foo(n: Number) -> None:
	pass

foo("One")  # ok

n = "One"
foo(n)  # error, seriously??
```

I don’t understand programming languages or type theory well enough to know why this is difficult. I believe it is probably very difficult. It is still annoying as hell.

### Shortcoming: Lots of Python is Just Crazy Shit

When I try to read other people’s Python (OK, and sometimes my own), I constantly run into wonky data types that are dicts of lists of tuples, built on-the-fly to solve some specific problem

```python
{
    "jump": [
        (0, "first")
        (0.4, "second")
        (0.7, "third")
        {"oops": "I am special."}
    ],
    ...
}
```

now of course, I can dutifully go in and say, ah yes, this is a

```python
Dict[
    str,
    List[
        Union[
            Tuple[
                Union[Int,Float],
                str
            ],
            Dict[str, str]
        ]
    ]
]
```

(I think.) And sometimes this is worth it—it helps me figure out what the code is doing, and has caught some significant bugs. But more often than not, it’s like, ehhhhhhhhh, this is really starting to feel like bolting extra work on top of Python code that’s already doing what Python was meant to do: use an amazing core set of data structures to quickly compose data into flexible bundles and send it along.[^5]

### Taken together

All of these shortcomings are completely understandable. But taken together, you end up getting fed up playing type golf to try to help the type checker out. At some point, the scales tip, and you think, “I’m just wasting my own time, it’s never going to catch bugs when I’m doing all the heavy lifting,” and you start throwing `Any`s at everything that whines at you.[^6]

## Why Static Typing Matters for Joy

Let me take an unqualified swing at this one.

Programming as an activity involves many actions:
- You plan out what you want to do.
- You think about how you can accomplish this in the language that you’re using.
- You push buttons on a keyboard to write your ideas.
- You read documentation and StackOverflow to figure out how the pieces you forgot about work.
- You test out little toy programs to really make sure you know what’s going on.
- You run your code and see what happens.

During the action of typing your code, it is immensely helpful to have a copilot. Something that checks what you’ve written and reminds you about what’s there.

For some aspects of programming, this is convenient: you’ll fix a typo before you run your code. (Python with mypy is mostly here.)

But for other aspects of programming, having a copilot categorically changes the class that the action falls under. (TypeScript is here.)

For example, take method lookup on an object. The feedback loop to go from “what methods does this object have?” goes from many seconds (looking this up on the Internet) to instantaneous (scrolling through a tooltip with fuzzy autocomplete). This moves the action of “method lookup” into a new category.

Changing categories is huge. Imagine if typing each key on the keyboard required ~10 seconds. I would go mad.

Now, clearly this copilot isn’t necessary. But going from having a copilot (TypeScript) to not having one (Python), you really miss it. Many actions revert to being “slow” again. Stupid bugs pop up. In retrospect, it’s less delightful.

## Summary
Static type analysis enables a programming copilot to provide wildly more helpful information. Programming with such a copilot sparks joy. Static typing is the key to joy.

[^1]:	At least judging by the early [PEP 3107](https://www.python.org/dev/peps/pep-3107/) from 2006. This got more formalized in [PEP 484](https://www.python.org/dev/peps/pep-0484/) with rules about how you can add lots of little variable and function annotations, and then check them with tools.

[^2]:	Other editors like PyCharm also have mypy-like static type checking features. From a bit of experimentation with PyCharm, it seems that its static type checker is very similar to mypy, but they both have different edge cases and quirks.

[^3]:	“Works” isn’t totally fair here. It’s not that mypy is broken; instead, I suspect it _can’t_ be clever enough given the dynamic language it’s analyzing.

[^4]:	I don't actually know whether type annotations for major libraries are more common in Javascript than Python, it's just sort of my feeling from mucking around in both. Also, it could be that a library like pytorch is doing all sorts of hairy business with reflection, metaprogramming, and C extensions, and it would be difficult to cleanly type.

[^5]:	No idea if this is what Python was supposed to be meant to do, but in my opinion this is what it does truly great.

[^6]:	The problems I hit also seem to be just beneath being Googleable because they’re relatively specific to a somewhat-unused piece of Python.
