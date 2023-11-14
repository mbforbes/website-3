const { DateTime } = require("luxon");
const util = require("util");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItFootnote = require("markdown-it-footnote");
const markdownItReplacements = require('markdown-it-replacements');
const readingTime = require('eleventy-plugin-reading-time');
const Image = require("@11ty/eleventy-img");
const { EleventyRenderPlugin } = require("@11ty/eleventy");

// Local code! Wow I'm writing a lot of code lol.
const {
    isSVG, wantWidths, getLocalPath, serializeMapAsync, deserializeMap,
    getImageSize, loadAndHashImage, TH_CACHE_PATH, SIZE_CACHE_PATH,
    INLINE_11TYIMG_CACHE_PATH,
} = require("./common.js");

/**
 * localPath (str) --> binary thumbhash (Uint8Array)
 */
const thumbhashCache = deserializeMap(TH_CACHE_PATH);
let thumbhashCacheLastDiskSize = thumbhashCache.size;

/**
 * localPath (str) --> [width, height] (number[])
 */
const sizeCache = deserializeMap(SIZE_CACHE_PATH);
let sizeCacheLastDiskSize = sizeCache.size;

/**
 * localPath (str) --> {format: spec[]}
 */
const inline11tyImgCache = deserializeMap(INLINE_11TYIMG_CACHE_PATH);

/**
 * For markdown inline images only: returns EleventyImg info only if it's
 * been preprocessed (via build-image-cache.js /
 * prerun-eleventy-img-inline.js).
 *
 * @param {string} path
 * @returns {[string|null, string|null]} [srcset, sizes], or [null, null] if
 * not in cache
 */
function getInlineSrcsetSizes(localPath) {
    if (!inline11tyImgCache.has(localPath)) {
        return [null, null];
    }

    let metadata = inline11tyImgCache.get(localPath);
    let fmt = formatKey(localPath);
    let srcSet = metadata[fmt].map(m => m.srcset).join(", ");
    let sizes = "(max-width: 30em) 100vw, (max-width: 704px) 100vw, 704px";
    return [srcSet, sizes];
}

/**
 * Custom md lib. Made to preserve raw (HTML) blocks from being markdown parsed.
 *
 * Takes markdown-it library during initialization. Has three methods: render,
 * set, and disable. set and disable get passed through to markdown-it. render
 * first grabs raw blocks and replaces with placeholders, then calls
 * markdown-it's render, then puts raw content back in.
 */
class CustomMDLib {
    constructor(md) {
        this.md = md;
    }

    render(content) {
        const rawBlockDelimiter = /<md-raw>([\s\S]*?)<\/md-raw>/g;
        let placeholders = {};

        // Before markdown-it processes the content:
        let i = 0;
        content = content.replace(rawBlockDelimiter, function (match, rawBlock) {
            let placeholder = `{{raw-block-${i}}}`;
            placeholders[placeholder] = rawBlock;
            i++;
            return placeholder;
        });

        content = this.md.render(content);

        // Replace content and also strip out the <p> wrappers it adds
        // here's a workaround to try to prevent, but seems like more of a headache:
        // https://github.com/11ty/is-land/blob/43bd04d204b56a377f65d068c93ef35dbd3ddf52/11ty/MarkdownPlugin.cjs#L21
        for (let placeholder in placeholders) {
            content = content.replace("<p>" + placeholder + "</p>", placeholders[placeholder]);
            // There are some cases where we won't have <p></p> surrounding the
            // raw block:
            //
            //  * If two raw blocks are right next to each other (e.g., adjacent
            //    lines), they'd be like `<p>{{raw-block-0}} {{raw-block-1}}</p>`
            //
            //  * The maps inside map-base-triple.njk (b/c deep inside a <div>?)
            //
            // Run to check any failed replacements:
            // `egrep -R -F --include=\*.html "raw-block-" _site/`
            //
            // Anyway, we do an exact replace here in case the above failed.
            content = content.replace(placeholder, placeholders[placeholder]);
        }

        return content;
    }

    set(obj) {
        this.md.set(obj);
    }

    disable(key) {
        this.md.disable(key);
    }
}

/**
 * Custom markdown-it extension to modify inline images.
 * Based on https://github.com/ruanyf/markdown-it-image-lazy-loading
 *
 * Extended to support:
 * - thumbhash
 * - caching image sizes
 */
function markdownItCustomImageProcessor(md, mdOptions) {
    var defaultImageRenderer = md.renderer.rules.image;

    md.renderer.rules.image = function (tokens, idx, options, env, self) {
        var token = tokens[idx];
        token.attrSet('loading', 'lazy');
        token.attrSet('decoding', 'async');

        // NOTE: Version this is based on had this base path feature. I didn't
        // need it, but keeping for reference.
        // const imgPath = path.join(mdOptions.base_path, imgSrc);

        // Get size and thumbhash (if available).
        let path = token.attrGet('src');
        let localPath = getLocalPath(path);
        let [w, h] = getImageSize(sizeCache, localPath);
        token.attrSet('width', w);
        token.attrSet('height', h);
        // Set thumbhash only if it's already available (from pre-build build-image-cache.js).
        if (thumbhashCache.has(localPath)) {
            token.attrSet("data-thumbhash-b64", thumbhashCache.get(localPath));
        }
        // NOTE: If there are transparent PNGs anywhere, may want to have white
        // for those as well.
        let bgClass = isSVG(path) ? "bg-white" : "bg-deep-green";
        token.attrSet('class', `h-auto ${bgClass}`);

        // srcset / sizes (only if precomputed)
        let [srcSet, sizes] = getInlineSrcsetSizes(localPath);
        if (srcSet != null && sizes != null) {
            // console.log("Found cached srcset/sizes for " + localPath);
            token.attrSet("srcset", srcSet);
            token.attrSet("sizes", sizes);
        } else {
            console.log("Missed cache (no srcset/sizes) for " + localPath);
        }

        return defaultImageRenderer(tokens, idx, options, env, self);
    };
};

/**
 * Get width, height, and base64-encoded thumbhash.
 * @param {string} path Full path to resource (can start with "/")
 * @returns {Promise<[number, number, string|null]>} [width, height, thumbhash64|null]
 */
async function getWHTHB64(path) {
    let localPath = getLocalPath(path);
    let [w, h] = getImageSize(sizeCache, localPath);
    let thumbhash64 = await loadAndHashImage(thumbhashCache, localPath);
    return [w, h, thumbhash64];
}

/**
 * "a-beautiful-run-in-the-park-but" -> "A Beautiful Run in the Park But"
 * @param {string} slug
 * @returns string
 */
function slugToTitleCase(slug) {
    const stopWords = ["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by", "in", "vs"];
    const words = slug.split('-');
    let res = [];
    for (let i = 0; i < words.length; i++) {
        // Still capitalize stop word if its first or (interestingly!) last word
        if (stopWords.includes(words[i]) && i > 0 && i < words.length - 1) {
            res[i] = words[i].toLowerCase();
        } else {
            res[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        }
    }
    return res.join(' ');
}

/**
 * Eleventy-img has a funny thing where it returns to you an object whose keys
 * you have to guess based on its logic (I think). It's basically the extension
 * but with some collapsing.
 *
 * @param {string} path
 * @returns {string}
 */
function formatKey(path) {
    let parts = path.split(".");
    let extRaw = parts[parts.length - 1].toLowerCase();
    return extRaw == "jpg" ? "jpeg" : extRaw;
}

module.exports = function (eleventyConfig) {
    // Copy some folders to the output
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("social-chemistry");
    eleventyConfig.addPassthroughCopy("CNAME");

    // Add plugins
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    eleventyConfig.addPlugin(pluginSyntaxHighlight);
    eleventyConfig.addPlugin(readingTime);
    // Ideas:
    // - TOC
    //      - https://www.npmjs.com/package/eleventy-plugin-toc
    // - navigation breadcrumbs:
    //      - https://www.11ty.dev/docs/plugins/navigation/
    //      - const pluginNavigation = require("@11ty/eleventy-navigation");
    // - link_to
    //      - https://github.com/nhoizey/eleventy-plugin-link_to
    //      - const pluginLinkTo = require('eleventy-plugin-link_to');
    // - rss
    //      - https://www.11ty.dev/docs/plugins/rss/
    //      - const pluginRss = require("@11ty/eleventy-plugin-rss");

    // TODO: consider
    // Alias `layout: post` to `layout: layouts/post.njk`
    //   eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

    eleventyConfig.on('eleventy.after', async ({ dir, results, runMode, outputMode }) => {
        if (thumbhashCacheLastDiskSize != thumbhashCache.size) {
            await serializeMapAsync(thumbhashCache, TH_CACHE_PATH);
            thumbhashCacheLastDiskSize = thumbhashCache.size;
        }
        if (sizeCacheLastDiskSize != sizeCache.size) {
            await serializeMapAsync(sizeCache, SIZE_CACHE_PATH);
            sizeCacheLastDiskSize = sizeCache.size;
        }
    });

    // My custom filters

    const latestDateComp = (a, b) => { return a.date > b.date ? -1 : 1 }
    const earliestDateComp = (a, b) => { return a.date > b.date ? 1 : -1 }
    const titleComp = (a, b) => { return a.data.title < b.data.title ? -1 : 1 }
    const seriesOrderComp = (a, b) => { return a.data.seriesOrder - b.data.seriesOrder }

    /**
     * Groups posts by series and date, ordered newest to oldest.
     * - each series is positioned by the date of its latest post
     * - non-series posts are interleaved according to their post dates, grouped
     *   into empty ("") series for convenience
     * - within a series, posts are sorted by title if they're in the
     *   garage, or seriesOrder otherwise.
     *
     * The date used for the overall ordering is a priority order of travel_end,
     * updated, then date. NOTE: probably don't want to actually sort by updated
     * for any posts besides garage.
     *
     * No series are internally ordered by date (yet). If they are, need to
     * update the logic in series-top.njk and series-bottom.njk.
     *
     * Input: [post, post, post, post, post, post, post, post]
     * Output: [
     *  {"": [post, post]}
     *  {"series1": [post, post]}
     *  {"": [post]}
     *  {"series2": [post, post]}
     *  {"": [post]}
     * ]
     */    
    function dateSeriesGroupBy (arr) {
        // Build collection of posts and save series representative dates for
        // sorting. Non-series posts are *not* grouped at this stage.
        let items = [];
        let seriesInfo = {};
        for (let post of arr) {
            let series = post.data.series;
            let isGarage = post.data.tags.indexOf("garage") > -1;
            // We have a priority sort order for the date to use. Garage pieces
            // incorporate their `updated` date for overall[0] sorting, but all
            // other posts use their original post date.
            //
            // [0] Date is currently never used for within-series sorting (see
            // `sortBy` below).
            let postDate = post.data.travel_end || post.date;
            if (isGarage) {
                postDate = post.data.travel_end || post.data.updated || post.date;
            }
            if (!series || series == "") {
                items.push({
                    kind: "post",
                    date: postDate,
                    post: post,
                })
            } else {
                if (!seriesInfo[series]) {
                    seriesInfo[series] = {
                        kind: "series",
                        name: series,
                        date: postDate,
                        posts: [post],
                        // Within-series sorting (currently seriesOrder or title only.)
                        sortBy: isGarage ? "title" : "seriesOrder",
                    }
                } else {
                    // series' date should be the latest post date
                    if (seriesInfo[series].date < postDate) {
                        seriesInfo[series].date = postDate;
                    }
                    seriesInfo[series].posts.push(post);
                }
            }
        }

        // Add series to items for overall sorting
        for (let seriesName in seriesInfo) {
            items.push(seriesInfo[seriesName]);
        }

        // Latest date (i.e., most recent) first
        items.sort(latestDateComp)

        // Two final operations:
        // 1. Consecutive non-series posts should be aggregated into "" series
        //    groups (for frontend convenience)
        // 2. Series posts should be sorted by the sortBy field
        let res = [];
        let curNoSeries = { series: "", posts: [] };
        for (let item of items) {
            if (item.kind == "post") {
                curNoSeries.posts.push(item.post);
            } else {
                // item.kind == "series"
                // add any empty series if they exist
                if (curNoSeries.posts.length > 0) {
                    res.push(curNoSeries);
                }
                let sortFunc = {
                    "title": titleComp,
                    "date": earliestDateComp,  // currently unused
                    "seriesOrder": seriesOrderComp,
                }[item.sortBy];
                res.push({ series: item.name, posts: item.posts.sort(sortFunc) })
                curNoSeries = { series: "", posts: [] };
            }
        }
        // push any final curSeries
        if (curNoSeries.posts.length > 0) {
            res.push(curNoSeries);
        }

        return res;
    }

    eleventyConfig.addNunjucksFilter("dateSeriesGroupBy", dateSeriesGroupBy);    
    eleventyConfig.addJavaScriptFunction("dateSeriesGroupBy", dateSeriesGroupBy);    


    /**
     * To do foo.bar or foo["bar"], in a filter: foo | attr("bar")
     * Also works on an array; calls on each.
     */
    eleventyConfig.addNunjucksFilter("attr", (obj, attr) => {
        if (Array.isArray(obj)) {
            return obj.map(o => {
                return o[attr];
            })
        }
        return obj[attr];
    });

    // Setting variables is in scope for nunjucks, but setting an object's
    // properties is not. https://github.com/mozilla/nunjucks/issues/636
    eleventyConfig.addNunjucksFilter("setAttr", (obj, attr, val) => {
        obj[attr] = val;
        return obj;
    });

    /**
     * Returns subset of array where obj[attr] == testVal
     *
     * attr can be a nested attr by passing an array, i.e., ["foo", "bar"], which checks
     * obj[attrs[0]][attrs[1]] == testVal
     *
     * selectAttrEquals([{"foo": 1}, {"foo": 2}], "foo", 1)
     * -> {"foo": 1}
     *
     * selectAttrEquals([{"foo": {"bar": 1}}, {"foo": 2}], ["foo", "bar"], 1)
     * -> {"foo": {"bar": 1}}
     *
     */
    eleventyConfig.addNunjucksFilter("selectAttrEquals", (array, attrs, testVal) => {
        if (typeof attrs == "string") {
            attrs = [attrs];
        }
        return array.filter((obj) => {
            // drill down the list of attrs to get our test val
            let cur = obj;
            for (let attr of attrs) {
                if (!(attr in cur)) {
                    return false;
                }
                cur = cur[attr];
            }
            // check inclusion
            return cur == testVal;
        });
    });

    // removes all whose attr(s) are not truthy
    eleventyConfig.addNunjucksFilter("rejectAttrNested", (array, attrs) => {
        if (typeof attrs == "string") {
            attrs = [attrs];
        }
        return array.filter((obj) => {
            // drill down the list of attrs to get our test val
            let cur = obj;
            for (let attr of attrs) {
                if (!(attr in cur)) {
                    return true;
                }
                cur = cur[attr];
            }
            // reject if found and truthy (TODO: no idea how general this is)
            return !cur;
        });
    });

    // selectAttrContains: attr's value is array, testCal is single, checks testVal in
    eleventyConfig.addNunjucksFilter("selectAttrContains", (array, attrs, testVal) => {
        if (typeof attrs == "string") {
            attrs = [attrs];
        }
        return array.filter((obj) => {
            // drill down the list of attrs to get our test val
            let cur = obj;
            for (let attr of attrs) {
                if (!(attr in cur)) {
                    return false;
                }
                cur = cur[attr];
            }

            // check inclusion
            return Array.isArray(cur) && cur.indexOf(testVal) > -1;
        });
    });

    // Get the main collection an item belongs to, or "other [(array of tags)]"
    eleventyConfig.addFilter("primaryCollection", (array) => {
        if (array == null) {
            return "other";
        }
        const priorities = [
            "travel",
            "blog",
            "garage",
            "sketch",
            "microblog",
            "project",
            "writing",
            "software",
        ]
        for (let p of priorities) {
            if (array.indexOf(p) > -1) {
                return p;
            }
        }
        return `other (${array})`;
    });

    // "/foo#bar" -> "/foo"
    eleventyConfig.addFilter("stripAnchor", (s) => {
        let hashIdx = s.indexOf("#");
        if (hashIdx == -1) {
            return s;
        }
        return s.slice(0, hashIdx);
    });

    // "/foo" -> ""
    // "/foo#" -> ""
    // "/foo#edinburgh-castle" -> " #Edinburgh Castle"
    eleventyConfig.addFilter("getAnchorReadable", (s) => {
        let hashIdx = s.indexOf("#");
        if (hashIdx == -1) {
            return "";
        }
        // if slicing past bounds, just get ""
        let slug = s.slice(hashIdx + 1);
        if (slug == "") {
            return "";
        }
        return " #" + slugToTitleCase(slug);
    });

    // rejectAttrContains: attr's value is array, testCal is single, checks testVal *not* in
    eleventyConfig.addNunjucksFilter("rejectAttrContains", (array, attrs, testVal) => {
        if (typeof attrs == "string") {
            attrs = [attrs];
        }
        return array.filter((obj) => {
            // drill down the list of attrs to get our test val
            let cur = obj;
            for (let attr of attrs) {
                if (!(attr in cur)) {
                    return false;
                }
                cur = cur[attr];
            }

            // check inclusion
            return (!Array.isArray(cur)) || cur.indexOf(testVal) == -1;
        });
    });

    eleventyConfig.addFilter("cleanExcerpt", (txt) => {
        // Deprecated: if txt contains "Permalink to ... #" then remove that part
        // txt = txt.replace(/Permalink to.*#/, "").trim();
        // New: header anchors are just # characters, we remove them all.
        txt = txt.replace(/#/g, "").trim();

        // see cards.njk. note the annoying escaping of the apostrophe
        // also there's a caption I put on maps in earlier posts
        // Note: Since I trimmed all of the # out above, I replaced each "I&#39;" below with "I&39;". This is supremely gross. Sorry.
        const stripStrs = [
            "Stub This is a placeholder for me to write more. Bug me if you want to read it.",
            "Ideas This is a post in its idea generation phase. I&39;m collecting notes for what to write about. Proceed at will.",
            "Draft This is a rough draft of a post. I&39;m still writing and revising it. It probably reads terribly. Proceed at will.",
            "Map by me, made with marceloprates/prettymaps. Data &copy; OpenStreetMap contributors.",
        ];
        for (let ss of stripStrs) {
            txt = txt.replace(ss, "").trim();
        }

        return txt;
    });

    // smart dump --- don't explode when there's a circular reference, which there is by
    // default on like all the objects.
    eleventyConfig.addNunjucksFilter('sdump', obj => {
        // console.log(util.inspect(obj));
        return util.inspect(obj);
    });

    /*
     * Use like this:
     *     set posts = cardSoftware | mergeArrays(nonSoftware)
     */
    eleventyConfig.addNunjucksFilter('mergeArrays', (arr1, arr2) => {
        return arr1.concat(arr2);
    });

    /**
     * Get `srcset` and `sizes` attribute values. Includes creating them using eleventy-img.
     * @param {string} path
     * @param {number} w original width
     * @param {boolean} fullWidth (vs inline)
     * @param {*} n number of images in row
     * @returns {Promise<[number, number]>} [srcset, sizes] attr values
     */
    async function getSrcsetSizes(path, w, fullWidth, n) {
        let localPath = getLocalPath(path);
        let ws = wantWidths(w);
        let metadata = await Image(localPath, {
            widths: ws,
            formats: ["auto"],
            outputDir: "./_site/assets/eleventyImgs/",
            urlPath: "/assets/eleventyImgs/",
        });
        let fmt = formatKey(localPath);
        // metadata[fmt] is an array of objects that look like:
        //{
        //    format: 'jpeg',
        //    width: 352,
        //    height: 234,
        //    url: '/assets/eleventyImgs/368rsNkvAN-352.jpeg',
        //    sourceType: 'image/jpeg',
        //    srcset: '/assets/eleventyImgs/368rsNkvAN-352.jpeg 352w',
        //    filename: '368rsNkvAN-352.jpeg',
        //    outputPath: '_site/assets/eleventyImgs/368rsNkvAN-352.jpeg',
        //    size: 13131
        //  },
        let srcSet = metadata[fmt].map(m => m.srcset).join(", ");

        // Brief reminder:
        // - srcset is a list with each variant's true size ("cat-320.jpg 320w, cat-640.jpg 640w, cat-1280.jpg 1280w"")
        // - sizes is a list of "(condition) display" tuples ("(max-width: 480px) 100vw, (max-width: 900px) 33vw, 254px")

        // NOTE: The non-100vw widths are rough guesses! If we really wanted to
        // do this correctly, we would compute the expected display widths for
        // each image based on its width and all the image widths. On the other
        // hand, this might make a row's images choose different sizes,[0] which
        // would break the layout without implementing manual explicit widths.
        //
        // [0] Actually, the *only* reason to do this would be if it *did* make
        // a row's images choose different sizes. So if I don't want that to
        // happen, I shouldn't do it. (Or I should at least see if things are
        // broken anyway first and maybe not do it if they're fine.)

        // NOTE: the media-max-width (MMW) started at 1140px, later trying other
        // values (2000px), so turning into variable. Doing inline width (IW =
        // 704px) too for good measure.

        // sizes:
        // inline:
        // "(max-width: 30em) 100vw, (max-width: IWpx) 33/50/100vw, (IW/3)/(IW/2)/(IW)px"
        //
        // full-width (media-max-width):
        // "(max-width: 30em) 100vw, (max-width: MMWpx) 33/50/100vw, (MMW/3)/(MMW/2)/(MMW)px"

        const iw = 704; // inline width
        const mmw = 2000;  // media-max-width
        const rowWidth = fullWidth ? mmw : iw;
        const midSize = n == 1 ? "100" : (n == 2 ? "50" : "33");
        const bigSize = n == 1 ? rowWidth : (n == 2 ? Math.round(rowWidth / 2) : Math.round(rowWidth / 3));
        const sizes = `(max-width: 30em) 100vw, (max-width: ${rowWidth}px) ${midSize}vw, ${bigSize}px`;

        return [srcSet, sizes];
    }

    /**
     * @param {string|object} img can be a path or an object with a path and
     * options.
     * - if obj and image, expects key `path` (req)
     * - if obj and video, expect key `mp4Path` or `vimeoInfo` or `youtubeInfo` (req)
     * @param {number} n number of images in row. Used for sizes attribute.
     * @param {object} {
     *   fullWidth - whether containing div will be displayed larger than text margins
     *               (currently up to ~2000px, I think). Used for sizes attribute.
     * }
     * @returns {Promise<string>} (HTML)
     */
    async function imgSpecToHTML2(img, n, { fullWidth }) {
        const extraClasses = img.extraClasses ?? "";

        // video
        if (img.mp4Path || img.vimeoInfo || img.youtubeInfo) {
            const aspectRatio = img.aspectRatio ?? "16 / 9";
            if (img.mp4Path) {
                // Note: aspectRatio and extraClasses not plumbed through into
                // <video> tag yet. Can do when needed.
                return `
                <video autoplay muted loop playsinline class="novmargin">
                    <source src="${img.mp4Path}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>`;
            }
            if (img.vimeoInfo) {
                return `<iframe src="https://player.vimeo.com/video/${img.vimeoInfo}&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1" frameborder="0" allow="autoplay; picture-in-picture" loading="lazy" style="width: 100%; aspect-ratio: ${aspectRatio};" class="${extraClasses}"></iframe>`;
            }
            if (img.youtubeInfo) {
                return `<iframe src="https://www.youtube-nocookie.com/embed/${img.youtubeInfo}?&autoplay=1&mute=1&loop=1&playlist=${img.youtubeInfo}&rel=0&modestbranding=1&playsinline=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" allowfullscreen loading="lazy" style="width: 100%; aspect-ratio: ${aspectRatio};" class="${extraClasses}"></iframe>`;
            }
        }

        // image
        // w, h, thumbhash, srcset, sizes
        const path = typeof img === "string" ? img : img.path;
        const [w, h, thumbhash64] = await getWHTHB64(path);
        const thAttr = (thumbhash64 == null) ? "" : `data-thumbhash-b64="${thumbhash64}"`;
        const [srcSet, sizes] = await getSrcsetSizes(path, w, fullWidth, n)

        // image source / path debug / preview / display
        // const pathDisplay = `<div class="z-1 absolute bg-white black mt2 pa2 o-90">${path.split("/").slice(-1)}</div>`;
        const pathDisplay = "";
        return `<img
            src="${path}"
            class="db bare novmargin h-auto bg-deep-red ${extraClasses}"
            loading="lazy" decoding="async"
            width="${w}" height="${h}" ${thAttr}
            srcset="${srcSet}" sizes="${sizes}"
            />${pathDisplay}`;
    }

    async function oneBigImage2(imgSpec, marginClasses, { fullWidth, maxWidth }) {
        let imgHTML = await imgSpecToHTML2(imgSpec, 1, { fullWidth });
        let fwClasses = fullWidth ? "full-width cb" : "";
        let phClass = fullWidth ? "ph1-m ph3-l" : "";
        let widthClass = !maxWidth ? "media-width" : "";
        let styleAttr = !maxWidth ? "" : `style="max-width: ${maxWidth}"`;
        let thAttr = "";
        // Throw the thumbhash on the container to get color to stretch to
        // media-width margins to keep a consistent page margin.
        if (typeof imgSpec === "string") {
            let [w, h, thumbhash64] = await getWHTHB64(imgSpec);
            thAttr = (thumbhash64 == null) ? "" : `data-thumbhash-b64="${thumbhash64}"`;
        }
        return `
        <div class="${fwClasses} flex justify-center ${phClass} ${marginClasses}">
            <div class="flex justify-center ${widthClass}" ${thAttr} ${styleAttr}>
                ${imgHTML}
            </div>
        </div>
        `;
    }

    async function twoBigImages2(imgSpecs, marginClasses, { fullWidth, maxWidth }) {
        let imgHTML1 = await imgSpecToHTML2(imgSpecs[0], 2, { fullWidth });
        let imgHTML2 = await imgSpecToHTML2(imgSpecs[1], 2, { fullWidth });

        let fwClasses = fullWidth ? "full-width cb" : "";
        let phClass = fullWidth ? "ph1-m ph3-l" : "";
        let widthClass = !maxWidth ? "media-max-width" : "";
        let styleAttr = !maxWidth ? "" : `style="max-width: ${maxWidth}"`;

        return `
        <div class="${fwClasses} flex justify-center ${phClass} ${marginClasses}">
            <div class="flex flex-wrap flex-nowrap-ns justify-center ${widthClass}" ${styleAttr}>
                <div class="mr1-ns mb1 mb0-ns">${imgHTML1}</div>
                <div>${imgHTML2}</div>
            </div>
        </div>
        `;
    }

    async function threeBigImages2(imgSpecs, marginClasses, { fullWidth, maxWidth }) {
        let imgHTML1 = await imgSpecToHTML2(imgSpecs[0], 3, { fullWidth });
        let imgHTML2 = await imgSpecToHTML2(imgSpecs[1], 3, { fullWidth });
        let imgHTML3 = await imgSpecToHTML2(imgSpecs[2], 3, { fullWidth });

        let fwClasses = fullWidth ? "full-width cb" : "";
        let phClass = fullWidth ? "ph1-m ph3-l" : "";
        let widthClass = !maxWidth ? "media-max-width" : "";
        let styleAttr = !maxWidth ? "" : `style="max-width: ${maxWidth}"`;
        return `
        <div class="${fwClasses} flex justify-center ${phClass} ${marginClasses}">
            <div class="flex flex-wrap flex-nowrap-ns justify-center ${widthClass}" ${styleAttr}>
                <div>${imgHTML1}</div>
                <div class="mh1-ns mv1 mv0-ns">${imgHTML2}</div>
                <div>${imgHTML3}</div>
            </div>
        </div>
        `;
    }

    function getMarginClasses(i, n_rows) {
        if (n_rows == 1) return 'fig';
        if (i == 0) return 'figtop mb1'
        if (i == n_rows - 1) return 'mt1 figbot';
        return 'mv1';
    }

    /**
     * Image gallery shortcode with width-limiting <div>, thumbhash, and srcset/sizes.
     *
     * @param img The first argument is the image or set of images:
     *
     * "path"                                   single image
     * ["path"]                                 single image
     * [["path"]]                               single image
     * [["path1", "path2"]]                     side by side
     * ["path1", "path2"]                       single image, single image
     * ["path1", ["path2", "path3"]]            single image, side by side
     * [["path1", "path2"], ["path3", "path4"]] side by side, side by side
     *
     * Each string can be replaced by an object to specify extraClasses:
     *
     * {path: "path", extraClasses: "ba bw1 b--red"}       single image
     * [[                                                  side by side
     *     {path: "path", extraClasses: "ba bw1 b--red"},
     *     {path: "path", extraClasses: "ba bw1 b--red"}
     * ]]
     * etc.
     *
     * Videos can be specified. They are also specified by an object. Videos
     * default to 100% width and 16 / 9 aspect ratio. The aspect ratio can be
     * overridden.
     *
     * { vimeoInfo: "733916865?h=fd53e75a74"}
     * { vimeoInfo: "733916865?h=fd53e75a74", aspectRatio: "4 / 3"}
     * { youtubeInfo: "youtubeidhere"}
     * { mp4Path: "path"}
     *
     * @param options The second argument is global formatting options: {
     *   fullWidth: boolean, default: true
     *   maxWidth: string, any max-width to set on all rows (no default)
     * }
     */
    async function img2(imgs, options = {}) {
        if (typeof options === "boolean") {
            console.warn("The first argument passed to img2 was a boolean, which is the wrong call signature.")
        }
        // Default fullWidth to true if not set.
        options.fullWidth = options.fullWidth ?? true;

        if (!Array.isArray(imgs)) {
            imgs = [imgs];
        }

        // go row-by-row. top and bottom get big margins, inter-rows are m1.
        let buf = '';
        for (let i = 0; i < imgs.length; i++) {
            let row = imgs[i];
            let m = getMarginClasses(i, imgs.length);
            if (!Array.isArray(row)) {
                row = [row];
            }
            switch (row.length) {
                case 1:
                    buf += await oneBigImage2(row[0], m, options);
                    break;
                case 2:
                    buf += await twoBigImages2(row, m, options);
                    break;
                case 3:
                    buf += await threeBigImages2(row, m, options);
                    break;
                default:
                    buf += 'UNSUPPORTED IMG ROW ARRAY LENGTH: ' + row.length;
                    break;
            }
        }

        return "<md-raw>" + buf + "</md-raw>";
    }

    eleventyConfig.addShortcode("img2", img2);
    eleventyConfig.addShortcode("img2i", async function (imgs, options = {}) {
        return img2(imgs, { fullWidth: false, ...options });
    });

    eleventyConfig.addShortcode("thumb", async function (path, widths, classes = "", style = "") {
        // NOTE: use if benchmarking w/o Eleventy Image
        // console.log("Returning", `<img src='${path}'/>`);
        // return `<img src='${path}'/>`;        
        
        if (!Array.isArray(widths)) {
            widths = [widths];
        }
        const src = path[0] == "/" ? path.substring(1) : path;
        const options = {
            widths: widths,
            formats: ["auto"],
            outputDir: "./_site/assets/eleventyImgs/",
            urlPath: "/assets/eleventyImgs/",
        };                
        let metadata = await Image(src, options);
        return Image.generateHTML(metadata, {
            sizes: "100vw",  // NOTE: If multiple sizes ever used, could replace
            class: classes,
            style: style,
            loading: "lazy",
            decoding: "async",
            alt: "",
        });
    });

    eleventyConfig.addShortcode("thumbhash", async function (path) {
        let localPath = getLocalPath(path);
        const base64Hash = await loadAndHashImage(thumbhashCache, localPath);
        return (base64Hash == null) ? "" : base64Hash;
    });

    // NOTE: Deprecated since loadAndHashImage(thumbhashCache, ) now returns b64 instead of binary.
    // eleventyConfig.addShortcode("thumbhashhex", async function (path) {
    //     // NOTE: use if benchmarking w/o thumbhash
    //     // return "8F E8 09 0D 82 BE 89 57 7F 77 87 6D 77 98 77 68 04 91 B9 FA 76";
    //     let localPath = path[0] == "/" ? path.substring(1) : path;
    //     const base64Hash = await loadAndHashImage(thumbhashCache, localPath);
    //     // NOTE: Given new API, would need to do b64 -> binary here.
    //     const binaryHash = ???(base64Hash);
    //     const preview = Array.from(binaryHash).map(b => b.toString(16).padStart(2, '0')).join(' ').toUpperCase();
    //     return preview;
    // });


    /**
     * Common image function for non-img2 macro images, like cover images and
     * sketch images. Common code to get srcset, sizes, and thumbhash. It's
     * currently made for primary content, full-sized images, so it just uses
     * the 100vw size and omits lazy loading.
     */
    async function commonImg(path, classes = "", style = "") {
        // NOTE: use if benchmarking w/o Eleventy Image
        // return `<img src='${path}'/>`;
        let localPath = getLocalPath(path);
        let [w, h] = getImageSize(sizeCache, localPath);
        let ws = wantWidths(w);

        let metadata = await Image(localPath, {
            widths: ws,
            formats: ["auto"],
            outputDir: "./_site/assets/eleventyImgs/",
            urlPath: "/assets/eleventyImgs/",
        });
        let opts = {
            // using 100vw as only size for full display images:
            // - if 100vw < orig size, will get the size matching 100vw
            // - if 100vw > orig size, will simply get the largest
            sizes: "100vw",
            class: classes,
            style: style,
            // @ page top, so we actually want it to load ASAP
            // loading: "lazy",
            decoding: "async",
            alt: "",
        };
        let thB64 = await loadAndHashImage(thumbhashCache, localPath);
        if (thB64 != null) {
            opts["data-thumbhash-b64"] = thB64;
        }
        return Image.generateHTML(metadata, opts);
    }

    eleventyConfig.addShortcode("sketch", async function (path, classes = "") {
        return await commonImg(path, "mh-100vh w-auto h-auto pa1 pa3-m pa4-l border-box " + classes);
    });

    eleventyConfig.addShortcode("coverImg", async function (path, classes = "", style = "") {
        return await commonImg(path, classes, style);
    });

    /**
     * pathOrPaths (str | str[])
     * attribution (bool, default: true) --- whether to add attribution <p> below
     * mt = margin-top (bool, default: true) --- whether to add figtop (mt5)
     * mb = margin-bottom (bool, default: true) --- whether to add figbot (mb5)
     * imgExClasses (str, default: "") --- any extra classes to add to image(s) (e.g., for padding)
     * embedded (bool, default: false) --- whether the map will be embedded (e.g., in a three-map layout), which makes the following changes:
     *  - container div: removes full-width, removes bg color
     *  - image: removes content-width, adds border radius
     * firstImgClass (str, default: "") --- anything to put on the first image only
     */
    eleventyConfig.addShortcode(
        "cityMap", async function (
            pathOrPaths,
            attribution = true,
            mt = true,
            mb = true,
            imgExClasses = "",
            embedded = false,
            firstImgClass = "",
            plainBig = false,
        ) {
        let paths = pathOrPaths;
        if (!Array.isArray(paths)) {
            paths = [paths];
        }
        const isX = paths.length > 1;  // X = "transition"
        const divBGColorStyle = embedded ? "" : (plainBig ? "" : "background-color: #FCEEE1;");
        const divWidthClass = embedded ? "" : "full-width ph1-m ph3-l"; // padding is the new margin
        const divWidthLimiterClass = embedded ? "" : "media-width";  // stretch to media-width
        const figClasses = mt && mb ? "fig" : (mt && !mb ? "figtop" : (mb && !mt ? "figbot" : ""));
        const containerXClasses = isX ? "transitionContainer" : "";
        const containerXStyle = isX ? "display: grid;" : "";
        const imageClasses = embedded ? "br-100" : (plainBig ? "" : "content-width");
        const containerStyleSize = plainBig ? "max-width: min(100%, 1000px, 100vh);" : "";
        imgExClasses = !embedded && !plainBig && imgExClasses == "" ? "pv4 pv5-ns" : imgExClasses;
        // Rough notes for sizing (that we pass below to getSrcsetSizes())
        // - content-width (max 704px, i.e. not fullscreen) = !embedded && !plainBig
        // - embedded: singapore, bali, penang (100vw mobile -> ~1/3 desktop)
        // - plainBig: max 1000px display <-- just treating as full screen

        let basePieces = [];
        basePieces.push(`<div class="${divWidthClass} cb ${figClasses} flex justify-center">`);
        basePieces.push(`<div style="${divBGColorStyle}" class="${divWidthLimiterClass} flex justify-center">`);
        basePieces.push(`<div style="${containerStyleSize} ${containerXStyle}" class="${containerXClasses}">`);
        for (let i = 0; i < paths.length; i++) {
            // NOTE: No thumbhash. If we add vertical padding to give maps more
            // breathing room (which looks nice), the thumbhash BG shows
            // through.
            let [w, h] = getImageSize(sizeCache, getLocalPath(paths[i]));
            let [srcSet, sizes] = await getSrcsetSizes(paths[i], w, embedded || plainBig, embedded ? 3 : 1);
            const imgXClasses = isX ? `fader z-${i} o-${i == paths.length - 1 ? 1 : 0}` : "";
            const imgXStyleAttr = isX ? `style="grid-area: 1 / 1 / 2 / 2; transition: opacity 0.75s;"` : `style=""`;
            basePieces.push(`<img
            src="${paths[i]}"
                class="novmargin h-auto ${imageClasses} ${imgXClasses} ${imgExClasses} ${i == 0 ? firstImgClass : ''}"
                ${imgXStyleAttr}
                loading="lazy" decoding="async"
                width="${w}" height="${h}"
                srcset="${srcSet}" sizes="${sizes}"
            />`)
        }
        basePieces.push(`</div>`);
        basePieces.push(`</div>`);
        basePieces.push(`</div>`);
        const base = basePieces.join("\n");

        const attributionEl = `
        <div class="full-width ph1-m ph3-l flex justify-center">
        <p class="media-width figcaption attribution">
            Map by me, made with <a href="https://github.com/marceloprates/prettymaps/">marceloprates/prettymaps</a>. Data &copy; OpenStreetMap contributors.
        </p>
        </div>
        `;
        const content = attribution ? base + attributionEl : base;
        return "<md-raw>" + content + "</md-raw>";
    });

    eleventyConfig.addShortcode("cityPic", async function (path) {
        // With getMarginClasses(...), we're pretending it's the last img of a set.
        // Right now this gets us `mt1 figbot`.
        const content = await oneBigImage2(path, getMarginClasses(1, 2), { fullWidth: true });
        return "<md-raw>" + content + "</md-raw>";
    });

    /**
     * Simply pass null as one of the arguments to omit one of the captions.
     */
    eleventyConfig.addNunjucksShortcode("doubleCaption", (first, second) => {
        let buf = "";
        if (first) {
            buf += `<span class="b">
<span class="dn-ns">Top:</span>
<span class="dn di-ns">Left:</span>
</span>
${first}`;
        }
        if (second) {
            buf += `<span class="b">
<span class="dn-ns">Bottom:</span>
<span class="dn di-ns">Right:</span>
</span>
${second}`;
        }
        return `<p class="figcaption">${buf}</p>`;
    });

    /**
     * Simply pass null as any of the arguments to omit that captions.
     */
    eleventyConfig.addNunjucksShortcode("tripleCaption", (first, second, third) => {
        let buf = "";
        if (first) {
            buf += `<span class="b">
<span class="dn-ns">Top:</span>
<span class="dn di-ns">Left:</span>
</span>
${first}`;
        }
        if (second) {
            buf += `<span class="b">
<span class="dn-ns">Middle:</span>
<span class="dn di-ns">Center:</span>
</span>
${second}`;
        }
        if (third) {
            buf += `<span class="b">
<span class="dn-ns">Bottom:</span>
<span class="dn di-ns">Right:</span>
</span>
${third}`;
        }
        return `<p class="figcaption">${buf}</p>`;
    });




    // ---------------------------------------------------------------------------------
    // (Universal) filters from the eleventy starter template. Can remove if not using.

    eleventyConfig.addFilter("readableDate", dateObj => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("LLL d, yyyy");
    });

    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    eleventyConfig.addFilter('htmlDateString', (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
    });

    // Get the first `n` elements of a collection.
    eleventyConfig.addFilter("head", (array, n) => {
        if (!Array.isArray(array) || array.length === 0) {
            return [];
        }
        if (n < 0) {
            return array.slice(n);
        }

        return array.slice(0, n);
    });

    // Return the smallest number argument
    eleventyConfig.addFilter("min", (...numbers) => {
        return Math.min.apply(null, numbers);
    });

    function filterTagList(tags) {
        return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
    }

    eleventyConfig.addFilter("filterTagList", filterTagList)
    // ---------------------------------------------------------------------------------

    eleventyConfig.addFilter("month3", dateObj => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("LLL");
    });

    eleventyConfig.addFilter("day2", dateObj => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("dd");
    });

    eleventyConfig.addFilter("year4", dateObj => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("yyyy");
    });

    // Create an array of all tags
    eleventyConfig.addCollection("tagList", function (collection) {
        let tagSet = new Set();
        collection.getAll().forEach(item => {
            (item.data.tags || []).forEach(tag => tagSet.add(tag));
        });

        return filterTagList([...tagSet]);
    });

    // Customize Markdown library and settings:
    let markdownLibrary = markdownIt({
        html: true,
        // If you want this (`breaks` option), revise the GAN map gen post.
        // breaks: true,
        linkify: true,
        typographer: true,
    })
        .use(markdownItReplacements)
        .use(markdownItFootnote)
        .use(markdownItCustomImageProcessor)
        .use(markdownItAnchor, {
            permalink: markdownItAnchor.permalink.linkInsideHeader({
                placement: 'after',
                ariaHidden: true,
            }),
            slugify: eleventyConfig.getFilter("slug")
        });

    // Orig at https://github.com/markdown-it/markdown-it-footnote/blob/HEAD/index.js
    markdownLibrary.renderer.rules.footnote_block_open = () => (
        '<section class="footnotes">\n' +
        '<p class="footnotes-label">Footnotes</p>\n' +
        '<hr class="footnotes-sep" />\n' +
        '<ol class="footnotes-list">\n'
    );

    // Orig at https://github.com/markdown-it/markdown-it-footnote/blob/HEAD/index.js
    // (1) 0-padding, (2) removing [], so [X] -> 0X
    markdownLibrary.renderer.rules.footnote_caption = (tokens, idx/*, options, env, slf*/) => {
        var n = Number(tokens[idx].meta.id + 1).toString().padStart(2, '0');

        if (tokens[idx].meta.subId > 0) {
            n += ':' + tokens[idx].meta.subId;
        }

        return n;
    };

    eleventyConfig.setLibrary("md", new CustomMDLib(markdownLibrary));

    /**
     * Markdown renderer as nunjucks filter.
     * Thanks to https://www.npmjs.com/package/nunjucks-markdown-filter (MIT license) for inspiration.
     */
    eleventyConfig.addFilter("md", (value, stripPara) => {
        stripPara = stripPara !== false;
        try {
            let result = markdownLibrary.render(value).trim();
            if (stripPara) {
                result = result.replace(/^<p>|<\/p>$/g, '');
            }
            return result;
        } catch (e) {
            console.error('Error processing markdown:', e);
            return value;
        }
    });

    // Keys filter. For debugging.
    eleventyConfig.addFilter("keys", obj => Object.keys(obj).sort());

    // eleventyConfig.addTransform("delete-empty-p", function (content) {
    //     // Delete all instances of <p></p> that occur in the string content:
    //     console.log("transforming...");
    //     return content.replace(/<p><\/p>/g, '');
    // });

    // Set nunjucks options
    eleventyConfig.setNunjucksEnvironmentOptions({
        throwOnUndefined: true,
    });

    // Replace above with below for figuring out what variables are available.
    // Then put    <pre>{{ getContext() | sdump }}</pre>    somewhere.
    // let Nunjucks = require("nunjucks");
    // let nunjucksEnvironment = new Nunjucks.Environment(
    //     new Nunjucks.FileSystemLoader("_includes")
    // );
    // nunjucksEnvironment.addGlobal('getContext', function () {
    //     return this.ctx;
    // })
    // eleventyConfig.setLibrary("njk", nunjucksEnvironment);

    // console.log("Setting myGeneratedCSS in .eleventy.js");
    // eleventyConfig.addGlobalData("myGeneratedCSS", "Hello from .eleventy.js");

    return {
        // Control which files Eleventy will process
        // e.g.: *.md, *.njk, *.html, *.liquid
        templateFormats: [
            "md",
            "njk",
            "html",
            "11ty.js",
        ],

        // Pre-process *.md files with: (default: `liquid`)
        markdownTemplateEngine: "njk",

        // Pre-process *.html files with: (default: `liquid`)
        htmlTemplateEngine: "njk",

        // NOTE: The following was from eleventy 1.0, now 2.0 is different.
        // -----------------------------------------------------------------
        // If your site deploys to a subdirectory, change `pathPrefix`.
        // Don’t worry about leading and trailing slashes, we normalize these.

        // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
        // This is only used for link URLs (it does not affect your file structure)
        // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

        // You can also pass this in on the command line using `--pathprefix`

        // Optional (default is shown)
        // pathPrefix: "/",
        // -----------------------------------------------------------------

        // These are all optional (defaults are shown):
        // dir: {
        //     input: ".",
        //     includes: "_includes",
        //     data: "_data",
        //     output: "_site"
        // }
    };
};
