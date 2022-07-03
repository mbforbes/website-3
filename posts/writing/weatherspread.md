---
title: weatherspread
subtitle: Historical temperature distributions
date: 2022-07-03
tags: project
image: /assets/posts/weatherspread/weatherspread.png
---

<object id="cover" type="image/svg+xml" data="{{ "/assets/posts/weatherspread/weatherspread.svg" | url }}"></object>

## Remember the Weather

When you're figuring out where to go, or when to go there, remember that a great shadow force will shape your experience.

The weather.

Say you're thinking of visiting Belgrade, Serbia in August. What might the weather be like?

Many weeks or months out, there's no way you can get a reliable **forecast**.

**Wikipedia** gives great historical summaries of climate data, so you might check that out:

![]({{ "/assets/posts/weatherspread/belgrade-wiki.jpg" | url }})

<p class="figcaption">
Source: <a href="https://en.wikipedia.org/wiki/Belgrade#Climate">Wikipedia</a>
</p>

You probably want to ignore record highs, because that doesn't tell you about anything other than a freak heat wave. So you might look at the _average high_ or _daily mean_ temperatures.

Let's see, August says the average high is 85.5℉. That's not so bad! The daily mean (74.8℉) isn't bad either.

But wait, the average is missing some key information: **the variance**. As in: what are the odds it's actually much hotter (or much colder) than the average?

## Check the Spread

Since variances are probably hard for most people to reason about, and we're great at eyeballing data (especially if it's colorful), why don't we just look at the daily highs for our month in question in a recent year?

![]({{ "/assets/posts/weatherspread/belgrade-1.jpg" | url }})

Here I picked colors according to my own preferred temperature range: anything above 90℉ is red, anything 69℉ or lower is blue, and all the "nice and warm" temps (70s & 80s ℉) are in yellow.

Even better, why don't we look at the last three years?

![]({{ "/assets/posts/weatherspread/belgrade-3.jpg" | url }})

Ahh, fantastic! So it looks like there's a hance we'd have a good chunk of warm weather (albeit with some rain: the small bars extending below). But there's also a chance we could hit a week of 90s or even 100℉ weather! It's a risk.

If we might want to move our trip a month or two out, we can plot multiple months and compare them.

![]({{ "/assets/posts/weatherspread/belgrade.jpg" | url }})

<p class="figcaption">
My takeaway from doing this for a dozen places is that September is frustratingly nice everywhere.
</p>

Compare with, for example, Tel Aviv, which hovers right around 90℉ and has shockingly little variance.

![]({{ "/assets/posts/weatherspread/tel-aviv.jpg" | url }})

Or, if you want somewhere cool:

![]({{ "/assets/posts/weatherspread/edinburgh.jpg" | url }})

<p class="figcaption">
My current free data sources don't have reliable precipitation, otherwise I'd guess we'd see some rain in good old Edinburgh.
</p>

## `weatherspread`

I'm calling the tool I built to fetch historical weather data and plot the spreads `weatherspread`. It's open source, so feel free to check it out and use it.

{% include "programming-language-tooltips.njk" %}
{% set item = collections.software | selectAttrEquals(["data", "title"], "weatherspread") | first %}
{% include "software-long.njk" %}

Also, if you know good historical weather API with a high free tier, let me know! The best I found was Visual Crossing, but I hit their 1k requests / day limit very fast (each day counts as one request). Right now, the app is powered by [Meteostat](https://dev.meteostat.net/python/), along with [Geopy](https://geopy.readthedocs.io/en/stable/#nominatim)'s interface to [Nominatim](https://nominatim.org/) for looking up the (lat, lon) of place names.

<script src="{{ "/assets/lib/anime-3.2.1.min.js" | url }}"></script>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('cover').addEventListener("load", function() {
            const diagram = document.getElementById('cover').contentDocument;
            // const spacing = 182;
            const duration = 1000;
            anime({
                targets: [...diagram.querySelectorAll("#weatherspread *")],
                // keyframes: [
                //     {translateY: spacing},
                //     {translateY: spacing*2},
                //     {translateY: 0},
                // ],
                translateY: 40,
                // easing: 'easeOutElastic(1, .8)',
                duration: duration,
                direction: 'alternate',
                // delay: 500,
                delay: anime.stagger(50),
                loop: true,
            });
        });
    });
</script>
