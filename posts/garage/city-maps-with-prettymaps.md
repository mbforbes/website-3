---
title: City maps with prettymaps
date: 2022-05-02
updated: 2022-05-10
tags: devlog
---

This is my devlog for working with the [prettymaps library](https://github.com/marceloprates/prettymaps/) to try to generate maps for cities that I visit. I ran into a lot of problems with water and train lines. As yet, unresolved.

## Styling for Multiple Cities

The prettymaps gallery has many beautiful maps

TODO: embed

However, there's a drawback with many of these styles: after the initial visual impression has worn off, there isn't much that actually distinguishes one map from another. E.g., the Barcelona map is largely just a grid.

If using a single map style for multiple cities which renders a small chunk of each city, it will be hard to tell them apart.

We can alleviate this by handcrafting beautiful maps for each city. This would be the best-looking solution, but---for me---it's not worth the time to do that for every city that I visit. (Plus, it'd take significant practice to get close to as good as those.)

My plan to alleviate this:

1. Use full city boundaries rather than tiny circle/square snippets. This will make each map unique because we'll see the shape of each city.

2. Use a palette themed by each country. (TBD whether this one will work out.)

TODO: show lisbon snippet vs whole thing


## Faster Feedback

The iteration process is extremely slow out-of-the-box. Running the code takes 2--5 minutes. The time to draw the plot is only 20 seconds.

There is a `cache/` directory that gets filled with files, but strangely, repeated runs aren't any faster.

Fortunately, you can manually save and pass back in the map data, as long as it hasn't changed at all (i.e., you don't want any additional layers). This reduces the iteration time to 20s. Not amazing, given how much there is to tweak, but way better than ~2.5m.


## So Much to Style

Even at 20 seconds per iteration, there is a lot to do.

This is one of those cases where something looks beautiful, and you try to make a tweak, and suddenly everything looks terrible.

TODO: embed grid of trial and error for lisbon


## More Layers

Many areas of the maps are simply blank.

TODO: point to early porto draft w/ empty areas

I think this is because OpenStreetMaps has a bunch of different layers that crop up in different cities. (Also: regional differences in marking? Maybe not.) The existing code samples I've seen only grab a handful.

I actually found it a bit tricky to figure out how to draw more. I was initially just changing the drawing parameters, but then I realized that more layers actually need to be fetched.

The layer names are confusing as well. Tags, rather than being a list of values, are _key: value_ pairs.

What I'm doing now is going through areas of the map that are blank, and clicking around on OpenStreetMap to find out what layers are there, then adding them to the fetching code.

This adds another complication: re-fetching layers means back to extremely slow iteration time, because our layer cache is now invalid.

I sped up iterating on new layers by changing the caching from "exact match" to "fetch any layers that you're missing." This works pretty well, though there was one extra complication: I was often adding tags to existing layers (e.g., adding "meadow" OSM tag to the general "greenery" layer). I just delete layers after they come out of the cache, and then the whole thing gets re-fetched.

> It feels like it'd be so much more efficient to just fetch _everything_, then iterate on selection and drawing. Not sure whether it's worth trying to figure out that depth of code modification...

Each new city had new blank areas that needed to be manually investigated. Hopefully I'll eventually have enough general coverage this won't happen.

Layers that helped:
- meadow
- cemetery
- general land use (residential)
- schools
- railways
- airport strips (taxiways, runways)
- "scrub" lol
- golf courses
- industrial land use
- farmland
- orchards

## Appreciating Modifiable Code

There's some pareto-optimality of both (a) less code, and (b) simple code that makes it easy to understand and modify.

Take two cases I was looking at in the prettymaps lib.

Here's a bad one: a gigantic "one-liner"

```python
streets = unary_union(
    [
        # Dilate streets of each highway type == 'highway' using width 'w'
        MultiLineString(
            streets[
                [highway in value for value in streets[layer]]
                & (streets.geometry.type == "LineString")
            ].geometry.tolist()
            + list(
                reduce(
                    lambda x, y: x + y,
                    [
                        list(lines)
                        for lines in streets[
                            [highway in value for value in streets[layer]]
                            & (streets.geometry.type == "MultiLineString")
                        ].geometry
                    ],
                    [],
                )
            )
        ).buffer(w)
        for highway, w in width.items()
    ]
)
```

Here's a chunk I had a much easier time reading.

```python
# Use backup if provided
if backup is not None:
    layers = backup
# Otherwise, fetch layers
else:
    # (some code omitted)

    # Fetch layers
    layers = {
        layer: get_layer(
            layer, **base_kwargs, **(kwargs if type(kwargs) == dict else {})
        )
        for layer, kwargs in layers.items()
    }

    # Apply transformation to layers (translate & scale)
    layers = transform(layers, x, y, scale_x, scale_y, rotation)

    # Apply postprocessing step to layers
    if postprocessing is not None:
        layers = postprocessing(layers)
```

There's still some things that I'd change about the second segment, the main one being that the `layers` variable is first used as an input argument, then becomes the output data, and it does this at different points in different branches. But, still, the code is super readable and I can relatively quickly make changes.

## Timeouts

When trying to fetch data for Washington, D.C., I repeatedly ran into timeouts trying to fetch the fifth of eleven layers:

```txt
Traceback (most recent call last):
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/urllib3/connectionpool.py", line 449, in _make_request
    six.raise_from(e, None)
  File "<string>", line 3, in raise_from
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/urllib3/connectionpool.py", line 444, in _make_request
    httplib_response = conn.getresponse()
  File "/Users/max/.pyenv/versions/3.10.1/lib/python3.10/http/client.py", line 1374, in getresponse
    response.begin()
  File "/Users/max/.pyenv/versions/3.10.1/lib/python3.10/http/client.py", line 318, in begin
    version, status, reason = self._read_status()
  File "/Users/max/.pyenv/versions/3.10.1/lib/python3.10/http/client.py", line 279, in _read_status
    line = str(self.fp.readline(_MAXLINE + 1), "iso-8859-1")
  File "/Users/max/.pyenv/versions/3.10.1/lib/python3.10/socket.py", line 705, in readinto
    return self._sock.recv_into(b)
TimeoutError: timed out

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/requests/adapters.py", line 440, in send
    resp = conn.urlopen(
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/urllib3/connectionpool.py", line 785, in urlopen
    retries = retries.increment(
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/urllib3/util/retry.py", line 550, in increment
    raise six.reraise(type(error), error, _stacktrace)
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/urllib3/packages/six.py", line 770, in reraise
    raise value
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/urllib3/connectionpool.py", line 703, in urlopen
    httplib_response = self._make_request(
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/urllib3/connectionpool.py", line 451, in _make_request
    self._raise_timeout(err=e, url=url, timeout_value=read_timeout)
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/urllib3/connectionpool.py", line 340, in _raise_timeout
    raise ReadTimeoutError(
urllib3.exceptions.ReadTimeoutError: HTTPConnectionPool(host='overpass-api.de', port=80): Read timed out. (read timeout=180)

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/Users/max/repos/prettymaps/city-boundary.py", line 82, in <module>
    layers = plot(
  File "/Users/max/repos/prettymaps/prettymaps/draw.py", line 245, in plot
    new_output_layers[layer] = get_layer(
  File "/Users/max/repos/prettymaps/prettymaps/fetch.py", line 398, in get_layer
    return get_geometries(**kwargs)
  File "/Users/max/repos/prettymaps/prettymaps/fetch.py", line 188, in get_geometries
    geometries = ox.geometries_from_polygon(
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/osmnx/geometries.py", line 263, in geometries_from_polygon
    response_jsons = downloader._osm_geometries_download(polygon, tags)
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/osmnx/downloader.py", line 493, in _osm_geometries_download
    response_json = overpass_request(data={"data": query_str})
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/osmnx/downloader.py", line 667, in overpass_request
    response = requests.post(url, data=data, timeout=settings.timeout, headers=headers)
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/requests/api.py", line 117, in post
    return request('post', url, data=data, json=json, **kwargs)
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/requests/api.py", line 61, in request
    return session.request(method=method, url=url, **kwargs)
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/requests/sessions.py", line 529, in request
    resp = self.send(prep, **send_kwargs)
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/requests/sessions.py", line 645, in send
    r = adapter.send(request, **kwargs)
  File "/Users/max/.pyenv/versions/prettymaps/lib/python3.10/site-packages/requests/adapters.py", line 532, in send
    raise ReadTimeout(e, request=request)
requests.exceptions.ReadTimeout: HTTPConnectionPool(host='overpass-api.de', port=80): Read timed out. (read timeout=180)
```

Seeing `read timeout=180` reminds me of a rant I read recently, and agree with, how all timeouts should have units on them. (Is that seconds???)

Anyway, checking into the library code, `ox.geometries_from_polygon()` has the following note:

> You can configure the Overpass server timeout, memory allocation, and other custom settings via `ox.config()`.

Here I think `ox` is the import rename convention for `osmnx`. We can check the doc for `ox.config`, which has about a hundred parameters:

```txt
timeout : int
    the timeout interval for the HTTP request and for API to use while running the query
```

Come on, what's it take for a guy to get a unit in here? Anyway, let's double it.

```python
ox.config(timeout=360)
```

This seems to have worked!

## Muting so many warnings

There are a bunch of deprecation warnings from one library's use of another library. This clogs up the output and I'm not going to fix them. I found a great tiny library called `shutup`, where you can

```python
import shutup
shutup.please()
```

... and it does some trickery with python's internal warning mechanism to swallow warnings that come after.

It seems important to do this at the top of a file, _before other libraries are even imported (!)_ for it to work.

## Country Flag Colors

Working on Washington, D.C. The USA's [flag colors](https://www.flagcolorcodes.com/usa) are hilariously called "Old Glory Red" and "Old Glory Blue."

TODO: insert previews of them

This made a decent map

TODO: insert map

... but I wonder if they'd be better a bit softer. I bumped up lightness and saturation

TODO: new colors

These are OK. Might be a bit too bright, even. The map styles in the lib's gallery are a bit more muted, kind of print-like. May be better to stick to that.

Meanwhile, I think I screwed up the z-order so some bigger areas are blotting out others. I can't see them on OSM, but the color is there.

TODO: insert DC-3.

Waaay better.

## No Water

There's a lot of water in Seville that OSM knows about, my mine are coming up dry for some reason.

- Appears no data is in the layer, it gets saved as empty (and re-fetched each time)

- Trying to plot only water gives weird drawing artifacts

- Seriously trying VS Code's python debugger for the first time, getting a ton of stack traces with no known origin in the code but things seem fine? My guess is matplotlib and some kind of "backend" (a matplotlib term) issue.

- There's a hardcoded "coastline" layer name in the code; grabbing that and adding to the plot does nothing. (Update: from searching in attempts to fix this, seems like a more [involved feature](https://github.com/marceloprates/prettymaps/pull/47), including downloading a separate data file. But this doesn't seem like what I want, because it's not about coastline and oceans, it's simple water multipolygons in the map area!)

-   Was able to debug up until polygons w/ "water" tags had their geometries intersected w/ the provided perimeter, then they all became empty. This is weird because (a) I thought we were fetching things inside the perimeter, (b) there are definitely some water polygons fully in the Seville boundary in OSM.

    I tried commenting out that intersection code, but still nothing shows up. So that might mean that the retrieved geometry is actually somehow outside the desired area. Bizarre. Why is only water failing here?

    I tried rendering Seattle, which has a lot of water, and that is mostly working (the lake seems to work, but not the coastline, as expected).

    This is especially weird because all the water in Seville seems broken, even little ponds in parks.

I updated my layers to include more tags, though really only `"water": True` should be necessary.

```python
"water": {
    "tags": {
        "waterway": True,
        "water": True,
        "harbour": True,
        "marina": True,
        "bay": True,
        "river": True,
    },
},
```

Trying to draw a park in Seville...

TODO: insert park

...other weird behavior using the exact same drawing code:

- unlike broader seville, now bits of water do get drawn
- ~also unlike broader seville, now buildings aren't being drawn.~ (Update: The park miraculously (I guess) completely avoids an area with buildings that's fully enclosed by it, so this is actually okay.)

OK, so is this a zoom thing? Something else? I wonder whether I can get a district that has water.

Plotting the larger district that encompasses the park (_Distrito Norte_) also results in no water!

TODO: insert distrito norte

I found [another issue](https://github.com/marceloprates/prettymaps/issues/46) the describes partial water bodies being rendered. It seems as if the issue is my own---it pinpoints the line of code that I was running into, where polygons disappear after being intersected with the perimeter. That might be the buggy aspect, then.

Unfortunately, none of the three alternatives proposed there work for me. _Distrito Norte_ remains waterless.

I can ignore the intersection computation, but I must manually extract geometry objects. The resulting map seems ot have a lot of water, which is awesome, but it's all zoomed way out, and the water is now disconnected from the land.

Introducing radius back does nothing, seemingly; probably more code tweaks needed.

DAMN this issue is spicy.

May have been code changes to examine:

- https://github.com/marceloprates/prettymaps/pull/48
- https://github.com/marceloprates/prettymaps/pull/54


Adding logging. Renaming all `geometry` and `perimeter` vars to track their changes. They change type (Geo DataFrame and kinds of (Multi)Polygon(s)) and projection and contents across mutations.

Seeing things like

```txt
Geometries before projection: 123
Geometries after projection: 123
Geometries after intersection: 123
  points:     0
  lines:      0
  polys:      123
  multipolys: 0
Geometries after grouping: 0
Geometries after union: 0
```

This makes it look like the grouping is a problem, but I think the geometries are empty after intersection.

Looking at the perimeter, it was defined differently than I expected: it was using a point + radius rather than a shape! I think this is based on how I was passing the query in.

What's so bizarre is looking at what was retrieved, even by a reasonable radius that should end up in the computed final perimeter, is then becoming empty. Going to try switching to passing the perimeter in and seeing whether we can go from there. (Check func we call in `draw.py`)

Spent a bunch of time trying to figure out how to meaningfully inspect Polygons. These damn things have too many damn objects inside them, and nothing has a nice string representation! The docs are like oh ya, say you can make them just give a couple numbers like `[1, 2]`, hehe, and then you try to inspect them and they're just like nope it's an object what you want?

```python
# grab a geometry object we'll be working with
>>> g = geometries_retrieved.iloc[2].geometry
# what is it?
>>> g
<shapely.geometry.polygon.Polygon object at 0x137e63940>
# great. what are its, idk, points?
>>> g.coords
NotImplementedError
>>> g.xy
NotImplementedError
# super helpful. So, a couple things that give any kind of data:
>>> g.length
0.10079323200991505
>>> g.bounds
(-6.0302708, 37.4404153, -6.007053, 37.4498529)
# but that's the bounding region. where are the points?
>>> g.envelope
<shapely.geometry.polygon.Polygon object at 0x142367f10>
# great, another polygon?
>>> g.exterior
<shapely.geometry.polygon.LinearRing object at 0x142367eb0>
# ok, another object...
>>> g.exterior.boundary
<shapely.geometry.multipoint.MultiPoint object at 0x137e61b40>
# you have got to be kidding me
# you know what, maybe i'll just go with `length` and `bounds` for now
```

Anyway, regardless, what's happening best I can tell at this point is that things aren't overlapping after the intersection. Via some more recent logging checking `sum(geometries_projected.length > 0)`:

```txt
Non-empty Geometries after projection: 138
Non-empty Geometries after intersection: 0
```

Plus keeping all and drawing, way off to right.

- Also, have been looking at [this diff](https://github.com/marceloprates/prettymaps/commit/5930ba70ad4f2a6472b3baa4fd3fb4b628ce40e4
), which both erased some fixes from a previous commit and "simplified" some operations with different geometry types that I am suspicious could be buggy.

Giving up. Water seems to work elsewhere. I just have no idea why Seville is failing. It's gonna be dry.

## Unicode troubles

Today I discovered `ó` and `ó` are not the same character because my save path logic was failing.

I checked out this [Unicode Inspector](https://apps.timwhitlock.info/unicode/inspect?s=%C3%B3o%CC%81) to see that:

TODO: insert from Desktop

As cool as I felt having non-ASCII characters in my file paths, looks like it's going to be more trouble than it's worth if I can't type them consistently.

There's a Python module I remember using in my text slinging days that finds the closest ASCII representation of a string. It's called [`Unidecode`](https://pypi.org/project/Unidecode/). So useful. One of those situations where

- **Linguistics:** Noooo, those characters aren't even the same thing at all, it doesn't make any sense to swap vowels just so you can write them incorrectly in your own language's alphabet

- **Computers:** Sorry, gotta go brrrrr

## Railways and airplane runways / taxiways gone

I can't get them back. I'm adding all the same tags, in all kinds of combinations and drawing styles, and they just aren't showing up.

Man, this is one of the most frustrating code libraries I've used in recent memory.

## Things always take much longer than they seem

This is important to remember when planning your own tasks, but it's especially important to remember when appreciating the work of others.

For example, I'm basically replicating an existing style, of an existing library, and just adapting it slightly to my needs. And it still took a lot of work, with so many little problems cropping up!

When things actually go as quickly as they "ought to," it's kind of shocking (and delightful).
