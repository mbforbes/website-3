// This pre-populates image size and thumbhash caches. This should run before
// any build / serve step.
//
// The reason this exists is that thumbhash is async, it probably should stay
// async[0], and markdown-it can't handle async calls, which means we couldn't
// get thumbhashes for inline images. Having this run once before any eleventy
// code means we should be able to precompute all the thumbhashes we need.
// Eleventy has a before-build event, but because the .eleventy.js file is
// completely reloaded on every rebuild, we'd run any code there every reload
// rather than just once.
//
// For all non-markdown-it situations, we still compute (and cache) thumbhashes
// during the Eleventy build. Though it just actually do that much now unless
// images are added during the watch/build/serve loop.
//
// [0] Perhaps ironically, we're calling it synchronously here.

const fg = require('fast-glob');
const cliProgress = require('cli-progress');
const { isSVG, serializeMap, deserializeMap, getImageSize, loadAndHashImage, TH_CACHE_PATH, SIZE_CACHE_PATH } = require("./common.js");


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
        serializeMap(thumbhashCache, TH_CACHE_PATH);
        serializeMap(sizeCache, SIZE_CACHE_PATH);
    } catch (error) {
        console.error('Error:', error);
    }
})();
