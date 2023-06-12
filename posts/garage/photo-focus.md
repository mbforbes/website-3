---
title: Focus
date: 2023-06-10
series: Photo Notebook
---

The yin to aperture's yang, focusing is the only other stylistic thing I must do consciously now that not everything is always in focus.^[I also now have to constantly twist my [exposure](/garage/photo-exposure/) knob to make sure bright areas aren't over-exposed.]

Right now I think of focus as being purely a function of distance from camera to a plane in front of it. I am guessing that the true mechanics are more complex, involving (a) true distance from camera, (b) optical effects that change around the borders, or others.

## Case study: Column & Shrubs

I saw some shrubs peeking out from a labyrinth of rock, concrete, and tiles in Osaka. I wanted to take a photo that would emphasize the contrast between them, but I wasn't sure what to focus on. My main candidates were the shrubs and the column. I took one of each.^[Both are cropped to nearly the same size. The crops aren't exactly the same because I haven't figured out how to easily do that yet.]

{% img2 "/assets/garage/photo-notebook/focus-column.moz80.jpg", {fullWidth: false} %}

<p class="figcaption">Column focus [f1.7]</p>

{% img2 "/assets/garage/photo-notebook/focus-shrubs.moz80.jpg", {fullWidth: false} %}

<p class="figcaption">Shrub focus [f1.7]</p>

I anticipated liking the column-focused one more, but now that I've looked at both, I like the shrub-focused photo better.

Another interesting factor that I hadn't anticipated is the photo's crop and display size interacts with the perception of focus.

## Case study: Shrub Focus Crop

Displayed at the full size of my laptop monitor,^[My laptop screen isn't huge. Apple says it's 2560 × 1600. For websites, it reports itself as 1680 x 1050 with a pixel ratio of 2, which would imply 3360 x 2100. So IDK really what's going on.] I like the shrub photo. Here it is displayed at a large size (depending on your screen).

{% img "/assets/garage/photo-notebook/focus-shrubs-large.moz80.jpg" %}

<p class="figcaption">Large size, shrub focus clearer [f1.7]</p>

However, shrunken down, I like it less. To my eye right now, the focused area seems blurry.

{% img {path: "/assets/garage/photo-notebook/focus-shrubs.moz80.jpg"}, false, false %}

<p class="figcaption">Small size, shrubs seem blurry [f1.7]</p>

I wonder whether, at a smaller resolution, there simply aren't enough pixels to display the in-focus section crisply.

I explored this exhaustively in [Crop: Cropping Limits](/garage/photo-crop/#cropping-limits). Here's the at-width (2x pixel density) crop for comparison:

{% img {path: "/assets/garage/photo-notebook/focus-shrubs-166mm-tw.moz80.jpg"}, false, false %}

<p class="figcaption">At "166mm" crop, this should display pixel-for-pixel on a 2x density screen. [f1.7]</p>

I think this looks crisper. This means crop, focus, and display size do interact. This is something I've never had to consider.

One thing I noticed when I was cropping was that the shrubs aren't in the exact center of the photo. I'm assuming I either manually focused on them, or targeted them with autofocus. But I might not have, in which case one of the walls behind them might be the focus point of the photo. It's funny I can't easily tell, and brings up the next section.

## Where Did I Focus?

One surprisingly challenging thing to determine after the fact: where is the photo focused? Especially for shallow-DOF photos that are capturing a lot of distance (down a street; city skyline), it's often challenging to see what range is in-focus and what isn't. I don't think this information is displayed in the detailed overlay in Apple Photos or Photomator. I guess because photos lack depth information it'd be nontrivial to render on the photo anyway. I wonder whether the focus setting has a digital representation, and whether it's saved and ever surfaced. Maybe it wouldn't be useful because it couldn't easily be displayed.

Another line of thought: the camera is doing some edge-detection algorithm during manual focus to help show what is in focus (with red overlays). Could this algorithm be run after-the-fact on your photo to try to show what part is focused?
