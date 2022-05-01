---
title: Conventions Are Small Magic
date: 2020-07-21
tags: programming
image: /assets/posts/spark-joy-python/spark-joy-python-wide.jpg
series: Sparking Joy with Python
seriesOrder: 4
---

![Marie Kondo holding up the python logo]({{ "/assets/posts/spark-joy-python/spark-joy-python-narrow.jpg" | url }})

<p class="figcaption">
Adapted from
<a href="https://www.flickr.com/photos/riseconf/27113243380/in/album-72157668861374906/">
photo by RISE</a>,
CC BY 2.0.
</p>

I have started following a few simple rules when I write Python that helps me focus on stuff that matters. For some folks, these conventions may already be second nature. But I read code all the time that follows none of them, and I thought they might help.

## Absolute `import`s

I feel like an insane person when I think about Python imports. Has anyone else struggled way too much with this? Whenever I would start a project that gets to medium complexity I would freshly try to learn how to import stuff in Python. This usually involved the following process:

1. Try splattering `import name` and `import .name` and `import ..name` around your code,  add `__init__.py`s everywhere, try installing things locally with `pip`, start linking directories around, then get fed up with yourself and…

2. Try to read Python’s official explanations of how modules and imports work. Completely fail to see how it applies to your use case.

3. Search on Stack Overflow and find some people manipulating Python’s path using  `sys.path` and `__init__.py` files and `PYTHONPATH`, and other people yelling at them never to do that, offering solutions that don’t quite apply to your use case.

4. Look at larger Python projects on GitHub, which manipulate Pythons’s path using
	 `sys.path`, `__init__.py`s, and `PYTHONPATH`.[^1]

5. Cry silently for a while. Consider going back to steps 1 or 2 Consider copy
	pasting code. Consider switching programming languages or careers.

I finally came across a guide—which for the life of me I cannot find now—that
outlined a practice that has worked for me since:

- Put your Python code under a top-level directory and use subdirectories as needed
- Always use absolute imports
- Always run with `python -m`

For example, say you come up with dumb codenames for your projects like “ice”,[^2] your source code tree would look like:

```python
ice/data.py
ice/util.py
ice/models/bert.py
ice/models/singularity.py
ice/runners/trainer.py
```

Then you would import each file **from _anywhere_ else** like:

```python
import ice.data
import ice.util
import ice.models.bert
import ice.models.singularity
import ice.runners.trainer
```

Or, you know, like:

```python
from ice import data
from ice import util
from ice.models import bert
from ice.models import singularity
from ice.runners import trainer
```

And you could run each file like:

```python
python -m ice.data
python -m ice.util
python -m ice.models.bert
python -m ice.models.singularity
python -m ice.runners.trainer
```

**Unfortunately**, there are some annoyances: you don’t get shell autocomplete with `python -m`, and logging is less intuitive.[^3] There are also some other complications to consider: how to have separate directories for test code, and how to allow you to run without `-m` (e.g., `python ice/data.py`).

**Fortunately**, these are all overcome-able. And by always using absolute imports this way, you get a single, consistent import strategy that lets you import anything from anywhere else. For me, this always just works. If you’re looking for a fire-and-forget setup, give this a whirl.[^4]


## Organize imports
Three groups: built-ins, 3rd party, my own code. Order them alphabetically in each group.

```python
import argparse
import json
import logging

import torch
import torch.nn as nn
from tqdm import tqdm

from ice import data
from ice.models import singularity
```

**Why?** This makes it easy to see what is imported at a glance. It’s arbitrary, especially alphabetization. But it’s one less thing to decide about, and one more piece of consistency so you can skim your own code faster.

## Put everything in functions
Don’t put code in the top-level of a file.

```python
# We may have a bad time.
i_am_global_now_lol = 17
should_i_be_a_constant = 'maybe'
really_slow_function()

# Better
def main() -> None:
    i_am_global_now_lol = 17
    should_i_be_a_constant = 'maybe'
    really_slow_function()
```

**Why?** If you want to import something from the file, like a function, you will run all the code that you put in the top-level scope. This means slow stuff, and things you don’t want to run, all get run when you import it. You’ll also end up with everything in the same scope, which can make variables hard to track. You may end up accidentally using them in functions.

## Minimize mutation
Straight to an example:

```python
# lots of mutation. Please forgive
# that this is contrived.
path = cur_dir
path += filename
path += '.txt'
# … say, 40 lines later …
path += '.gz'
# what’s in path? you have to decode
# backwards to find out
```

vs

```python
# no mutation
path_txt = os.path.join(
    cur_dir, '{}.txt'.format(fn))
path_gz = os.path.join(
    cur_dir, '{}.gz'.format(fn))
path_txtgz = os.path.join(
    cur_dir, '{}.txt.gz'.format(fn))
```

**Why?** I find that if I minimize mutating variables, I have to remember less and don’t accidentally use the wrong piece of state. This example is not very convincing (I’m sorry), but it truly does eliminate a whole class of bugs.

## Always Write Minimal Comments
I mean both interpretations of this: (1) always write comments instead of skipping them; (2) always write minimal comments instead of long ones. Always do both.

Let’s look at examples.

Bad: no comments:

```python
# Bad
def favorite_dish(
    user_id,
    all_dishes,
    since_sec = -1
):
    ...
```

Bad: long comments. Putting argument types in the docstring (unhelpful for type checking, requires more space, requires following conventions), and writing verbose obvious descriptions of each type and return value:

```python
# Bad
def favorite_dish(
    user_id,
    all_dishes,
    since_sec = -1
):
    """Returns favorite dish from
    `all_dishes` for `user_id`
    within `since_sec`, or any time
    if -1.

    Args:
        user_id (int): The ID of the
            user.
        all_dishes (Dishes): The
            collection of all
            dishes.
        since_sec (int, optional):
            Maximum age of dishes
            considered. If -1 is
            provided, considers
            dishes of any age.
            Defaults to -1.

    Returns:
        Dish: The user’s favorite
        dish.
    """
    ...
```

Bad: Adding type annotations, but keeping all the other crap:

```python
# Bad
def favorite_dish(
    user_id: int,
    all_dishes: Dishes,
    since_sec: int = -1,
) -> Dish:
    """Returns favorite dish for
    `user_id` from `all_dishes`
    within `since_sec`, or any time
    if -1.

    Args:
        user_id: The ID of the user.
        all_dishes: The collection
            of all dishes.
        since_sec: Maximum age of
            dishes considered. If
            -1 is provided,
            considers dishes of any
            age. Defaults to -1.

    Returns:
        Dish: The user’s favorite
            dish.
    """
    ...
```

Good: what if we just wrote this:

```python
# Good
def favorite_dish(
    user_id: int,
    all_dishes: Dishes,
    since_sec: int = -1,
) -> Dish:
    """Returns favorite dish within
    `since_sec`, or any time if
    -1."""
    ...
```

This example is simple enough that you can probably get away with no comment. But consider some real code that I wrote recently:

```python
# Good luck figuring what this does
# without reading the code.
def preprocess(
    path: str
) -> List[str]:
    ...

# Good luck figuring out what this
# returns without reading the code.
def item_to_id_pieces(
    item: Dict[str, Any],
    side: str,
) -> Tuple[str, int, int, int, int]:
    ...
```

**Why?** All code is a burden, and comments are doubly so, because they can silently go out of date. This is especially true when writing code solo, and you have little incentive to keep comments up-to-date. The main burden for me was that when I would start a function, I would sometimes spend as much time writing the docstring as I did the code itself. Even worse, when I would change a function four or five times, I would have to bookkeep the docstring every time.

Eventually, I realized that what I really wanted from docstrings were types, and a short summary. Having type annotations that are actually checked (e.g., by mypy) keeps them up-to-date. For a while I considered the short summary optional. But I found that, inevitably, I would appreciate them when I came back to the code base after a break. I try to keep the summary so that it fits on one line as an extra terseness challenge for myself. While difficult, I find this is often surprisingly possible. Doing this helps if your editor supports tooltips, or while skimming code.

There’s a pattern in writing code for projects in grad school:

1. **project development**: comments not needed, all state in your brain
2. **submission**: not reading your code for months, working on other things
3. **revision or publishing code**: OMG, what the hell was all this, how does anything work

These short function summaries really help with phase 3.

One more thing: I also think file-level summaries are really helpful. Having a one-sentence summary at the top of each file helps immensely when coming back to a project. I also have a `scripts/` directory with a dozen or two scripts which munge data in similar but different ways.

## Prefer Pure Functions with Minimal Interfaces

Instead of using `class`es and methods, or functions that take class instances:

```python
# class with method
class Thing(object):
    state_a: str
    state_b: int
    state_c: float
    state_d: List[str]
    state_e: Dict[str, float]
    ...

    def compute(self) -> int:
        ...

# function that takes an instance
def compute(t: Thing) -> int:
    ...
```

... I try to use functions that specify only the state they need:

```python
def compute(
    state_a: str,
    state_c: float
) -> int:
    ...
```

I found myself doing this for two reasons:

1. If a function is an object’s method, it’s hard to reuse the function elsewhere. If you discover you want to reuse the logic, you must make a big ol’ object to call it on.

2. If a function accepts a big object with lots of state as an argument, it’s hard to use that function elsewhere because it’s hard to figure out what subset of the object’s state is actually required.

In other words, in service of reusing and changing code, I found it easiest to keep functions out of objects, and keep the APIs as slim as possible.

The fact that I need to reuse and change code all the time is probably because of the kind of programming I’m doing with Python. I never really know the whole scope of the project, and the project direction changes often. Those needs seem to fit better with separate functions that only require the state they need.

I’d like to note here that I think I’m just rediscovering what functional programmers and API designers have written books about for decades.

### Case Study: `args`

In the pytorch code I read a lot these days, there is an extremely annoying pattern I encounter constantly:

```python
def do_something(args):
    ...
```

Here, `args` is something[^5] created by an `ArgumentParser` — i.e., command line arguments. This is a legendarily annoying way to write functions if you want anyone else to understand and change your code:

- If you check out machine learning code, the number of command line arguments is INSANE. We’re talking **multiple dozens** of command line arguments. Which subset does this function _actually_ need? Who knows! You have to read the code.

- Even worse, people mutate this `args` object throughout the program. So `args` isn’t really just what the user provided on the command line, it’s also anything else they’ve decided to stick into it at any point in the program before this function call.

These two factors make a function that takes args a HUGE interface, which by default contains dozens of things, whose actual values are hard to trace down.

On the flip side, I get why people do it. Just having `args` makes it really easy to plumb a massive amount of global state all throughout the program. And it makes changing APIs easy... because you don't actually change the API, you just cram more stuff into `args`.

There’s a balance to be had here. If you’re using more than three or four things from `args`, sure, just pass the whole thing in. But just one or two? Help your dear readers and send in those arguments directly.

## Write Less Code

This is hard to keep in mind, but it’s the most crucial bit. All code is a burden. The less code the better.

- Use tiny shell scripts whenever possible. You get programs that are written in C and by default run in parallel (or is it concurrently?).

- Use battle-tested libraries whenever possible.

- Learn the libraries you must use. After years of dragging my feet, I finally went beyond an absolute beginner’s level of Pandas, and now my data manipulation scripts are 25% as much code and run about 100x faster.

## Summary

You will have as little code as possible, with reasonable interfaces, less mutation, concise comments, and skimmable imports.

## Sparking Joy with Python

Like a tiny, old apartment, Python may not immediately spark joy. You have to work at it. I hope these posts help you in some little way. And I wish you joy.

[^1]:	Even The Hitchhiker's Guide to Python [mucks with sys.path](https://docs.python-guide.org/writing/structure/).

[^2]:	I have nothing more to say on this topic.

[^3]:	It turns out that basically every guide is written assuming you're logging while running with `python ice/data.py` and not `python -m ice.data`, and if you try to configure different loggers per module you're going to be very confused trying to get a robust logging system set up. At least I have been thoroughly confused by this twice.

[^4]:	I feel a bit guilty about my attitude here. Wouldn't the right thing to do be to really learn how Python packages and modules work, and be able to build your own project structure and import scheme from first principles? Well, maybe... and yet... and yet... I just can't bring myself to care about this more than I care about building stuff.

[^5]:	Specifically, it's a `Namespace` object.
