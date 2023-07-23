const fs = require('fs');
const readdirp = require('readdirp');
const split = require('split');
const Image = require("@11ty/eleventy-img");
const { assert } = require('console');
const { wantWidths, getLocalPath, getImageSize, serializeMapSync, INLINE_11TYIMG_CACHE_PATH } = require("./common.js");

function preprocessInlineMDEleventyImg() {
    const imageRegex = /!\[.*\]\((.*?)\)/g;
    const dummySizeCache = new Map();
    let promiseQueue = [];
    let localPaths = [];

    console.log("Searching all *.md files for inline images...");
    readdirp('.', {
        fileFilter: '*.md',
        directoryFilter: ['!*node_modules']
    })
        .on('data', (entry) => {
            const stream = fs.createReadStream(entry.path);

            stream
                .pipe(split())
                .on('data', (line) => {
                    let match;
                    while ((match = imageRegex.exec(line)) !== null) {
                        // NOTE: Could read cache first and skip ones that are
                        // already done. It's fast once the files exist though
                        // so I think it's fine to keep as is.

                        // console.log(`Match found in file ${entry.path}: ${match[1]}`);
                        // console.log(match[1]);
                        const path = match[1];
                        const localPath = getLocalPath(path);
                        const [w, h] = getImageSize(dummySizeCache, localPath);
                        // NOTE: Could explicitly add multipliers of inline
                        // width (704px), though (a) don't want too many
                        // options, (b) smaller devices will be using 100vw w/
                        // various @X densities (rather than 704px), so they
                        // will need random sizes anyway.
                        const ws = wantWidths(w);
                        localPaths.push(localPath);
                        promiseQueue.push(Image(localPath, {
                            widths: ws,
                            formats: ["auto"],
                            outputDir: "./_site/assets/eleventyImgs/",
                            urlPath: "/assets/eleventyImgs/",
                        }));
                    }
                })
                .on('error', (err) => {
                    console.error(`Error occurred while searching: ${err}`);
                });
        })
        .on('error', (err) => {
            console.error(`Error occurred while traversing files: ${err}`);
        })
        .on('end', () => {
            console.log("Finished searching files.");
            console.log("Waiting for EleventyImg to process " + promiseQueue.length + " images...");

            Promise.all(promiseQueue)
                .then((results) => {
                    // "results" is an array of results of all the promises
                    console.log("Finished processing images.");
                    assert(localPaths.length, results.length, 'paths/results len mismatch');
                    let resMap = new Map();
                    for (let i = 0; i < localPaths.length; i++) {
                        resMap.set(localPaths[i], results[i]);
                    }
                    serializeMapSync(resMap, INLINE_11TYIMG_CACHE_PATH);
                })
                .catch(error => {
                    // If any of the promises fail, this catch block will be executed
                    console.error("One of the promises failed with the following reason: ", error);
                });

        });
}

module.exports = {
    preprocessInlineMDEleventyImg,
}
