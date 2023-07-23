// This pre-populates 3 caches: (1) image size, (2) thumbhash, and (3) inline
// markdown 11tyimg resizes. This should run before any build / serve step.
//
// This exists because markdown-it can't handle async calls. Thumbhash and
// EleventyImg are both async, which means we couldn't get thumbhashes or
// resizes for inline images.
//
// (Also did image sizes before depending on EleventyImg; could remove that
// now but 🤷‍♂️.)
//
// We run this once before any eleventy code to to precompute all the
// thumbhashes and do the EleventyImg resizing we need. Eleventy has a
// before-build event, but because the .eleventy.js file is completely reloaded
// on every rebuild, we'd run any code there every reload rather than just once.
//
// For non-markdown-it images (i.e., from shortcodes), we still compute (and
// cache) sizes and thumbhashes, but let EleventyImg resizes happen during the
// Eleventy build.
//
// The caveat with this approach is that images that change during the build
// will be incorrect. Here is a chart to show what happens if images change
// *during the build:* (X = wrong/missing, O = correct/OK)

//                     inline image    shortcode image
// thumbhash, new           X               O
// thumbhash, changed       X               X
// size, new                X               O
// size, changed            X               X
// srcset/sizes, new        X               O
// srcset/sizes, changed    X               O

// Any missing thumbhash, size, or srcset/sizes will be skipped, but incorrect
// values will be used.

const fg = require('fast-glob');
const cliProgress = require('cli-progress');
const { isSVG, serializeMapSync, deserializeMap, getImageSize, loadAndHashImage, TH_CACHE_PATH, SIZE_CACHE_PATH } = require("./common.js");
const { preprocessInlineMDEleventyImg } = require("./prerun-eleventy-img-inline.js")

let paths = fg.sync("assets/**/*.{jpg,jpeg,png,svg,gif}")
// Should match (does):
// `find assets -type f \( -iname \*.jpg -o -iname \*.jpeg -o -iname \*.png -o -iname \*.svg -o -iname \*.gif \) | wc -l`
console.log(`Found ${paths.length} images`);

const thumbhashCache = deserializeMap(TH_CACHE_PATH);
const sizeCache = deserializeMap(SIZE_CACHE_PATH);

console.log(`Populating ${paths.length - sizeCache.size} remaining sizes...`)
for (p of paths) {
    getImageSize(sizeCache, p);
}

// We skip SVGs because they can crash the thumbhash library (see
// loadAndHashImage() for details). Pre-checking cache is just for
// reporting & progress bar.
let thWorklist = [];
for (p of paths) {
    if (!isSVG(p) && !thumbhashCache.has(p)) {
        thWorklist.push(p);
    }
}
// Hack to get async without making this a module and fixing all the imports.
(async () => {
    try {
        console.log(`Populating ${thWorklist.length} remaining thumbhashes...`)
        const bar = new cliProgress.SingleBar({ etaBuffer: 10000 }, cliProgress.Presets.shades_classic);
        bar.start(thWorklist.length, 0);
        // We're just calling this synchronously. It's slow but fine.
        for (p of thWorklist) {
            await loadAndHashImage(thumbhashCache, p);
            bar.increment();
        }
        bar.stop();
        serializeMapSync(thumbhashCache, TH_CACHE_PATH);
        serializeMapSync(sizeCache, SIZE_CACHE_PATH);

        // huh does all my code just have to go here now?
        preprocessInlineMDEleventyImg();
    } catch (error) {
        console.error('Error:', error);
    }
})();
