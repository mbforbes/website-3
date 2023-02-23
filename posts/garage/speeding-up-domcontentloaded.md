---
title: Speeding up DOMContentLoaded
date: 2023-02-23
---

Start: 14.9s on "Fast 3G" throttling

- &rarr; 5.41s: Replacing big non-minified JS library with minified version

- &rarr; 1.91s: Making all scripts `async`

    - But now the page is broken because they have dependencies! E.g., one script has to depend on others to load first.

    - Can switch these to `defer`. This is very tempting. Then, the scripts run after the document is parsed, but before `DOMContentLoaded` is fired. This means that the page becomes interactive early---much before 5.41s---but the DOMContentLoaded time goes back up to 5.41s. This would mostly solve the problem, but it would make measuring speed more difficult, as then there would be no obvious number for when the page is ready. Furthermore, it seems that there are potentially problems w/ [Firefox not executing fully in-order](https://stackoverflow.com/questions/32413279/defer-scripts-and-execution-order-on-browsers), though this may be fixed, since [MDN says they will be](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-defer).

    - Tried `async` issues for now to see whether this is viable:
        - bundled two libs together (leaflet and leaflet-curve)

        - using `async` and `Promise`, set up a flow to check each of whether the DOM is ready, then whether the each library is loaded.

        - but then it turns out stamen also depends on leaflet. bundled that too.

At this point w/ async, there's still bugs with callbacks not being triggered. It could be that the `onload` even isn't what I want, and I need to listen to some other event (though I don't think `<script>` has others by default?) or make my own. Here's a snippet:

```js
async function makeDOMPromise() {
    return new Promise((resolve, reject) => {
        if (document.readyState == "loading") {
            console.log("This before DOM.")
            document.addEventListener("DOMContentLoaded", () => {
                console.log("DOM resolving");
                resolve();
            });
        } else {
            console.log("This after DOM.")
            resolve();
        }
    });
}

async function makeLibPromise(readyFn, scriptID, name) {
    return new Promise((resolve, reject) => {
        if (readyFn) {
            console.log("This before", name)
            document.getElementById(scriptID).onload = () => {
                console.log(name, "resolving)
                resolve();
            };
        } else {
            console.log("This after", name)
            resolve();
        }
    });
};

async function waitForLoaded() {
    await makeDOMPromise();
    await makeLibPromise(() => { typeof L === "undefined" }, "scriptLeaflet", "leaflet");
    await makeLibPromise(() => { typeof anime === "undefined" }, "scriptAnime", "anime");
    console.log("Done")
    main();
}

waitForLoaded();
```

I'll see orders like:

```txt
This after DOM.
This before leaflet
```

or

```txt
This after DOM.
This before leaflet
leaflet resolving
This before anime
```

In other words, we don't see the `onload` event from at least one of the scripts. The strangest thing, is this bug _always_ happens if the developer console is closed, and _never_ happens if it's open and _Disable cache_ is checked.

Regardless, this is a massive effort overhead already if things could be resolved with `defer`, so I'm going to try that and just download Firefox to test that things do run.
