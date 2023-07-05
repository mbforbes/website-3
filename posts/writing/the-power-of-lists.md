---
title: The Power of Lists
subtitle: Complete Enumeration
date: 2021-09-13
updated: 2022-11-27
tags: design
image: /assets/posts/power-of-lists/power-of-lists-header.jpg
---

![](/assets/posts/power-of-lists/power-of-lists-header.jpg)

I often find it extremely helpful when people simply enumerate all of the options for something.

Here are some examples.


## Reserved Keywords in TypeScript

In [this GitHub issue](https://github.com/microsoft/TypeScript/issues/2536), somebody asked what the list of reserved keywords in TypeScript were.

As a reply, someone simply posted a list:

![](/assets/posts/power-of-lists/ts-reserved-keywords.jpg)

I have used this list many times.


## Grimgrains Ingredients and Recipes

[Grimgrains](https://grimgrains.com/), the Hundred Rabbits' cooking blog, opens with a complete list of ingredients, followed by a complete list of recipes.

![](/assets/posts/power-of-lists/grimgrains-ingredients.jpg)

![](/assets/posts/power-of-lists/grimgrains-recipes.jpg)


## PyTorch Installation and Tensor Types

I've always been a huge fan of [PyTorch's installation instructions](https://pytorch.org/). It concisely but completely enumerates the set of installations. I never mind clicking through.

![](/assets/posts/power-of-lists/pytorch-install.jpg)

The list of tensor types available in PyTorch has exploded a bit---right now it still says there are ten tensor types, but by my counting, the table has seventeen rows---but I still like that they're all there in one place.

![](/assets/posts/power-of-lists/pytorch-tensors.jpg)


## Matplotlib Color Palettes

While ordinarily a bane of my existence,[^graphing] Matplotlib's documentation shines on the page where they list---and render---all of the color palettes they have in the library.

[^graphing]: No shade on Matplotlib. You can tell it's trying really hard, and I think graph-making is just actually really complicated to program.

![](/assets/posts/power-of-lists/matplotlib-colors.jpg)


## Tachyons Components and Colors

{% import "cards.njk" as cards %}
{{ cards.stub() }}

## Missing: `pandas.Series.agg`

This is a case where I wish there was a list, but there isn't.

The [documentation for `pandas.Series.add`](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.agg.html) says you can pass names of functions, but it's not obvious which ones are valid. Can they live in the local namespace? Can they be builtins? Should they exist on the `pandas.Series` object?
