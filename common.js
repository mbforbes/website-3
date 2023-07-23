const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const getImageSizeFromDisk = require("image-size");
const { createCanvas, loadImage } = require("@napi-rs/canvas");
// Probably a better way to do this but I never figured it out.
const thumbhash = import("thumbhash"); // then await later


// File system operations.

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function fileExists(filePath) {
    try {
        fs.accessSync(filePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * @param {string} filePath
 */
function ensureDir(filePath) {
    const dirPath = path.dirname(filePath);
    try {
        fs.accessSync(dirPath);
    } catch (err) {
        if (err.code === 'ENOENT') {
            fs.mkdirSync(dirPath, { recursive: true });
        } else {
            throw err;
        }
    }
}

/**
 * You laugh, I already wrote three differently buggy versions of this.
 *
 * @param {string} path
 * @returns {boolean}
 */
function isSVG(path) {
    return path.toLowerCase().endsWith(".svg");
}

/**
 * Take server or local path, turn into local path.
 * - Server path = /assets/foo.ext
 * - Local path  =  assets/foo.ext
 *
 * @param {string} serverOrLocalPath
 * @returns {string}
 */
function getLocalPath(serverOrLocalPath) {
    const p = serverOrLocalPath;
    return p[0] == "/" ? p.substring(1) : p;
}

// Serialization operations

/**
 * @param {Map} map
 * @param {string} filePath
 */
function serializeMapSync(map, filePath) {
    const plainObject = Array.from(map);
    const jsonString = JSON.stringify(plainObject);
    ensureDir(filePath);
    fs.writeFileSync(filePath, jsonString);
    console.log("Wrote Map with " + map.size + " entries to " + filePath);
}


/**
 * @param {Map} map
 * @param {string} filePath
 */
async function serializeMapAsync(map, filePath) {
    const plainObject = Array.from(map);
    const jsonString = JSON.stringify(plainObject);
    ensureDir(filePath);
    await fsp.writeFile(filePath, jsonString);
    console.log("Wrote Map with " + map.size + " entries to " + filePath);
}

/**
 * @param {string} filePath
 * @returns {Map}
 */
function deserializeMap(filePath) {
    let exists = fileExists(filePath);
    if (!exists) {
        console.log("Cache file not found at " + filePath + ", making new Map");
        return new Map();
    }
    const jsonString = fs.readFileSync(filePath, 'utf-8');
    const plainObject = JSON.parse(jsonString);
    const ret = new Map(plainObject);
    console.log("Loaded Map with " + ret.size + " entries from " + filePath);
    return ret;
}


// Constants

const CACHE_DIR = path.join(__dirname, ".cache");
const TH_CACHE_PATH = path.join(CACHE_DIR, "thumbhash.map.json");
const SIZE_CACHE_PATH = path.join(CACHE_DIR, "sizes.map.json");
const INLINE_11TYIMG_CACHE_PATH = path.join(CACHE_DIR, "11tyimg-inline.map.json");


// Image operations

/**
 * Gets desired widths for image size reductions.
 *
 * @param {number} w
 * @returns {number[]}
 */
function wantWidths(w) {
    // We start from the base size and halve *through* the first one that's
    // below 500.
    let ws = [w];
    while (w > 500) {
        w = Math.round(w / 2);
        ws.push(w);
    }
    return ws;
}

/**
 *
 * @param {Map<string,[number,number]>} sizeCache Map from localPath to [width, height]
 * @param {string} localPath
 * @returns {[number,number]} [width, height]
 */
function getImageSize(sizeCache, localPath) {
    if (sizeCache.has(localPath)) {
        return sizeCache.get(localPath);
    }
    let { width, height, type } = getImageSizeFromDisk(localPath);
    if (width == null || height == null) {
        throw new Error("Failed to get width or height from " + localPath);
    }
    sizeCache.set(localPath, [width, height]);
    return [width, height];
}

const binaryToBase64 = (binary) => btoa(String.fromCharCode(...binary));

/**
 * Thanks to:
 * https://github.com/evanw/thumbhash/issues/2#issuecomment-1481848612
 *
 * Note that SVGs return null and don't get put in cache.
 *
 * @param {string} localPath
 * @returns {Promise<string|null>} base64-encoded thumbhash
 */
async function loadAndHashImage(thumbhashCache, localPath) {
    if (thumbhashCache.has(localPath)) {
        return thumbhashCache.get(localPath);
    }
    // We can encounter errors deep in the stack with (some?) SVGs:
    //
    //     unsupported unit type: <4>
    //     ...
    //     unsupported unit type: <4>
    //     ../../src/core/SkBitmap.cpp:250: fatal error: "assert(this->tryAllocPixels(info, rowBytes))"
    //
    // ... so we skip all of them for now. We could return a default hash, but thumbhashes encode the
    // aspect ratio, and that wouldn't.
    if (isSVG(localPath)) {
        return null;
    }

    let th = await thumbhash; // repeated awaiting doesn't seem to have much impact on time.

    const maxSize = 100;
    const image = await loadImage(localPath);
    const width = image.width;
    const height = image.height;

    const scale = Math.min(maxSize / width, maxSize / height);
    const resizedWidth = Math.round(width * scale);
    const resizedHeight = Math.round(height * scale);

    const canvas = createCanvas(resizedWidth, resizedHeight);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, resizedWidth, resizedHeight);

    // const imageData = ctx.getImageData(0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, resizedWidth, resizedHeight);
    const rgba = new Uint8Array(imageData.data.buffer);
    // binaryHash is a Uint8Array
    const binaryHash = th.rgbaToThumbHash(resizedWidth, resizedHeight, rgba);
    const hashB64 = binaryToBase64(binaryHash);
    thumbhashCache.set(localPath, hashB64);
    return hashB64;
}

module.exports = {
    isSVG,
    wantWidths,
    getLocalPath,
    serializeMapSync,
    serializeMapAsync,
    deserializeMap,
    getImageSize,
    loadAndHashImage,
    TH_CACHE_PATH,
    SIZE_CACHE_PATH,
    INLINE_11TYIMG_CACHE_PATH
}
