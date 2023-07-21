const { DateTime } = require("luxon");
const util = require("util");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItFootnote = require("markdown-it-footnote");
const markdownItReplacements = require('markdown-it-replacements');
const readingTime = require('eleventy-plugin-reading-time');
const Image = require("@11ty/eleventy-img");

// Local code! Wow I'm writing a lot of code lol.
const { isSVG, serializeMap, deserializeMap, getImageSize, loadAndHashImage, TH_CACHE_PATH, SIZE_CACHE_PATH } = require("./common.js");

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
        let localPath = path[0] == "/" ? path.substring(1) : path;
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

        return defaultImageRenderer(tokens, idx, options, env, self);
    };
};

/**
 * Get width, height, and base64-encoded thumbhash.
 * @param {string} path Full path to resource (can start with "/")
 * @returns {Promise<[number, number, string|null]>} [width, height, thumbhash64|null]
 */
async function getWHTHB64(path) {
    let localPath = path[0] == "/" ? path.substring(1) : path;
    let [w, h] = getImageSize(sizeCache, localPath);
    let thumbhash64 = await loadAndHashImage(thumbhashCache, localPath);
    return [w, h, thumbhash64];
}

module.exports = function (eleventyConfig) {
    // Copy some folders to the output
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("social-chemistry");
    eleventyConfig.addPassthroughCopy("CNAME");

    // Add plugins
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
            await serializeMap(thumbhashCache, TH_CACHE_PATH);
            thumbhashCacheLastDiskSize = thumbhashCache.size;
        }
        if (sizeCacheLastDiskSize != sizeCache.size) {
            await serializeMap(sizeCache, SIZE_CACHE_PATH);
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
    eleventyConfig.addNunjucksFilter("dateSeriesGroupBy", function (arr) {
        // Build collection of posts and save series representative dates for
        // sorting. Non-series posts are *not* grouped at this stage.
        let items = [];
        let seriesInfo = {};
        for (let post of arr) {
            let series = post.data.series;
            // We have a priority sort order for the date to use.
            let postDate = post.data.travel_end || post.data.updated || post.date;
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
                        sortBy: post.data.tags.indexOf("garage") == -1 ? "seriesOrder" : "title",
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
    });


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
        // if txt contains "Permalink to ... #" then remove that part
        txt = txt.replace(/Permalink to.*#/, "").trim();

        // see cards.njk. note the annoying escaping of the apostrophe
        // also there's a caption I put on maps in earlier posts
        const stripStrs = [
            "Stub This is a placeholder for me to write more. Bug me if you want to read it.",
            "Ideas This is a post in its idea generation phase. I&#39;m collecting notes for what to write about. Proceed at will.",
            "Draft This is a rough draft of a post. I&#39;m still writing and revising it. It probably reads terribly. Proceed at will.",
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
     * @param img can be a str or obj.
     * - if obj and image, expects keys path (req) maxHeight (opt, default "939px")
     * - if obj and video, expect keys vimeoInfo (req), videoStyle (req), bgImgPath (opt, for blurStretchSingles)
     *
     * @param n how many images will be in the final row this is a part of.
     *          Need this because the layout is breaking in extremely specific conditions
     *          (multi-img w/ diff dims and only w/ srcset+sizes).
     * @returns [HTML, {
     *     video: bool,
     *     bgImgPath: str | null,
     *     maxHeight: number | null,
     *     width: number | null,
     * }]
     */
    async function imgSpecToHTML(img) {
        // video
        if (img.vimeoInfo || img.youtubeInfo) {
            let html;
            if (img.vimeoInfo) {
                html = `<iframe src="https://player.vimeo.com/video/${img.vimeoInfo}&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1" frameborder="0" allow="autoplay; picture-in-picture" loading="lazy" style="max-height: min(939px, 100vh); ${img.videoStyle}" class="db"></iframe>`;
            }
            if (img.youtubeInfo) {
                html = `<iframe src="https://www.youtube-nocookie.com/embed/${img.youtubeInfo}?&autoplay=1&mute=1&loop=1&playlist=${img.youtubeInfo}&rel=0&modestbranding=1&playsinline=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" allowfullscreen loading="lazy" style="max-height: min(939px, 100vh); ${img.videoStyle}" class="db"></iframe>`;
            }
            return [html, {
                video: true,
                bgImgPath: img.bgImgPath || null,
                maxHeight: null,
                width: null,
                height: null,
            }]
        }

        // image
        let path;
        let maxHeight = null;  // NOTE: 939 now set in getWClassStyle
        let extraClasses = "";
        if (typeof img === "string") {
            path = img;
        } else {
            path = img.path;
            maxHeight = img.maxHeight || maxHeight;
            extraClasses = img.extraClasses || extraClasses;
        }

        // get thumbhash and size
        let [w, h, thumbhash64] = await getWHTHB64(path);
        let thAttr = (thumbhash64 == null) ? "" : `data-thumbhash-b64="${thumbhash64}"`;

        // image source / path debug / preview / display
        // let pathDisplay = `<div class="z-1 absolute bg-white black mt2 pa2 o-90">${path.split("/").slice(-1)}</div>`;
        let pathDisplay = "";
        let html = `<img class="db bare novmargin h-auto bg-navy ${extraClasses}" src="${path}" loading="lazy" decoding="async" width="${w}" height="${h}" ${thAttr} />${pathDisplay}`;
        return [html, {
            video: false,
            bgImgPath: path,
            maxHeight: maxHeight,
            width: w,
            height: h,
        }];
    }

    /**
     * @param img can be a str or obj.
     * - if obj and image, expects keys `path` (req)
     * - if obj and video, expect keys `vimeoInfo` or `youtubeInfo` (req)
     *
     * @returns str (HTML)
     */
    async function imgSpecToHTML2(img) {
        // video
        if (img.vimeoInfo) {
            return `<iframe src="https://player.vimeo.com/video/${img.vimeoInfo}&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1" frameborder="0" allow="autoplay; picture-in-picture" loading="lazy" style="width: 100%; aspect-ratio: 16 / 9;" class=""></iframe>`;
        }
        if (img.youtubeInfo) {
            return `<iframe src="https://www.youtube-nocookie.com/embed/${img.youtubeInfo}?&autoplay=1&mute=1&loop=1&playlist=${img.youtubeInfo}&rel=0&modestbranding=1&playsinline=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" allowfullscreen loading="lazy" style="width: 100%; aspect-ratio: 16 / 9;" class=""></iframe>`;
        }

        // image
        let path;
        if (typeof img === "string") {
            path = img;
        } else {
            path = img.path;
            // NOTE: add extra style or class support here + in returned HTML when needed
        }

        let [w, h, thumbhash64] = await getWHTHB64(path);
        let thAttr = (thumbhash64 == null) ? "" : `data-thumbhash-b64="${thumbhash64}"`;
        // image source / path debug / preview / display
        // let pathDisplay = `<div class="z-1 absolute bg-white black mt2 pa2 o-90">${path.split("/").slice(-1)}</div>`;
        let pathDisplay = "";
        return `<img class="db bare novmargin h-auto bg-deep-red" src="${path}" loading="lazy" decoding="async" width="${w}" height="${h}" ${thAttr} />${pathDisplay}`;
    }

    /**
      * Handle img (v1) macro size-limiting to account for any specified max height(s).
      *
      * @param {*} metadatas Returned (second item) by imgSpecToHTML
      * @returns class and style to be used in inner container <div> for width limiting
      */
    function getWClassStyle(metadatas) {
        // NOTE: We have an easy knob to adjust v1 styles if we ever want them
        //       to be width-limited and have clean margins (like v2). Just set
        //       wStyle (here and below) to have another component in the min(),
        //       like 133.3vh, or 1140px, or both, or something else! Can also
        //       use wClass (currently unused). Also of note: The new version
        //       has no height limiting. (Couldn't get it to work.) We do a
        //       heuristic to keep single 4:3 images from being taller than the
        //       page by doing a computation with vh and adding it to the wStyle
        //       min()s (133.3vh). If desired, could we do the computation w/
        //       the total row width and make sure the row is page-height
        //       limited?

        // This wClass needed only for full-width youtube (e.g., "hualien hike")
        // otherwise left-aligned. It's fine on 2 and 3 img rows, but it's
        // actually already there, so we don't add it to reduce confusion.
        let wClass = metadatas.length == 1 ? "flex justify-center" : "";
        let wStyle = "max-width: min(100%; 133.3vh);"; // rarely used (video only?) if mhs is non-empty (e.g., w/ 939)
        if (metadatas.length == 1 && metadatas[0].video) {
            // NOTE: Edge case I guess, videos are teensy if there's an outer
            // container with only a max-width, so we make it a width.
            wStyle = "width: 100%;";
        }
        let mhs = [939];  // old imgs exported to 1878px H for 939px H @ 2x
        let ws = [];
        for (let m of metadatas) {
            if (m.width == null || m.height == null) {
                // NOTE: videos return here
                return [wClass, wStyle];
            }
            if (m.maxHeight != null) {
                mhs.push(m.maxHeight);
            }
            ws.push(m.width);
        }
        if (mhs.length == 0) {
            return [wClass, wStyle];
        }

        // we have at least one desired max height. pick the smallest.
        // use the total width, but because the layout only supports equal
        // heights, just assume equal heights for now and use the first.
        let mh = Math.min(...mhs);
        let h = metadatas[0].height;
        let w = ws.reduce((a, b) => a + b, 0);
        //     w * h/w < maxHeight
        // ->  w < maxHeight * w/h
        let mw = Math.round(mh * (w / h));
        // wClass = "";
        // NOTE: limit single (landscape 4:3) images' height to 100vh
        // wStyle = `max-width: min(100%, ${mw}px, 133.3vh);"`;
        wStyle = metadatas.length == 1 ? `max-width: min(100%, ${mw}px, 133.3vh);"` : `max-width: min(100%, ${mw}px);"`;
        return [wClass, wStyle];
    }

    async function oneBigImage(imgSpec, marginClasses, blurStretchSingles, fullWidth, ph = true) {
        let [imgHTML, metadata] = await imgSpecToHTML(imgSpec);
        let bgDiv = "";
        if (blurStretchSingles && metadata.bgImgPath != "") {
            bgDiv = `<div class="bgImageReady svgBlur" style="background-image: none;" data-background-image="url(${metadata.bgImgPath})"></div>`;
        }
        let fwClasses = fullWidth ? "full-width cb" : "";
        // If it's not full-width, then we want them to be aligned with the text margins,
        // not have extra padding (matching markdown ![]() inline images).
        let phClass = (fullWidth && ph) ? "ph1-m ph3-l" : "";

        // Do any height limiting via width limiting
        let [wClass, wStyle] = getWClassStyle([metadata]);
        return `
        <div class="${fwClasses} flex justify-center ${phClass} ${marginClasses}">
            ${bgDiv}
            <div class="${wClass}" style="${wStyle}">
                ${imgHTML}
            </div>
        </div>
        `;
    }

    async function oneBigImage2(imgSpec, marginClasses, fullWidth) {
        let imgHTML = await imgSpecToHTML2(imgSpec);
        let fwClasses = fullWidth ? "full-width cb" : "";
        let phClass = fullWidth ? "ph1-m ph3-l" : "";
        return `
        <div class="${fwClasses} flex justify-center ${phClass} ${marginClasses}">
            <div class="media-max-width">
                ${imgHTML}
            </div>
        </div>
        `;
    }

    async function twoBigImages(imgSpecs, marginClasses, fullWidth) {
        let [imgHTML1, metadata1] = await imgSpecToHTML(imgSpecs[0]);
        let [imgHTML2, metadata2] = await imgSpecToHTML(imgSpecs[1]);

        let phClass = fullWidth ? "ph1-m ph3-l" : "";
        let [wClass, wStyle] = getWClassStyle([metadata1, metadata2]);
        let fwClasses = fullWidth ? "full-width cb" : "";
        return `
        <div class="${fwClasses} flex justify-center ${phClass} ${marginClasses}">
            <div class="flex flex-wrap flex-nowrap-ns justify-center ${wClass}" style="${wStyle}">
                <div class="mr1-ns mb1 mb0-ns">${imgHTML1}</div>
                <div>${imgHTML2}</div>
            </div>
        </div>
        `;
    }

    async function twoBigImages2(imgSpecs, marginClasses, fullWidth) {
        let imgHTML1 = await imgSpecToHTML2(imgSpecs[0]);
        let imgHTML2 = await imgSpecToHTML2(imgSpecs[1]);

        let fwClasses = fullWidth ? "full-width cb" : "";
        let phClass = fullWidth ? "ph1-m ph3-l" : "";

        return `
        <div class="${fwClasses} flex justify-center ${phClass} ${marginClasses}">
            <div class="flex flex-wrap flex-nowrap-ns justify-center media-max-width">
                <div class="mr1-ns mb1 mb0-ns">${imgHTML1}</div>
                <div>${imgHTML2}</div>
            </div>
        </div>
        `;
    }

    async function threeBigImages(imgSpecs, marginClasses, fullWidth) {
        let [imgHTML1, metadata1] = await imgSpecToHTML(imgSpecs[0]);
        let [imgHTML2, metadata2] = await imgSpecToHTML(imgSpecs[1]);
        let [imgHTML3, metadata3] = await imgSpecToHTML(imgSpecs[2]);

        let fwClasses = fullWidth ? "full-width cb" : "";
        let phClass = fullWidth ? "ph1-m ph3-l" : "";
        let [wClass, wStyle] = getWClassStyle([metadata1, metadata2, metadata3]);
        return `
        <div class="${fwClasses} flex justify-center ${phClass} ${marginClasses}">
            <div class="flex flex-wrap flex-nowrap-ns justify-center ${wClass}" style="${wStyle}">
                <div>${imgHTML1}</div>
                <div class="mh1-ns mv1 mv0-ns">${imgHTML2}</div>
                <div>${imgHTML3}</div>
            </div>
        </div>
        `;
    }

    async function threeBigImages2(imgSpecs, marginClasses, fullWidth) {
        let fwClasses = fullWidth ? "full-width cb" : "";
        let phClass = fullWidth ? "ph1-m ph3-l" : "";
        return `
        <div class="${fwClasses} flex justify-center ${phClass} ${marginClasses}">
            <div class="flex flex-wrap flex-nowrap-ns justify-center media-max-width">
                <div>${await imgSpecToHTML2(imgSpecs[0])}</div>
                <div class="mh1-ns mv1 mv0-ns">${await imgSpecToHTML2(imgSpecs[1])}</div>
                <div>${await imgSpecToHTML2(imgSpecs[2])}</div>
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
     * API:
     *
     * "path"                                   single image
     * ["path"]                                 single image
     * [["path"]]                               single image
     * [["path1", "path2"]]                     side by side
     * ["path1", "path2"]                       single image, single image
     * ["path1", ["path2", "path3"]]            single image, side by side
     * [["path1", "path2"], ["path3", "path4"]] side by side, side by side
     *
     * Each string can be replaced by an object to specify more options.
     *
     * {path: "path", maxHeight: "500px"}       single image
     * [[                                      side by side
     *     {path: "path", maxHeight: "500px"},
     *     {path: "path", maxHeight: "500px"}
     * ]]
     * etc.
     *
     * Video can be specified:
     * { vimeoInfo: "733916865?h=fd53e75a74", videoStyle: "width: 100%; aspect-ratio: 16 / 9; max-width: 1252px;"}
     *
     * Second arg is to add BG image blur stretch for single img(s) to full width.
     *
     * Example:
     * {% img [
     *     ["path1", "path2"],
     *     ["path3", "path4"],
     *     "baz",
     *     {path: "path", maxHeight: "500px"},
     *     {path: "path", extraClasses: "bar"},
     *     {path: "path", maxHeight: "500px", extraClasses: "bar"},
     *     {vimeoInfo: "733917188?h=25f2f93194", videoStyle: "width: 100%; aspect-ratio: 2;"},
     *     [{path: "path2", maxHeight: "500px"},{path: "path3", maxHeight: "500px"}]
     * ], true %}
     *
     * Third arg is whether to make full width. Can pass false to not stretch.
     */
    eleventyConfig.addShortcode("img", async function (imgs, blurStretchSingles = false, fullWidth = true) {
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
                    buf += await oneBigImage(row[0], m, blurStretchSingles, fullWidth);
                    break;
                case 2:
                    buf += await twoBigImages(row, m, fullWidth);
                    break;
                case 3:
                    buf += await threeBigImages(row, m, fullWidth);
                    break;
                default:
                    buf += 'UNSUPPORTED IMG ROW ARRAY LENGTH: ' + row.length;
                    break;
            }
        }

        return "<md-raw>" + buf + "</md-raw>";
    });

    /**
     * New image shortcode with a width-limiting div. Ditches svg blur bg.
     * @param img - see `img` shortcode for API.
     * @param options - {
     *   fullWidth: boolean, default: true
     * }
     */
    eleventyConfig.addShortcode("img2", async function (imgs, options = {}) {
        // extract fullWidth from options, default to true if not set
        let fullWidth = options.hasOwnProperty('fullWidth') ? options.fullWidth : true;

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
                    buf += await oneBigImage2(row[0], m, fullWidth);
                    break;
                case 2:
                    buf += await twoBigImages2(row, m, fullWidth);
                    break;
                case 3:
                    buf += await threeBigImages2(row, m, fullWidth);
                    break;
                default:
                    buf += 'UNSUPPORTED IMG ROW ARRAY LENGTH: ' + row.length;
                    break;
            }
        }

        return "<md-raw>" + buf + "</md-raw>";
    });


    eleventyConfig.addShortcode("thumb", async function (path, widths, classes = "", style = "") {
        // NOTE: use if benchmarking w/o Eleventy Image
        // return `<img src='${path}'/>`;
        if (!Array.isArray(widths)) {
            widths = [widths];
        }
        let metadata = await Image((path[0] == "/" ? path.substring(1) : path), {
            widths: widths,
            formats: ["auto"],
            outputDir: "./_site/assets/eleventyImgs/",
            urlPath: "/assets/eleventyImgs/",
        });
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
        let localPath = path[0] == "/" ? path.substring(1) : path;
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

    eleventyConfig.addShortcode("coverImg", async function (path, classes = "", style = "") {
        // NOTE: use if benchmarking w/o Eleventy Image
        // return `<img src='${path}'/>`;
        let localPath = path[0] == "/" ? path.substring(1) : path;
        let [w, h] = getImageSize(sizeCache, localPath);

        let ws = [];
        while (w > 500) {
            ws.push(w);
            w = Math.round(w / 2);
        }

        let metadata = await Image(localPath, {
            widths: ws,
            formats: ["auto"],
            outputDir: "./_site/assets/eleventyImgs/",
            urlPath: "/assets/eleventyImgs/",
        });
        let opts = {
            sizes: "100vw",
            class: classes,
            style: style,
            // cover image is @ page top, so we actually want it to load ASAP
            // loading: "lazy",
            // decoding: "async",
            alt: "",
        };
        let thB64 = await loadAndHashImage(thumbhashCache, localPath);
        if (thB64 != null) {
            opts["data-thumbhash-b64"] = thB64;
        }
        return Image.generateHTML(metadata, opts);
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
    eleventyConfig.addNunjucksShortcode(
        "cityMap", (
            pathOrPaths,
            attribution = true,
            mt = true,
            mb = true,
            imgExClasses = "",
            embedded = false,
            firstImgClass = "",
            plainBig = false,
        ) => {
        let paths = pathOrPaths;
        if (!Array.isArray(paths)) {
            paths = [paths];
        }
        const isX = paths.length > 1;  // X = "transition"
        const divBGColorStyle = embedded ? "" : (plainBig ? "" : "background-color: #FCEEE1;");
        const divWidthClass = embedded ? "" : "full-width";
        const figClasses = mt && mb ? "fig" : (mt && !mb ? "figtop" : (mb && !mt ? "figbot" : ""));
        const containerXClasses = isX ? "transitionContainer" : "";
        const containerXStyle = isX ? "display: grid;" : "";
        const imageClasses = embedded ? "br-100" : (plainBig ? "" : "content-width");
        const imageStyleSize = plainBig ? "max-height: min(100vh, 1000px); max-width: min(100%, 1000px);" : "";

        let basePieces = [];
        basePieces.push(`<div style="${divBGColorStyle} ${containerXStyle}" class="${divWidthClass} cb ${figClasses} ${containerXClasses}">`);
        for (let i = 0; i < paths.length; i++) {
            const imgXClasses = isX ? `fader z-${i} o-${i == paths.length - 1 ? 1 : 0}` : "";
            const imgXStyleAttr = isX ? `style="grid-area: 1 / 1 / 2 / 2; transition: opacity 0.75s; ${imageStyleSize}"` : `style="${imageStyleSize}"`;
            basePieces.push(`<img class="novmargin ${imageClasses} ${imgXClasses} ${imgExClasses} ${i == 0 ? firstImgClass : ''}" ${imgXStyleAttr} src="${paths[i]}" loading="lazy" decoding="async" />`)
        }
        basePieces.push(`</div>`);
        const base = basePieces.join("\n");

        const attr = `<p class="full-width pr2 pr3-ns figcaption attribution">
Map by me, made with <a href="https://github.com/marceloprates/prettymaps/">marceloprates/prettymaps</a>. Data &copy; OpenStreetMap contributors.
</p>`;
        return attribution ? base + attr : base;
    });

    eleventyConfig.addShortcode("cityPic", async function (path) {
        // With getMarginClasses(...), we're pretending it's the last img of a set.
        // Right now this gets us `mt1 figbot`.
        return await oneBigImage(path, getMarginClasses(1, 2), true, true, false)
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
            permalink: markdownItAnchor.permalink.linkAfterHeader({
                class: "dn",
                style: 'visually-hidden',
                assistiveText: title => `Permalink to “${title}”`,
                visuallyHiddenClass: 'dn',
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
