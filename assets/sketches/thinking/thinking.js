// settings
let d = 600; // px
// let center = d / 2; // px
// let h = d * 1.3;  // px
let bgColor = 255;
let breathPhaseScalar = 1000;
let outerColor = 221;
let outerMaxR = 0.85; // proportion of d
let outerMinR = 0.65; // proportion of d
let midColor = bgColor;
let midMaxR = 0.27; // proportion of d
let midMinR = 0.20; // proportion of d
let thoughtPhaseScalarRange = [100, 1000];
let thoughtXAmplitudeRange = [0.001, 0.003]; // proportion of d
let thoughtMinSpeed = 0.5;
let thoughtMaxSpeed = 2;
let thoughtBaseR = 0.05; // proportion of d
let thoughtScaleR = 0.02; // proportion of d
let thoughtInterval = 1; // in seconds. after each interval, roll dice about whether to spawn.
let thoughtChance = 0.5; // in [0, 1]. dice roll for whether to spawn.
let thoughtColors = []; // color; built in setup()
let thoughtGlueRangeS = [5, 15]; // how long a thought will remain stuck
let thoughtAlphaDecay = 1.5; // amt in range of 255 to decay outline alpha per frame
let thoughtSpawnIntervalRangeS = [1, 5]; // in seconds
let thoughtSpawnNumRange = [0, 5]; // how many will spawn
let thoughtReleaseSpeedTween = 1; // time in s to tween back to normal speed after release
let thoughtReleaseSpeedMultiplier = 1.5; // to make release tween a bit more noticable
let thoughtBreathRange = 0.02; // range of d multiplier for breathing (i.e., 1.0 +/- this)
let tweenConst = 1.70158;
let epsilon = 5; // px sq
// no @types available :-(
// var jStat: any;
// too lazy to install p5js sound types
// var loadSound: any;
// var masterVolume: any;
// state
let breathPhase = 0;
// here are some values that used to be constants but now can change when d changes.
let center = function () {
    return d / 2;
};
let h = function () {
    return d * 1.3;
};
class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    copy() {
        return new Point(this.x, this.y);
    }
    /**
     * @returns `this` - `other`
     */
    sub(other) {
        return new Point(this.x - other.x, this.y - other.y);
    }
    /**
     * Modifies `this` by adding `other`.
     */
    add_(other) {
        this.x += other.x;
        this.y += other.y;
    }
    /**
     * Sets `this` have same coordinates as `other`.
     */
    set_(other) {
        this.x = other.x;
        this.y = other.y;
    }
    dist(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
class PolarPoint {
    constructor(r = 0, theta = 0) {
        this.r = r;
        this.theta = theta;
    }
}
var Goal;
(function (Goal) {
    Goal[Goal["Float"] = 0] = "Float";
    Goal[Goal["Stick"] = 1] = "Stick";
    Goal[Goal["Attach"] = 2] = "Attach";
})(Goal || (Goal = {}));
var StickState;
(function (StickState) {
    StickState[StickState["Floating"] = 0] = "Floating";
    StickState[StickState["Stuck"] = 1] = "Stuck";
    StickState[StickState["Released"] = 2] = "Released";
})(StickState || (StickState = {}));
/**
 *
 * @param p: `r` in [0, 1] (proportion of outer ring); `theta` in radians
 */
function polarRingToPoint(p) {
    // sanity check --- debug send 'em to the center
    // if (p.r < 0 || p.r > 1) {
    //     return new Point(center, center);
    // }
    const r_rel = getTween([ringMinProp, ringMaxProp], p.r);
    const r_abs = r_rel * (d / 2);
    const x = r_abs * Math.cos(p.theta);
    const y = r_abs * Math.sin(p.theta);
    return new Point(center() + x, center() + y);
}
function pointToPolarRing(p) {
    const dx = p.x - center();
    const dy = p.y - center();
    const abs_r = Math.sqrt(dx * dx + dy * dy);
    const prop_r = getProportion(abs_r, ringMinPx / 2, ringMaxPx / 2);
    const theta = Math.atan2(dy, dx);
    // DEBUG
    return new PolarPoint(prop_r, theta);
}
/**
 * Checks whether `p` is inside ring (defined by ringCenter, ringMinR, ringMaxR)
 */
function insideRing(p) {
    const r = pointToPolarRing(p).r;
    return r > 0 && r < 1;
}
class Thought {
    constructor(pos, d, speed, color, goal, maxSpawnNum, parent) {
        this.pos = pos;
        this.d = d;
        this.speed = speed;
        this.color = color;
        this.goal = goal;
        this.maxSpawnNum = maxSpawnNum;
        this.parent = parent;
        this.lastSpawnTime = -1;
        this.numSpawned = 0;
        this.moveQueue = [];
        this.nextAlpha = null;
        this.children = [];
        this.deleteMe = false;
        /**
         * released is set recursively on children so that when the main thought is released
         * and floating away, the children don't keep spawning more children.
         */
        this.released = false;
        this.startPos = this.pos.copy();
        this.origD = d;
        // tie phase to speed
        let speedPortion = (speed - thoughtMinSpeed) / (thoughtMaxSpeed - thoughtMinSpeed);
        this.phaseScalar = getTween(thoughtPhaseScalarRange, 1.0 - speedPortion);
        this.xAmplitude = getTween(thoughtXAmplitudeRange, 1.0 - speedPortion);
        if (this.goal == Goal.Stick) {
            this.stickState = StickState.Floating;
            this.stickYGoal = random(0, h());
        }
        this.glueDuration = random(thoughtGlueRangeS[0], thoughtGlueRangeS[1]);
        this.spawnInterval = random(thoughtSpawnIntervalRangeS[0], thoughtSpawnIntervalRangeS[1]);
        this.spawnNum = random(thoughtSpawnNumRange[0], maxSpawnNum);
    }
    get r() {
        return this.d / 2;
    }
    static getD() {
        // @ts-ignore
        return (thoughtBaseR + thoughtScaleR * jStat.chisquare.sample(1)) * d;
    }
    /**
     * Only top-level thought making should use this (no parent).
     */
    static make() {
        let ourD = Thought.getD();
        // popSound();
        return new Thought(new Point(Math.random() * (d - ourD) + ourD / 2, h() + ourD * 1.1), ourD, random(thoughtMinSpeed, thoughtMaxSpeed), color(random(thoughtColors).toString()), Goal.Stick, thoughtSpawnNumRange[1], null);
    }
    /**
     * Returns delta.
     */
    updateFloat() {
        let ampPhase = getUnitPhase(this.phaseScalar);
        let delta = new Point(ampPhase * this.xAmplitude * d, -this.speed);
        this.pos.add_(delta);
        return delta;
    }
    updateAttach() {
        while (this.moveQueue.length > 0) {
            let delta = this.moveQueue.pop();
            this.pos.add_(delta);
            for (let child of this.children) {
                child.moveQueue.push(delta);
            }
        }
        if (this.nextAlpha != null) {
            this.color.setAlpha(this.nextAlpha);
            for (let child of this.children) {
                child.nextAlpha = this.nextAlpha;
            }
        }
        if (!this.released) {
            this.maybeSpawn();
        }
    }
    collidesWith(p, r) {
        const tol = 1;
        return this.pos.dist(p) + tol < this.r + r;
    }
    collidesWithRecursive(p, r) {
        if (this.collidesWith(p, r)) {
            return true;
        }
        for (let child of this.children) {
            if (child.collidesWithRecursive(p, r)) {
                return true;
            }
        }
        return false;
    }
    collidesWithGroup(p, r) {
        // find parent of group;
        let top = this;
        while (top.parent != null) {
            top = top.parent;
        }
        // check recursively
        return top.collidesWithRecursive(p, r);
    }
    maybeSpawn() {
        // maybe spawn child
        if (this.numSpawned < this.spawnNum && (this.lastSpawnTime == -1 ||
            this.lastSpawnTime + this.spawnInterval * 1000 < Date.now())) {
            let newD = Thought.getD();
            let theta = random(-PI, PI);
            let newPos = new Point(this.pos.x + Math.cos(theta) * (newD / 2 + this.r + 1), this.pos.y + Math.sin(theta) * (newD / 2 + this.r + 1));
            // don't spawn if would collide with anything (previously: group)
            // if (this.collidesWithGroup(newPos, newD / 2)) {
            if (collidesWithAny(newPos, newD / 2)) {
                return;
            }
            let t = new Thought(newPos, newD, random(thoughtMinSpeed, thoughtMaxSpeed), color(random(thoughtColors).toString()), Goal.Attach, this.maxSpawnNum - 1, this);
            // set last spawn time so that it must wait before spawning.
            t.lastSpawnTime = Date.now();
            this.children.push(t);
            thoughts.push(t);
            this.numSpawned++;
            this.lastSpawnTime = Date.now();
            // attempt to play sound
            popSound();
        }
    }
    updateStick() {
        let delta = new Point();
        switch (this.stickState) {
            case StickState.Stuck: {
                // attached to consciousness. maintain the point.
                let target = polarRingToPoint(this.stickTarget);
                delta.set_(target.sub(this.pos));
                this.pos.set_(target);
                // maybe spawn
                this.maybeSpawn();
                // maybe unstick
                if (Date.now() > this.stickTime + this.glueDuration * 1000) {
                    this.stickState = StickState.Released;
                    this.releaseTime = Date.now();
                    this.set_released();
                }
                break;
            }
            case StickState.Floating: {
                // move upwards. maybe stick.
                delta.set_(this.updateFloat());
                const tol = 5;
                if (Math.abs(this.pos.y - this.stickYGoal) < tol &&
                    insideRing(this.pos) &&
                    !collidesWithAny(this.pos, this.r, this)) {
                    this.stickState = StickState.Stuck;
                    this.stickTarget = pointToPolarRing(this.pos);
                    // set "last spawn time" to now so that it has to wait before
                    // starting to spawn things
                    this.lastSpawnTime = Date.now();
                    this.stickTime = Date.now();
                    popSound();
                }
                break;
            }
            case StickState.Released: {
                // calculate our speed. we do tween from release time.
                delta.y = this.getReleaseSpeed();
                this.pos.add_(delta);
                // update our alpha, and update all children
                let newAlpha = alpha(this.color) - thoughtAlphaDecay;
                this.color.setAlpha(newAlpha);
                for (let child of this.children) {
                    child.nextAlpha = newAlpha;
                }
                break;
            }
        }
        // broadcast deltas to children
        for (let child of this.children) {
            child.moveQueue.push(delta.copy());
        }
    }
    getReleaseSpeed() {
        let velocity = -this.speed * thoughtReleaseSpeedMultiplier;
        if (this.releaseTime + 1000 * thoughtReleaseSpeedTween < Date.now()) {
            return velocity;
        }
        let portion = (Date.now() - this.releaseTime) / (1000 * thoughtReleaseSpeedTween);
        return velocity * portion * portion * ((tweenConst + 1) * portion - tweenConst);
    }
    /**
     * @returns whether it should be removed
     */
    update() {
        // // DEBUG
        // this.pos.x = mouseX;
        // this.pos.y = mouseY;
        // return;
        switch (this.goal) {
            case Goal.Float:
                this.updateFloat();
                break;
            case Goal.Stick:
                this.updateStick();
                break;
            case Goal.Attach:
                this.updateAttach();
                break;
        }
        // have self removed if above canvas plus significant buffer (heuristic for long
        // attached strings of children; cheaper than finding min y of all children and
        // checking that (could compute once, once released, save, and use as min y, but
        // meh))
        if (this.pos.y + this.d * 2 + 200 < 0) {
            return true;
        }
        return false;
    }
    mark_for_deletion() {
        this.deleteMe = true;
        for (let child of this.children) {
            child.mark_for_deletion();
        }
    }
    set_released() {
        this.released = true;
        for (let child of this.children) {
            child.set_released();
        }
    }
    set_d(multiplier) {
        this.d = this.origD * multiplier;
        for (let child of this.children) {
            child.set_d(multiplier);
        }
    }
    _debug_draw_pos() {
        fill(this.color);
        const polar = pointToPolarRing(this.pos);
        const r = polar.r.toFixed(2);
        const theta = polar.theta.toFixed(2);
        text('px:  (' + Math.round(this.pos.x) + ', ' + Math.round(this.pos.y) + ')\n' +
            'pol: (' + r + ' ˚ ' + theta + ')', this.pos.x + this.r, this.pos.y + this.d);
    }
    _debug_draw_identity() {
        fill(0);
        if (this.parent == null) {
            text('p', this.pos.x, this.pos.y);
        }
    }
    draw() {
        stroke(this.color);
        strokeWeight(2);
        fill(color(255, 255, 255, 200));
        // try modifying with breath if stuck.
        if (this.goal === Goal.Stick && this.stickState == StickState.Stuck) {
            let multiplier = (1 + ((breathPhase * 2) - 1) * thoughtBreathRange);
            this.set_d(multiplier);
        }
        ellipse(this.pos.x, this.pos.y, this.d);
        // this._debug_draw_pos();
        // this._debug_draw_identity();
    }
}
let volNoImg = null;
let volYesImg = null;
// state
let thoughts = [];
let pops = [];
let lastThoughtTime = Date.now(); // ms
let ringMinPx = -1;
let ringMaxPx = -1;
let ringMinProp = -1;
let ringMaxProp = -1;
function preload() {
    for (let i of [1, 2]) {
        // @ts-ignore
        pops.push(loadSound('/assets/sketches/thinking/pop-' + i + '.mp3')); // type: ignore
    }
    // volNoImg =
}
function setup() {
    // TODO: detect max size + resizes (can then reuse this)
    let cnv = createCanvas(d, d * 1.3);
    cnv.parent('d1');
    // orig ( orange blue red)
    // thoughtColors = [
    //     color('#7ecfc0'),
    //     // color('#f2e3c9'),
    //     color('#ed1250'),
    //     color('#ec8f6a'),
    //     color('#ef4b4b'),
    // ];
    // new
    thoughtColors = [
        color('#de5920'),
        color('#0882af'),
        color('#20de59'),
        color('#f345b1'),
        color('#deb820'),
    ];
    // @ts-ignore
    masterVolume(0.1);
}
function windowResized() {
    d = document.getElementById('d1').clientWidth;
    resizeCanvas(d, h());
}
function popSound() {
    let pop = random(pops);
    if (pop.isPlaying()) {
        pop.stop();
    }
    pop.play();
}
function collidesWithAny(p, r, except = null) {
    for (let t of thoughts) {
        if (except == t) {
            continue;
        }
        if (t.collidesWith(p, r)) {
            return true;
        }
    }
    return false;
}
/**
 * @returns number in [-1, 1]
 */
function getUnitPhase(phaseScalar) {
    return sin(Date.now() / phaseScalar);
}
/**
 * @returns number in [0, 1]
 */
function getPosPhase(phaseScalar) {
    // NOTE: could try to mimic breath pattern more (w/ pauses at top & bottom)
    return (sin(Date.now() / phaseScalar) + 1) / 2;
}
function getProportion(curVal, minVal, maxVal) {
    return (curVal - minVal) / (maxVal - minVal);
}
/**
 * @returns number in [valRange[0], valRange[1]]
 */
function getTween(valRange, proportion) {
    return valRange[0] + ((valRange[1] - valRange[0]) * proportion);
}
function drawCircle(center_coord, color, diam) {
    // stroke(color);
    noStroke();
    fill(color);
    ellipse(center_coord, center_coord, diam, diam);
}
/**
 * Relies on global state `lastThoughtTime`
 */
function shouldMakeThought(interval, chance) {
    let now = Date.now();
    let elapsed = now - lastThoughtTime;
    // no matter what, if interval has passed, reset the time.
    if (elapsed > interval * 1000) {
        lastThoughtTime = now;
        // roll dice about whether to spawn
        if (Math.random() < chance) {
            return true;
        }
    }
    return false;
}
function draw() {
    background(bgColor);
    // get phase in [0, 1]
    breathPhase = getPosPhase(breathPhaseScalar);
    ringMaxProp = getTween([outerMinR, outerMaxR], breathPhase);
    ringMaxPx = d * ringMaxProp;
    drawCircle(center(), outerColor, ringMaxPx);
    ringMinProp = getTween([midMinR, midMaxR], breathPhase);
    ringMinPx = d * ringMinProp;
    drawCircle(center(), midColor, ringMinPx);
    if (shouldMakeThought(thoughtInterval, thoughtChance)) {
        let t = Thought.make();
        thoughts.push(t);
    }
    for (let thought of thoughts) {
        if (thought.update()) {
            thought.mark_for_deletion();
        }
        else {
            thought.draw();
        }
        // // debugging: draw goal line
        // if (thought.stickYGoal) {
        //     line(0, thought.stickYGoal, d, thought.stickYGoal);
        // }
    }
    for (let i = thoughts.length - 1; i >= 0; i--) {
        if (thoughts[i].deleteMe) {
            thoughts.splice(i, 1);
        }
    }
    // // DEBUG
    // stroke(255);
    // fill(100);
    // text('active thoughts: ' + thoughts.length, 10, h - 20);
}
