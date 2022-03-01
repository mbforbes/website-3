var Constants;
(function (Constants) {
    Constants.TWO_PI = 2 * Math.PI;
    Constants.TWO_THIRD_PI = (2 * Math.PI) / 3;
    Constants.EPSILON = 1e-5;
})(Constants || (Constants = {}));
/**
 * Clamps angle (in radians) to be 0 <= angle <= 2*pi
 */
function angleClamp(angle) {
    angle %= Constants.TWO_PI;
    if (angle < 0) {
        angle += Constants.TWO_PI;
    }
    return angle;
}
class Point {
    constructor(_x = 0, _y = 0) {
        this._x = _x;
        this._y = _y;
    }
    get x() {
        return this._x;
    }
    set x(val) {
        if (isNaN(val)) {
            throw Error('Tried to set x to NaN!');
        }
        this._x = val;
    }
    get y() {
        return this._y;
    }
    set y(val) {
        if (isNaN(val)) {
            throw Error('Tried to set y to NaN!');
        }
        this._y = val;
    }
    /**
     * Returns new Point from array with two numbers.
     * @param array
     */
    static from(array) {
        return new Point(array[0], array[1]);
    }
    /**
     * Returns manhattan distance to other point.
     */
    manhattanTo(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return Math.abs(dx) + Math.abs(dy);
    }
    /**
     * Returns squared distance to other point. Useful for comparisons where
     * relative distance is all that matters so you can avoid spending the sqrt.
     */
    sqDistTo(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return dx * dx + dy * dy;
    }
    distTo(other) {
        return Math.sqrt(this.sqDistTo(other));
    }
    /**
     * Returns angle from this to other (in radians, clamped in [0, 2*pi]).
     */
    angleTo(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return angleClamp(Math.atan2(dy, dx));
    }
    /**
     * Returns angle from this to other (in radians, clamped in [0, 2*pi]),
     * accounting for y-down coordinate system.
     */
    pixiAngleTo(other) {
        const dx = other.x - this.x;
        // y distances are actually reversed (due to y-down coordinate system)
        const dy = -(other.y - this.y);
        return angleClamp(Math.atan2(dy, dx));
    }
    /**
     * Also rounds.
     */
    toString() {
        let x = Math.round(this.x * 100) / 100;
        let y = Math.round(this.y * 100) / 100;
        return '(' + x + ', ' + y + ')';
    }
    toCoords() {
        return [this.x, this.y];
    }
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    // l2 norm, squared
    l2Squared() {
        return this.dot(this);
    }
    // l2 norm
    l2() {
        return Math.sqrt(this.l2Squared());
    }
    /**
     * Scales each coordinate of point by alpha. Returns this.
     */
    scale_(alpha) {
        this.x *= alpha;
        this.y *= alpha;
        return this;
    }
    /**
     * Element-wise clamp each component to be within [min, max]. Returns this.
     * @param min
     * @param max
     */
    clampEach_(min, max) {
        this.x = Math.min(Math.max(this.x, min), max);
        this.y = Math.min(Math.max(this.y, min), max);
        return this;
    }
    /**
     * Make this unit norm. Returns this.
     */
    normalize_() {
        return this.scale_(1 / this.l2());
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    equalsCoords(x, y) {
        return this.x === x && this.y === y;
    }
    isZero() {
        return this.equalsCoords(0, 0);
    }
    /**
     * Mutates and returns this.
     * @param other
     */
    add_(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    /**
     * Mutates and returns this.
     * @param s
     */
    addScalar_(s) {
        this.x += s;
        this.y += s;
        return this;
    }
    /**
     * Returns a new Point that is this - other.
     * @param other
     */
    subNew(other) {
        let res = new Point();
        this.sub(other, res);
        return res;
    }
    /**
     * Returns (`this` - `other`) in `out`.
     * @param other
     * @param out
     */
    sub(other, out) {
        out.x = this.x - other.x;
        out.y = this.y - other.y;
    }
    /**
     * Returns new point.
     */
    copy() {
        return new Point(this.x, this.y);
    }
    copyTo(other) {
        other.x = this.x;
        other.y = this.y;
    }
    /**
     * Returns: this.
     */
    copyFrom_(other) {
        this.x = other.x;
        this.y = other.y;
        return this;
    }
    set_(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    setFrom_(coords) {
        this.set_(coords[0], coords[1]);
        return this;
    }
    rotate_(theta) {
        // sin / cos of angle used below
        const sin_t = Math.sin(theta);
        const cos_t = Math.cos(theta);
        const sin_a = cos_t;
        const cos_a = sin_t;
        const x_x = this.x * cos_t;
        const x_y = this.x * sin_t;
        const y_x = this.y * cos_a;
        const y_y = this.y * sin_a;
        this.x = x_x - y_x;
        this.y = x_y + y_y;
        return this;
    }
}
// tweens
/**
 * Helper to ensure output is in [0, 1].
 */
function _clamp(raw) {
    return Math.max(Math.min(raw, 1), 0);
}
function tweenLinear(portion) {
    return _clamp(portion);
}
// some of the below adapted from
// https://github.com/tweenjs/tween.js/blob/master/src/Tween.js
function tweenInOutQuartic(portion) {
    let val = 0;
    let doubled = portion * 2;
    if (portion < 0.5) {
        val = 0.5 * doubled * doubled * doubled * doubled;
    }
    else {
        let scaled = doubled - 2;
        val = -0.5 * (scaled * scaled * scaled * scaled - 2);
    }
    return _clamp(val);
}
/// <reference path="common.ts" />
/// <reference path="tweens.ts" />
// immutable globals
let CANVAS_W = 190;
let CANVAS_H = 190;
// mutable globals
let LOCAL_TWEEN = tweenInOutQuartic;
let ENABLED = {};
let BIG_INSTANCE = null;
// shapes
class Shape {
    constructor(p5js, basePos) {
        this.p5js = p5js;
        this.basePos = basePos;
        this.portion = 1;
        this.majorPos = new Point();
        this.minorPos = new Point();
        this.rotation = 0;
        this.opacity = 0;
        this.scale = 1;
        this.visible = 1;
        this.pos = new Point();
    }
}
class Circle extends Shape {
    constructor(p5js, basePos, baseRadius) {
        super(p5js, basePos);
        this.baseRadius = baseRadius;
        this.indicatorCur = new Point();
        this.blurred = false;
    }
    draw() {
        // calculate final position and radius
        this.pos.copyFrom_(this.basePos).add_(this.majorPos).add_(this.minorPos);
        let radius = this.baseRadius * this.scale;
        // do some little rotation for nice effect
        this.rotation = angleClamp(this.rotation + 0.01);
        // render settings
        this.p5js.noFill();
        this.p5js.stroke(245, 253, 255);
        // always draw the line indicator
        this.indicatorCur.set_(radius / 2, 0).rotate_(this.rotation);
        this.p5js.line(this.pos.x, this.pos.y, this.pos.x + this.indicatorCur.x, this.pos.y + this.indicatorCur.y);
        // only draw rest if portion > 0 and visible
        if (this.portion < Constants.EPSILON || !this.visible) {
            return;
        }
        // render full shape
        this.p5js.fill(245, 253, 255, this.opacity * 255);
        this.p5js.arc(this.pos.x, this.pos.y, radius, radius, this.rotation, this.rotation + (this.portion * Constants.TWO_PI), this.p5js.PIE);
    }
}
// tickers
/**
 * Tick a global tick counter forward.
 * @param cur
 */
function globalTick(tCtx) {
    // settings
    const inc = 0.005;
    const pause = 0.5;
    // easy case: tick forward
    if (tCtx.globalPortion < 1.0) {
        tCtx.globalPortion = Math.min(1, tCtx.globalPortion + inc);
        return;
    }
    // if we were at or above 1, increment the buffer if it hasn't reached its max
    if (tCtx.globalPause < pause) {
        tCtx.globalPause += inc;
        return;
    }
    // if we've reached this point, we've maxed out both the time and the pause. so
    // reset.
    tCtx.globalPortion = 0;
    tCtx.globalPause = 0;
    return;
}
/**
 * Two-cycle ticker. Portion goes from 0 to 1 in each of two cycles.
 *
 * @returns [(int) cycle in [0, 1], (float) portion in [0, 1]]
 */
function ticker2(tCtx) {
    console.assert(tCtx.globalPortion >= 0.0);
    console.assert(tCtx.globalPortion <= 1.0);
    let cycle = tCtx.globalPortion < 0.5 ? 0 : 1;
    let localPortion = cycle == 0 ? tCtx.globalPortion / 0.5 : (tCtx.globalPortion - 0.5) / 0.5;
    return [cycle, tCtx.localTween(localPortion)];
}
/**
 * Three-cycle ticker. Portion goes from 0 to 1 in each of three cycles.
 *
 * @returns [(int) cycle in [0, 1, 2], (float) portion in [0, 1]]
 */
function ticker3(tCtx) {
    console.assert(tCtx.globalPortion >= 0.0);
    console.assert(tCtx.globalPortion <= 1.0);
    const third = 0.33333;
    const two_thirds = 0.66666;
    let cycle = 0;
    if (tCtx.globalPortion > third && tCtx.globalPortion <= two_thirds) {
        cycle = 1;
    }
    else if (tCtx.globalPortion > two_thirds) {
        cycle = 2;
    }
    let base = cycle * third;
    let localPortion = (tCtx.globalPortion - base) / third;
    return [cycle, tCtx.localTween(localPortion)];
}
// modifiers
function modifyOutline(shape, tCtx) {
    let [cycle, cyclePortion] = ticker2(tCtx);
    // outline shrinks from full in cycle 0, then grows to full in cycle 1.
    let portion = cycle == 0 ? 1 - cyclePortion : cyclePortion;
    shape.portion = portion;
}
let minorPosOffsetFull = new Point(40, -40);
let minorPosOffsetBuffer = new Point();
function modifyMinorPos(shape, tCtx) {
    let [cycle, cyclePortion] = ticker2(tCtx);
    // moves upper right in cycle 0, then back down in cycle 1.
    let portion = cycle == 0 ? cyclePortion : 1 - cyclePortion;
    minorPosOffsetBuffer.copyFrom_(minorPosOffsetFull).scale_(portion);
    shape.minorPos.copyFrom_(minorPosOffsetBuffer);
}
let majorPosOffsetFull = new Point(60, 0);
let majorPosOffsetBuffer = new Point();
function modifyMajorPos(shape, tCtx) {
    let [cycle, cyclePortion] = ticker3(tCtx);
    // moves clockwise around a circle in the three cycles
    let arc = (cycle / 3) * Constants.TWO_PI + cyclePortion * Constants.TWO_THIRD_PI;
    majorPosOffsetBuffer.copyFrom_(majorPosOffsetFull).rotate_(arc);
    shape.majorPos.copyFrom_(majorPosOffsetBuffer);
}
function modifyOpacity(shape, tCtx) {
    let [cycle, cyclePortion] = ticker2(tCtx);
    // fills on phase 0, empties on phase 1
    let portion = cycle == 0 ? cyclePortion : 1 - cyclePortion;
    shape.opacity = portion;
}
function modifyScale(shape, tCtx) {
    const minScale = 1;
    const maxScale = 2;
    let [cycle, cyclePortion] = ticker2(tCtx);
    // grows on phase 0, empties on phase 1
    let portion = cycle == 0 ? cyclePortion : 1 - cyclePortion;
    shape.scale = minScale + (portion * (maxScale - minScale));
}
function modifyRotation(shape, tCtx) {
    let [cycle, cyclePortion] = ticker2(tCtx);
    // grows on phase 0, empties on phase 1
    const quantity = 0.1;
    const direction = cycle == 0 ? 1 : -1;
    const amt = quantity * direction * (1 - cyclePortion);
    shape.rotation += amt;
}
function modifyFlicker(shape, tCtx) {
    let [cycle, cyclePortion] = ticker2(tCtx);
    const portion = cycle == 0 ? cyclePortion : 2 - cyclePortion;
    if (cyclePortion == 1) {
        shape.visible = 1;
    }
    else {
        shape.visible = Math.sin(portion * 25) > 0 ? 1 : 0;
    }
}
function makeSketchMouseOver(sketchState) {
    return () => {
        sketchState.hovering = true;
    };
}
function makeSketchMouseOut(sketchState) {
    return () => {
        sketchState.hovering = false;
    };
}
function makeSketchMouseDown(sketchState) {
    return () => {
        sketchState.selected = !sketchState.selected;
    };
}
function makeSketch(modifiers, sketchIndex, canvas_w = CANVAS_W, canvas_h = CANVAS_H) {
    return (p5js) => {
        let circle = null;
        let tCtx = null;
        let cnv = null;
        let sketchState = null;
        p5js.setup = () => {
            sketchState = {
                hovering: false,
                selected: false,
            };
            cnv = p5js.createCanvas(canvas_w, canvas_h);
            if (sketchIndex > -1) {
                cnv.mouseOver(makeSketchMouseOver(sketchState));
                cnv.mouseOut(makeSketchMouseOut(sketchState));
                cnv.mousePressed(makeSketchMouseDown(sketchState));
                cnv.elt.style.cursor = 'pointer';
            }
            let circleSize = sketchIndex == -1 ? 100 : 60;
            circle = new Circle(p5js, new Point(canvas_w / 2, canvas_h / 2), circleSize);
            tCtx = {
                globalPortion: 0,
                globalPause: 0,
                localTween: LOCAL_TWEEN,
            };
        };
        p5js.draw = () => {
            p5js.clear();
            if (sketchState.hovering && sketchState.selected) {
                p5js.background(83, 23, 23);
            }
            else if (sketchState.hovering) {
                p5js.background(0, 16, 66);
            }
            else if (sketchState.selected) {
                p5js.background(66, 0, 0);
            }
            else {
                p5js.background(35, 35, 35);
                // p5js.background(27, 27, 27)
            }
            // update any changes from globals
            tCtx.localTween = LOCAL_TWEEN;
            // change what's enabled based on click
            if (sketchIndex == -1) {
                // big sketch; read from global list
                modifiers = [];
                for (let k in ENABLED) {
                    for (let m of ENABLED[k]) {
                        modifiers.push(m);
                    }
                }
            }
            else {
                // small sketch --- update the global list
                if (sketchState.selected) {
                    ENABLED[sketchIndex] = modifiers;
                }
                else {
                    ENABLED[sketchIndex] = [];
                }
            }
            // tick locally
            globalTick(tCtx);
            // run any modifiers
            modifiers.forEach((modifier) => {
                modifier.call(null, circle, tCtx);
            });
            // draw
            circle.draw();
        };
    };
}
function getD() {
    let d = document.getElementById('big-container').clientWidth - 20;
    return Math.min(500, d);
}
document.addEventListener('DOMContentLoaded', function (event) {
    // big boy
    let node = document.createElement('div');
    node.className = 'top-holder';
    document.getElementById('big-container').appendChild(node);
    let d = getD();
    BIG_INSTANCE = new p5(makeSketch([], -1, d, d), node);
    BIG_INSTANCE.windowResized = function () {
        let d = getD();
        BIG_INSTANCE.resizeCanvas(d, d);
    };
    // let clear = document.createElement('div');
    // node.className = 'clear';
    // little boys
    let modifierWorklist = [
        [modifyOutline],
        [modifyMinorPos],
        [modifyMajorPos],
        [modifyOpacity],
        [modifyScale],
        [modifyRotation],
    ];
    for (let i = 0; i < modifierWorklist.length; i++) {
        let modifiers = modifierWorklist[i];
        let node = document.createElement('div');
        node.className = 'holder';
        document.getElementById('many-container').appendChild(node);
        new p5(makeSketch(modifiers, i), node);
    }
});
