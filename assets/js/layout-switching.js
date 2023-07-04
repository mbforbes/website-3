// Code handling layout switching. The deferred yin to layout-load.js (executed
// during page loading) yang.
//
// Variables used from layout-load.js:
// - layoutData
// - layoutKey
// - startLayout

// function that does the swapping
function swapTo(nextLayout) {
    // NOTE: the layout elements themselves are hidden/shown via CSS.
    // (this is opposed to, e.g., adding/removing "dn" classes.)
    for (let [layout, button, _, code] of layoutData) {
        let next = layout == nextLayout;
        let buttonEl = document.getElementById(button);
        if (next) {
            buttonEl.classList.add("active");
            eval(code);
        } else {
            buttonEl.classList.remove("active");
        }
    }
    window.localStorage.setItem(layoutKey, nextLayout);
    // NOTE: next action also done in layout-load.js.
    document.documentElement.setAttribute('data-layout', nextLayout);
}

// hook up button event listeners and tooltips
for (let [layout, button, layoutName, _] of layoutData) {
    document.getElementById(button).onmousedown = () => swapTo(layout);
    tippy(`#${button}`, {
        content: layoutName,
        theme: "light"
    });
}

// Executed immediately on load:

// reveal the buttons
let bh = document.getElementById("layout-button-holder");
bh.classList.remove("dn");
bh.classList.add("flex");

// layout-load.js does initial setting on page load, but here we do the heavier
// stuff.
swapTo(startLayout);
