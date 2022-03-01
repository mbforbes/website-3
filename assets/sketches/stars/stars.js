function setup() {
    createCanvas(windowWidth, windowHeight);
}
// state
let coolFont = null;
let ready = false;
// symmetric, but trivial just to fill out (i,j) and (j,i) and tiny, so did it
function getSqDistances(points) {
    let res = Array(points.length);
    for (let i = 0; i < points.length; i++) {
        res[i] = Array(points.length);
    }
    for (let i = 0; i < points.length; i++) {
        let [x1, y1, _] = points[i];
        for (let j = 0; j < points.length; j++) {
            if (i == j) {
                res[i][j] = 0;
                continue;
            }
            let [x2, y2, _] = points[j];
            let d = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
            res[i][j] = d;
            res[j][i] = d;
        }
    }
    return res;
}
/**
 * Minimum spanning tree.
 *
 * @param costs n x n, such that (i,j) == (j,i) == cost of i <--> j
 * @returns n x 2, such that each entry [i, j] is in the
 */
function mst(costs) {
    // Naive n^3 implementation of Prim's algorithm.
    let todo = Array.from(Array(costs.length).keys()); // 0 .. n-1
    let done = [todo.pop()];
    let tree = [];
    while (todo.length > 0) {
        let minLen = Infinity;
        let minVi = null;
        let minVo = null;
        // find shortest edge that connects something in tree to something out of it
        for (let i of done) {
            for (let o of todo) {
                if (costs[i][o] < minLen) {
                    minLen = costs[i][o];
                    minVi = i;
                    minVo = o;
                }
            }
        }
        tree.push([minVi, minVo]);
        todo.splice(todo.indexOf(minVo), 1);
        done.push(minVo);
    }
    return tree;
}
class Orchestrator {
    constructor(funcs, rewind = 1) {
        this.funcs = funcs;
        this.rewind = rewind;
        this.coreDuration = -1;
        this.duration = -1;
        this.elapsed = 0;
        // compute total time by slowest finishing func
        let latest = 0;
        for (let func of funcs) {
            latest = Math.max(latest, func.delay + func.duration);
        }
        this.coreDuration = latest;
        this.duration = latest + rewind;
    }
    /**
     * @returns whether done
     */
    update() {
        if (this.elapsed < this.coreDuration) {
            // normal: playing forward after delays
            for (let func of this.funcs) {
                if (this.elapsed >= func.delay) {
                    let localDuration = this.elapsed - func.delay;
                    let portion = Math.min(1.0, localDuration / func.duration);
                    func.func(portion);
                }
            }
        }
        else {
            // rewind everything at once
            let rewindPortion = (this.duration - this.elapsed) / this.rewind;
            for (let func of this.funcs) {
                func.func(rewindPortion);
            }
        }
        this.elapsed += 0.016667;
        return this.elapsed >= this.duration;
    }
}
// settings
const nBGPoints = 1000;
const rangeNCPoints = [4, 8];
const beg = ["beep", "crep", "flanm", "tre-dab", "quarlap"];
const mid = ["an", "crep", "fo", "peb", "toup", "yep"];
const end = ["blabadoob", "blabn", "blang", "blao", "boop", "cher-flao", "chla", "flegan", "raln"];
// state
let orchestrator = null;
let sounds = {};
function drawBG(bgPoints, cPoints) {
    let played = false;
    return (portion) => {
        if (!played) {
            let soundName = "stars-" + Math.floor(random(1, 12));
            sounds[soundName].play();
            played = true;
        }
        let color = (1 - portion) * 255;
        fill(color);
        stroke(color);
        strokeWeight(1);
        for (let i = 0; i < bgPoints.length * portion; i++) {
            // for (let [x, y, d] of bgPoints) {
            let [x, y, d] = bgPoints[i];
            circle(x, y, d);
        }
        for (let [x, y, d] of cPoints) {
            circle(x, y, d);
        }
    };
}
function drawMST(tree, cPoints) {
    let played = false;
    return (portion) => {
        if (!played) {
            sounds["reveal"].play();
            played = true;
        }
        let color = (1 - portion) * 255;
        fill(color);
        stroke(color);
        strokeWeight(2);
        for (let [i, j] of tree) {
            let [x1, y1, _] = cPoints[i];
            let [x2, y2, __] = cPoints[j];
            line(x1, y1, x2, y2);
        }
    };
}
function drawWindow() {
    return (portion) => {
        let color = (1 - portion) * 255;
        fill(255, 230);
        stroke(255, 230);
        strokeWeight(2);
        // TODO: make width larger if screen narrow
        rect(0, windowHeight / 2 + windowHeight / 6, windowWidth, windowHeight / 8);
    };
}
function transform(x, y, w, h, offset_x, offset_y) {
    return [offset_x + (x / windowWidth) * w, offset_y + (y / windowHeight) * h];
}
function drawPreview(tree, cPoints) {
    const pad = 20;
    // TODO: instead of square, respect aspect ratio
    const h = windowHeight / 8 - pad * 2;
    const w = (windowWidth / windowHeight) * h;
    const offset_x = windowWidth / 2 - windowWidth / 6 + pad;
    const offset_y = windowHeight / 2 + windowHeight / 6 + pad;
    return (portion) => {
        // frame
        stroke((1 - portion) * 255);
        fill((1 - portion) * 100);
        strokeWeight(1);
        fill(255);
        rect(offset_x, offset_y, w, h);
        // tree
        stroke((1 - portion) * 255);
        fill((1 - portion) * 255);
        strokeWeight(2);
        for (let [i, j] of tree) {
            let [x1, y1, _] = cPoints[i];
            let [nx1, ny1] = transform(x1, y1, w, h, offset_x, offset_y);
            let [x2, y2, __] = cPoints[j];
            let [nx2, ny2] = transform(x2, y2, w, h, offset_x, offset_y);
            line(nx1, ny1, nx2, ny2);
        }
    };
}
function drawName(namePieces) {
    let played = false;
    return (portion) => {
        if (!played) {
            sounds[namePieces[0]].play();
            let delay = 750;
            for (let i = 1; i < namePieces.length; i++) {
                setTimeout(function () {
                    sounds[namePieces[i]].play();
                }, delay * i);
            }
            played = true;
        }
        let color = (1 - portion) * 255;
        fill(color);
        stroke(color);
        strokeWeight(1);
        textAlign("left", "center");
        textFont(coolFont);
        textSize(36);
        if (windowWidth < 800) {
            textSize(24);
        }
        text(namePieces.join(" "), windowWidth / 2, windowHeight / 2 + windowHeight / 6 + windowHeight / 16);
    };
}
function hold() {
    return (portion) => { };
}
function sample(a) {
    return a[Math.floor(Math.random() * a.length)];
}
function draw() {
    background("#ffffff");
    // this pattern is probably bad for branch prediction and JIT (or maybe not 🤷‍♂️).
    // hopefully will think of a cleaner way.
    if (!ready) {
        return;
    }
    // generate
    if (orchestrator == null) {
        let bgPoints = [];
        let cPoints = [];
        for (let i = 0; i < nBGPoints; i++) {
            bgPoints.push([random(0, windowWidth), random(0, windowHeight), random(1, 3)]);
        }
        let nCpoints = random(rangeNCPoints[0], rangeNCPoints[1] + 1);
        for (let i = 0; i < nCpoints; i++) {
            cPoints.push([random(windowWidth / 4, 3 * (windowWidth / 4)), random(windowHeight / 4, windowHeight / 2), random(4, 6)]);
        }
        let sqDistances = getSqDistances(cPoints);
        let tree = mst(sqDistances);
        let rngName = Math.random();
        let namePieces = null;
        if (rngName < 0.2) {
            namePieces = [sample(beg)];
        }
        else if (rngName < 0.66) {
            namePieces = [sample(beg), sample(mid), sample(end)];
        }
        else {
            namePieces = [sample(end)];
        }
        orchestrator = new Orchestrator([
            { delay: 0.5, duration: 1, func: drawBG(bgPoints, cPoints) },
            { delay: 2.5, duration: 2, func: drawMST(tree, cPoints) },
            { delay: 4.5, duration: 2, func: drawWindow() },
            { delay: 4.5, duration: 2, func: drawPreview(tree, cPoints) },
            { delay: 4.5, duration: 2, func: drawName(namePieces) },
            { delay: 7.5, duration: 0, func: hold() }
        ]);
    }
    if (orchestrator.update()) {
        orchestrator = null;
    }
    ;
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function preload() {
    coolFont = loadFont("/assets/sketches/stars/fonts/Baybayin-Doctrina.otf");
    const dirPrefix = '/assets/sketches/stars/audio/';
    for (let pack of [beg, mid, end]) {
        for (let soundName of pack) {
            // @ts-ignore
            sounds[soundName] = new Howl({ src: [dirPrefix + soundName + '.mp3'] });
        }
    }
    for (let soundName of ["hi", "reveal"]) {
        // @ts-ignore
        sounds[soundName] = new Howl({ src: [dirPrefix + soundName + '.mp3'] });
    }
    for (let i = 1; i <= 11; i++) {
        let soundName = "stars-" + i;
        // @ts-ignore
        sounds[soundName] = new Howl({ src: [dirPrefix + soundName + '.mp3'] });
    }
}
$(function () {
    console.log("hiiiiiiiiii");
    $("#readybutton").on("click", function () {
        $("#readybox").addClass("go-down o-0");
        // TODO: actually remove it (pointer still pointy)
        $("#container").delay(500).remove();
        setTimeout(function () {
            ready = true;
        }, 1500);
        sounds["hi"].play();
        // sounds["cher-flao"].play();
        // let sndEl = ($("#click").get(0) as HTMLAudioElement);
        // sndEl.volume = 0.3;
        // sndEl.play()
    });
    $("#readybox").removeClass("o-0").addClass("go-up");
});
