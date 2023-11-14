const html = require("../../common").html;

function testFunction() {
  return "Hello from within a function called testFunction!";
}

// @prettier: ignore
function testFunctionWithThis(ths) {
  return ths.md("Hello from `testFunctionWithThis()` that can _render_ **markdown**.");
}

class JSTemplateTestPage {
  data() {
    // Here, `this` is just the class instance.
    // console.log(this);
    // => JSTemplateTestPage {}
    return {
      title: "JS Template Test Page",
      date: "2023-11-12",
      // The data cascade w/ *.json files don't work correctly with .11ty.js
      // files because the JSON is rendered w/ nunjucks?
      // https://github.com/11ty/eleventy/issues/588#issuecomment-506837969
      // So we have to build the /garage/{{ fileSlug }}/ here manually ourselves.. on every page?
      permalink: function (data) {
        // console.log(this);
        // => {
        //     slug: [Function (anonymous)],
        //     slugify: [Function (anonymous)],
        //     url: [Function (anonymous)],
        //     log: [Function (anonymous)],
        //     serverlessUrl: [Function (anonymous)],
        //     getCollectionItemIndex: [Function (anonymous)],
        //     getCollectionItem: [Function (anonymous)],
        //     getPreviousCollectionItem: [Function (anonymous)],
        //     getNextCollectionItem: [Function (anonymous)],
        //     primaryCollection: [Function (anonymous)],
        //     stripAnchor: [Function (anonymous)],
        //     getAnchorReadable: [Function (anonymous)],
        //     cleanExcerpt: [Function (anonymous)],
        //     img2: [Function (anonymous)],
        //     img2i: [Function (anonymous)],
        //     thumb: [Function (anonymous)],
        //     thumbhash: [Function (anonymous)],
        //     sketch: [Function (anonymous)],
        //     coverImg: [Function (anonymous)],
        //     cityMap: [Function (anonymous)],
        //     cityPic: [Function (anonymous)],
        //     readableDate: [Function (anonymous)],
        //     htmlDateString: [Function (anonymous)],
        //     head: [Function (anonymous)],
        //     min: [Function (anonymous)],
        //     filterTagList: [Function (anonymous)],
        //     month3: [Function (anonymous)],
        //     day2: [Function (anonymous)],
        //     year4: [Function (anonymous)],
        //     md: [Function (anonymous)],
        //     keys: [Function (anonymous)],
        //     highlight: [Function (anonymous)]
        //   }

        // console.log(data);
        // => {
        //     link_graph: {
        //       '/blog/blank-screen-manifesto/': {
        //         incoming: [],
        //         outgoing: [],
        //         title: 'Blank Screen Manifesto',
        //         url: '/blog/blank-screen-manifesto/'
        //       },
        //       ...
        //     },
        //     site: {
        //       title: 'Maxwell Forbes',
        //       url: 'https://maxwellforbes.com',
        //       language: 'en',
        //       description: 'Hello it is I, Max',
        //       feed: {
        //         subtitle: 'Hello is it I, Max',
        //         filename: 'feed.xml',
        //         path: '/feed/feed.xml',
        //         id: 'https://maxwellforbes.com/'
        //       },
        //       links: [ [Object], [Object], [Object] ],
        //       jsonfeed: {
        //         path: '/feed/feed.json',
        //         url: 'https://maxwellforbes.com/feed/feed.json'
        //       },
        //       author: { name: 'Maxwell Forbes', url: 'https://maxwellforbes.com/' }
        //     },
        //     eleventy: { ... }
        //     },
        //     pkg: { ...},
        //     layout: 'layouts/default.njk',
        //     tags: [ 'garage' ],
        //     permalink: [Function: permalink],
        //     title: 'JS Template Test Page',
        //     date: '2023-11-12',
        //     page: {
        //       date: 2023-11-12T00:00:00.000Z,
        //       inputPath: './posts/garage/js-template-test-page.11ty.js',
        //       fileSlug: 'js-template-test-page',
        //       filePathStem: '/posts/garage/js-template-test-page',
        //       outputFileExtension: 'html',
        //       templateSyntax: '11ty.js'
        //     },
        //     // NOTE: For some reason, when I first logged this, it had all the collections.
        //     // Now, it only has one collection (microblog)?
        //     collections: {
        //       microblog: [
        //         [Object], [Object],
        //         [Object], [Object],
        //         [Object], [Object],
        //         [Object], [Object],
        //         [Object], [Object],
        //         [Object], [Object],
        //         [Object], [Object]
        //       ]
        //     }
        //   }
        return `/garage/${data.page.fileSlug}/`;
      },
    };
  }

  async render(data) {
    // Here, `this` has all the functions (shortcodes) shown above, plus a `page` object:
    // console.log(this);
    // => JSTemplateTestPage {
    //     page: {
    //       date: 2023-11-12T00:00:00.000Z,
    //       inputPath: './posts/garage/js-template-test-page.11ty.js',
    //       fileSlug: 'js-template-test-page',
    //       filePathStem: '/posts/garage/js-template-test-page',
    //       outputFileExtension: 'html',
    //       templateSyntax: '11ty.js',
    //       url: '/garage/js-template-test-page/',
    //       outputPath: '_site/garage/js-template-test-page/index.html'
    //     },
    //     slug: [Function (anonymous)],
    //     slugify: [Function (anonymous)],
    //     ...
    // }
    //

    // data has everything from data in the permalink anonymous function in the
    // data() method, with the addition of (1) more complete `page` object (same
    // as `this`), (2) complete `collections` object including a tagList
    // "collection".
    // console.log(data);
    // => {
    // ...
    // page: {
    //     date: 2023-11-12T00:00:00.000Z,
    //     inputPath: './posts/garage/js-template-test-page.11ty.js',
    //     fileSlug: 'js-template-test-page',
    //     filePathStem: '/posts/garage/js-template-test-page',
    //     outputFileExtension: 'html',
    //     templateSyntax: '11ty.js',
    //     url: '/garage/js-template-test-page/',
    //     outputPath: '_site/garage/js-template-test-page/index.html'
    //   },
    //   collections: {
    //     microblog: [
    //        ...
    //     ],
    //     garage: [
    //       ...
    //     ],
    //     ...
    //     ],
    //     tagList: [
    //       'microblog',           'garage',
    //       'devlog',              'til',
    //       'react',               'typescript',
    //       'meta',                'blog',
    //       'studio',              'writing',
    //       'creating & thinking', 'health',
    //       'project',             'design',
    //       'programming',         'software',
    //       'travel',              'sketch',
    //       'news',                'research'
    //     ]
    //   }
    // }

    // We can render nunjucks templates still with
    //
    // ${await this.renderTemplate(
    //   `{% include "programming-language-tooltips.njk" %}`,
    //   "njk"
    // )}
    //
    // It will have not have the collections variable, but it has:
    // page: {
    //   date: 2023-11-12T22:29:52.717Z,
    //   inputPath: './studio2.11ty.js',
    //   fileSlug: 'studio2',
    //   filePathStem: '/studio2',
    //   outputFileExtension: 'html',
    //   templateSyntax: '11ty.js',
    //   url: '/studio2/',
    //   outputPath: '_site/studio2/index.html'
    // }
    //
    // eleventy: {
    //  version: '2.0.1',
    //  generator: 'Eleventy v2.0.1',
    //  env: {
    //    source: 'cli',
    //    runMode: 'serve',
    //    config: '/Users/max/repos/website-3/.eleventy.js',
    //    root: '/Users/max/repos/website-3',
    //    isServerless: false
    //  }
    //}

    return html`
      <p>This page is: ${data.title}</p>
      <p>This is a simple test of a JavaScript template in Eleventy.</p>
      <p>${testFunction()}</p>
      <p>${testFunctionWithThis(this)}</p>
      <p>Let's try an image by awaiting an async shortcode:</p>
      <p>${await this.img2i("/assets/posts/2023-taipei/IMG_0870.moz80.jpg")}</p>
    `;
  }
}

module.exports = JSTemplateTestPage;
