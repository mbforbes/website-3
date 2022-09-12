const { DateTime } = require("luxon");
const fs = require("fs");
const util = require("util");
// const pluginRss = require("@11ty/eleventy-plugin-rss"); // TODO
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
// const pluginNavigation = require("@11ty/eleventy-navigation"); // TODO
// const pluginLinkTo = require('eleventy-plugin-link_to');  // NOTE: if path prefix added
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItFootnote = require("markdown-it-footnote");
const markdownItReplacements = require('markdown-it-replacements');

module.exports = function (eleventyConfig) {
    // Copy some folders to the output
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("social-chemistry");
    eleventyConfig.addPassthroughCopy("CNAME");

    // Add plugins
    //   eleventyConfig.addPlugin(pluginRss); // TODO
    eleventyConfig.addPlugin(pluginSyntaxHighlight);
    //   eleventyConfig.addPlugin(pluginNavigation); // TODO
    // eleventyConfig.addPlugin(pluginLinkTo);  // NOTE: if path prefix added

    // TODO: consider
    // Alias `layout: post` to `layout: layouts/post.njk`
    //   eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

    // My custom filters

    const latestDateComp = (a, b) => { return a.date > b.date ? -1 : 1 }
    const seriesOrderComp = (a, b) => { return a.data.seriesOrder - b.data.seriesOrder }

    /**
     * Groups posts by series and date, ordered newest to oldest.
     * - each series is ordered by its latest post date
     * - non-series posts are interleaved according to their post dates, grouped into
     *   empty ("") series for convenience
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
    eleventyConfig.addNunjucksFilter("dateSeriesGroupBy", (arr) => {
        // build collection of posts and save series representative dates for sorting
        let items = [];
        let seriesInfo = {};
        for (let post of arr) {
            let series = post.data.series;
            // We sort by the `travel_end` field if it's there, because that's how posts will be displayed.
            let postDate = post.data.travel_end || post.date;
            if (!series || series == "") {
                items.push({
                    kind: "post",
                    date: postDate,
                    post: post,
                })
            } else {
                if (!seriesInfo[series]) {
                    seriesInfo[series] = {
                        date: postDate,
                        posts: [post],
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

        // console.log("Non series items:", items);
        // console.log("SeriesInfo:", seriesInfo);

        // add series to items for overall sorting
        for (let series in seriesInfo) {
            let info = seriesInfo[series];
            // console.log(series, info.posts.length);
            items.push({
                kind: "series",
                date: info.date,
                name: series,
                posts: info.posts,
            })
        }

        // latest first
        items.sort(latestDateComp)

        // two final operations:
        // 1. consecutive non-series posts should be aggregated into "" series groups
        // (for frontend convenience)
        // 2. series posts should be ordered by seriesOrder
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
                res.push({ series: item.name, posts: item.posts.sort(seriesOrderComp) })
                curNoSeries = { series: "", posts: [] };
            }
        }
        // push any final curSeries
        if (curNoSeries.posts.length > 0) {
            res.push(curNoSeries);
        }

        // console.log("Results:", res);
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

    // smart dump --- don't explode when there's a circular reference, which there is by
    // default on like all the objects.
    eleventyConfig.addNunjucksFilter('sdump', obj => {
        return util.inspect(obj)
    });


    // Note on URL filters:
    // I use:
    //     eleventyConfig.getFilter("url")(url)
    // in the shortcodes.
    // But, I never actually deploy to a different base (prefix)...
    // In 2.0, this will be replaced with a custom implementation
    // that mimics <base> (new HTML element) by rewriting URLs:
    //     https://www.11ty.dev/docs/plugins/html-base/
    // it would, honestly, be really nice to strip out the janky
    //     "{{ "foo" | url }}"
    // everywhere and just replace it with
    //     "foo"

    /**
     * @param img can be a str or obj.
     * - if obj and image, expects keys path (req) maxHeight (opt, default "939px")
     * - if obj and video, expect keys vimeoInfo (req), videoStyle (req), bgImgPath (opt, for blurStretchSingles)
     *
     * @returns [bgImgPath || "", HTML]
     */
    function imgSpecToHTML(img) {
        // video
        if (img.vimeoInfo) {
            let bgImgPath = "";
            if (img.bgImgPath) {
                bgImgPath = eleventyConfig.getFilter("url")(img.bgImgPath);
            }
            return [bgImgPath, `<iframe src="https://player.vimeo.com/video/${img.vimeoInfo}&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1" frameborder="0" allow="autoplay; picture-in-picture" style="${img.videoStyle}"></iframe>`]
        }

        // image
        let path;
        let maxHeight = "939px";
        if (typeof img === "string") {
            path = img;
        } else {
            path = img.path;
            maxHeight = img.maxHeight || maxHeight;
        }
        path = eleventyConfig.getFilter("url")(path);
        return [path, `<img class="db bare novmargin" src="${path}" style="max-height: min(100vh, ${maxHeight});">`];
    }

    function oneBigImage(imgSpec, marginClasses, blurStretchSingles) {
        let [bgImgPath, imgHTML] = imgSpecToHTML(imgSpec);
        let bgDiv = "";
        if (blurStretchSingles && bgImgPath != "") {
            bgDiv = `<div class="bgImageReady svgBlur" style="background-image: url(${bgImgPath})"></div>`;
        }

        // NOTE: the one image style could be
        // <div class="full-width ph1-m ph3-l">
        // <img src="foo" style="max-height: 500px;">
        // </div>
        // but using this so the <img ...> snippet is the same for all layouts.
        return `<div class="full-width flex justify-center ph1-m ph3-l ${marginClasses}">${bgDiv}${imgHTML}</div>`;
    }

    function twoBigImages(imgSpecs, marginClasses) {
        return `<div class="full-width flex flex-wrap flex-nowrap-ns justify-center ${marginClasses}">
<div class="ml1-m ml3-l mr1-ns mb1 mb0-ns">${imgSpecToHTML(imgSpecs[0])[1]}</div>
<div class="mr1-m mr3-l">${imgSpecToHTML(imgSpecs[1])[1]}</div>
</div>`;
    }

    function threeBigImages(imgSpecs, marginClasses) {
        return `<div class="full-width flex flex-wrap flex-nowrap-ns justify-center ${marginClasses}">
<div class="ml1-m ml3-l">${imgSpecToHTML(imgSpecs[0])[1]}</div>
<div class="mh1-ns mv1 mv0-ns">${imgSpecToHTML(imgSpecs[1])[1]}</div>
<div class="mr1-m mr3-l">${imgSpecToHTML(imgSpecs[2])[1]}</div>
</div>`;
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
     * "img"                                   single image
     * ["img"]                                 single image
     * [["img"]]                               single image
     * [["img1", "img2"]]                      side by side
     * ["img1", "img2"]                        single image, single image
     * ["img1", ["img2", "img3"]]              single image, side by side
     * [["img1", "img2"], ["img3", "img4"]]    side by side, side by side
     *
     * Each string can be replaced by an object to specify more options.
     *
     * {path: "img", maxHeight: "500px"}       single image
     * [[                                      side by side
     *     {path: "img", maxHeight: "500px"},
     *     {path: "img", maxHeight: "500px"}
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
     *     ["img1", "img2"],
     *     ["img3", "img4"],
     *     "baz",
     *     {path: "foo", size: "bar"},
     *     {vimeoInfo: "733917188?h=25f2f93194", videoStyle: "width: 100%; aspect-ratio: 2;"},
     *     [{path: "foo2", size: "bar2"},{path: "foo3", size: "bar3"}]
     * ], true %}
     */
    eleventyConfig.addNunjucksShortcode("img", (imgs, blurStretchSingles = false) => {
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
                    buf += oneBigImage(row[0], m, blurStretchSingles);
                    break;
                case 2:
                    buf += twoBigImages(row, m);
                    break;
                case 3:
                    buf += threeBigImages(row, m);
                    break;
                default:
                    buf += 'UNSUPPORTED IMG ROW ARRAY LENGTH: ' + row.length;
                    break;
            }
        }

        return buf;
    });

    eleventyConfig.addNunjucksShortcode("cityMap", (path) => {
        return `<div style="background-color: #FCEEE1" class="full-width">
<img class="content-width" src="${eleventyConfig.getFilter("url")(path)}">
</div>
<p class="full-width pr2 pr3-ns figcaption attribution">
Map by me, made with <a href="https://github.com/marceloprates/prettymaps/">marceloprates/prettymaps</a>. Data &copy; OpenStreetMap contributors.
</p>`;
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
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("dd LLL yyyy");
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
        .use(markdownItAnchor, {
            permalink: markdownItAnchor.permalink.linkAfterHeader({
                class: "dn",
                style: 'visually-hidden',
                assistiveText: title => `Permalink to “${title}”`,
                visuallyHiddenClass: 'dn',
            }),
            slugify: eleventyConfig.getFilter("slug")
        });
    eleventyConfig.setLibrary("md", markdownLibrary);

    // Override Browsersync defaults (used only with --serve)
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: function (err, browserSync) {
                const content_404 = fs.readFileSync('_site/404.html');

                browserSync.addMiddleware("*", (req, res) => {
                    // Provides the 404 content without redirect.
                    res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
                    res.write(content_404);
                    res.end();
                });
            },
        },
        ui: false,
        ghostMode: false
    });

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

    return {
        // Control which files Eleventy will process
        // e.g.: *.md, *.njk, *.html, *.liquid
        templateFormats: [
            "md",
            "njk",
            "html",
            "liquid"
        ],

        // Pre-process *.md files with: (default: `liquid`)
        markdownTemplateEngine: "njk",

        // Pre-process *.html files with: (default: `liquid`)
        htmlTemplateEngine: "njk",

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
