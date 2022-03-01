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
     * Mutates and returns this.
     * @param other
     */
    sub_(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
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
/// <reference path="common.ts" />
function getCanvasSize() {
    let d = document.getElementById('big-container').clientWidth - 20;
    return Math.min(500, d);
}
function makeSketch(canvas_w = 500, canvas_h = 500) {
    return (p5js) => {
        let cnv = null;
        let n = 100;
        let circles = [];
        let mousePos = new Point();
        let cacheDelta = new Point();
        p5js.setup = () => {
            cnv = p5js.createCanvas(canvas_w, canvas_h);
            let p = new Point(canvas_w / 2, canvas_h / 2);
            mousePos.copyFrom_(p);
            for (let i = 0; i < n; i++) {
                circles.push({
                    p: p.copy(),
                    radius: 50,
                    speed: (i + 1) / n,
                });
            }
        };
        p5js.draw = () => {
            p5js.clear();
            p5js.background(0, 0, 0);
            mousePos.set_(p5js.mouseX, p5js.mouseY);
            p5js.stroke(p5js.color(255, 255, 255, 240));
            p5js.noFill();
            for (let circle of circles) {
                cacheDelta.copyFrom_(mousePos).sub_(circle.p);
                cacheDelta.scale_(circle.speed);
                circle.p.add_(cacheDelta);
                p5js.circle(circle.p.x, circle.p.y, circle.radius);
            }
        };
    };
}
document.addEventListener('DOMContentLoaded', function (event) {
    // big boy
    let node = document.createElement('div');
    node.className = 'top-holder';
    document.getElementById('big-container').appendChild(node);
    let size = getCanvasSize();
    new p5(makeSketch(size, size), node);
});
