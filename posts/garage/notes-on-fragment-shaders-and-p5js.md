---
title: Notes on fragment shaders and p5.js
date: 2021-06-27
---

## `createGraphics()` makes a new `<canvas>`

I thought I had a bug with `resizeCanvas()` because a bunch of extra `<canvas>`es were showing up down in the DOM. Turns out `createGraphics()` makes a new `<canvas>` with `display: none` CSS.

I like this. It is a clever and natural way for them to implement a drawable but hidden graphics object on the web.

For fun, I deleted the `display: none` in the developer console, and there it is, just like you'd expect. This would be a nice way to get a debugger view if the display size wasn't locked to the graphics object's size. Or wait...

- **Question:** Can the canvas be displayed smaller---and repositioned, which I assume is trivial---without breaking its underling pixel space for p5.js? I have a hunch this might be possible since in the three.js experiments, there was some kind of internal:display pixel mapping you could do to account for different device pixel densities. If so, that would be cool, because I'm literally building my own mini view of the graphics objects right now.

- **Question:** Would this (displaying the underlying graphics objects) be more efficient than explicitly rendering them separately? Maybe this wouldn't matter at all.

## Rendering to `WEBGL` puts you in "3D Mode"

Huh. I think this was unexpected because pixi.js, which is a 2D rendering engine, is WebGL-first.

## In "3D Mode," the screen origin (0,0) is center instead of top-left

So well OK

## References

-   https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5

    This describes the coordinate system shift, and how to change it back. It looks like WebGL is a pretty significant change for p5.js, which surprises me, but only because I know nothing about the internals. I guess I am probably spoiled by pixi.js's "WebGL first, seamless Canvas fallback." Which, wait, since a `<canvas>` element is used for both backends... means I'm definitely not understanding the details yet.

- https://thebookofshaders.com/

- http://openglbook.com/

- https://www.shaderific.com/glsl-functions

-   https://github.com/mattdesl/lwjgl-basics/wiki/ShaderLesson5

    separable gaussian blur
