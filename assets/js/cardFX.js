// (1) Card flipping
// -----------------

// NOTE: Keep in sync w/ nFlip in card-layout.njk. (Could have kept in there so
// value would be nunjucks-injected, but meh.)
const nFlip = 16;

/**
 * Set to be called in layout-load.js (`layoutData`), called from
 * layout-switching.js in `eval(code)`.
 */
function unflipCards() {
    // This can happen immediately as it's mean to be called when
    // cards are offscreen.
    let cardList = document.querySelectorAll('.cardInner');
    let maxFlips = nFlip;
    let stopIdx = Math.min(maxFlips, cardList.length);
    for (let i = 0; i < stopIdx; i++) {
        cardList[i].classList.remove('flipped');
    }
}

/**
 * Set to be called in layout-load.js (`layoutData`), called from
 * layout-switching.js in `eval(code)`.
 */
function flipCards() {
    // Add 'flipped' class to first {{ nFlip }} cards.
    //
    // Can't reliably detect scroll position
    //
    //     window.scrollY || document.documentElement.scrollTop
    //
    // ... or card visibility
    //
    //     cardList[cardToCheck].getBoundingClientRect().bottom
    //
    // ... due to both being bugged in Safari. (For scroll position,
    // Safari constantly reports 0px; for element (card) location,
    // Safari reports pixels from top of document, rather than relative
    // to viewport.)
    //
    // So, rather than trying to flip cards based on what's visible, we
    // just always flip the first N cards (works in tandem w/ CSS above).
    let cardList = document.querySelectorAll('.cardInner');
    let maxFlips = nFlip;
    let stopIdx = Math.min(maxFlips, cardList.length);
    let cardListIndex = 0;
    let cardListInterval = setInterval(function () {
        cardList[cardListIndex].classList.add('flipped');
        cardListIndex++;
        if (cardListIndex >= stopIdx) {
            clearInterval(cardListInterval);
        }
    }, 50);
}

// (2) Tooltips
// -----------------

// Add tooltips to stamps.
const categories = [
    // NOTE: keep this list in sync with "primaryCollection" filter in .eleventy.js
    "travel",
    "blog",
    "garage",
    "sketch",
    "microblog",
    "project",
    "writing",
    "software",
];
for (let cat of categories) {
    // console.log(`Adding tooltips to .stamp-${cat}`)
    let display = cat.charAt(0).toUpperCase() + cat.slice(1);
    tippy(`.stamp-${cat}`, {
        content: `${display}`,
        theme: 'stamp'
    });
}

// (3) Glow (and rotate)
// ---------------------

// cache vars
let cardfxCurBounds;
let cardfxLastMouseX = -1;
let cardfxLastMouseY = -1;

function glowAndRotate(card, e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // filter same coords to do less work
    if (mouseX == cardfxLastMouseX && cardfxLastMouseY == mouseY) {
        // console.log("Skipping");
        return;
    }
    cardfxLastMouseX = mouseX;
    cardfxLastMouseY = mouseY;
    // console.log(e);

    const leftX = mouseX - cardfxCurBounds.x;
    const topY = mouseY - cardfxCurBounds.y;
    const center = {
        x: leftX - cardfxCurBounds.width / 2,
        y: topY - cardfxCurBounds.height / 2
    }

    card.querySelector('.glow').style.backgroundImage = `
        radial-gradient(
            circle at
            ${center.x * 2 + cardfxCurBounds.width / 2}px
            ${center.y * 2 + cardfxCurBounds.height / 2}px,
            #ffffff22,
            #0000000f
        )
    `;

    // IIRC, this interacted poorly with another feature. It may have been the
    // flipping.
    if (false) {
        const distance = Math.sqrt(center.x ** 2 + center.y ** 2);
        card.style.transform = `
            scale3d(1.07, 1.07, 1.07)
            rotate3d(
            ${center.y / 100},
            ${-center.x / 100},
            0,
            ${Math.log(distance) * 2}deg
        )
        `;
    }
}

// Attach listeners to all cards so they can glowAndRotate().
document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
        // console.log("Adding")
        cardfxCurBounds = card.getBoundingClientRect();
        card.addEventListener('mousemove', glowAndRotate.bind(null, card));
    });

    card.addEventListener('mouseleave', () => {
        // console.log("Removing")
        card.removeEventListener('mousemove', glowAndRotate.bind(null, card));
        card.style.transform = '';
        // card.style.background = '';
    });
})
