---
title: "Deeper Dive: Components"
date: 2021-09-12
tags: programming
series: Building an ECS in TypeScript
seriesOrder: 6
image: /assets/posts/typescript-ecs/ecs-screenshot.png
# layout: layouts/big-header.njk
---

As with `Entity`, our `Component` implementation is also quite minimal.

```ts
/**
 * A Component is a bundle of state. Each instance of a Component is
 * associated with a single Entity.
 *
 * Components have no API to fulfill.
 */
abstract class Component { }
```

This deceptively simple interface can drive a considerable number of designs when put inside an ECS. Its uses are best shown by example.

So, let's check out three Components I wrote for [Fallgate](/posts/fallgate/). For each Component, I'll give example code that uses it, and discuss some design tradeoffs that arise. After the example components, we'll bend the notion of a Component by adding _code_ to the classes instead of only storing data.  I'll cover three ways that I added code to Components.

> Just to be clear, the example usage code below all lives in Systems, not the Components. But I figured it'd be easiest to understand what these Components do if you see how they're used.

## Example Components

Here are three example Components, ordered from simple to complex. They are the `CameraFollowable`, `Spawnable`, and `Armed` Components.

### `CameraFollowable`

This simple Component contains no data. It's just a marker to tell a camera System to follow this Entity.

```ts
class CameraFollowable extends Component {}
```

#### Usage

This Component is used by a System called `FollowCamera`, which looks for Entities with `Position` and `CameraFollowable` Components, and contains logic to center them in the screen. Only one object (usually the player) had `CameraFollowable` on it at a time, so we just tracked the first Entity we found with this marker.

### `Spawnable`

This contains the position at which an Entity should be respawned.

```ts
class Spawnable extends Component {
    public position: Point

    constructor(position: Point, public angle: number = 0) {
        super();
        this.position = position.copy();
    }
}
```

For reference, a `Point` is a utility object that stores an `(x, y)` coordinate.

You might notice this looks a little verbose. Why not just specify the `position` directly as a public member in the constructor?

```ts
class Spawnable extends Component {
    constructor(public position: Point, public angle: number = 0) {
        super();
    }
}
```

The reason is that the `Point` object would now be shared between this `Spawnable` Component, and whatever code passed in the `Point` (probably from some kind of `Position` Component). Then, later updates to underlying `Point` object would also change the position stored by the `Spawnable` Component! I discovered this from seeing weird bugs where Entities would respawn where they were last located, rather from (what I thought was) their spawn point.

This is one of many areas where a more sophisticated design of either the `Point` object, or the `Component`s themselves, could potentially have mitigated these issues, by ensuring that objects were always copied rather than reused. But this was beyond my pay grade (i.e., $0). Instead, I just tried to remember to always `copy()` `Point`s when they were passed to new Components.

#### Usage

The `Spawnable` Component had pretty straightforward usage. When an Entity is created during level building, its spawn point is marked as its initial position. This works for both the player and enemies.

```ts
// If respawn marked, also make that component.
if (props.has(Respawn) && (props.get(Respawn).val() as boolean)) {
    ecs.addComponent(entity, new Spawnable(new Point(x, y)));
}
```

The player can hit checkpoints (which are cauldrons), which updates their respawn position. We set it to the cauldron's position, plus a little offset so they don't respawn right on top of it.

```ts
let spawnable = playerComps.get(Spawnable);
spawnable.position.copyFrom_(cauldronPos.p).add_(SPAWN_OFFSET);
```

Also, when the player hits a checkpoint, this saves their progress of how many enemies they have killed. We do this by simply removing the `Spawnable` Component from all dead enemies when the player hits a checkpoint.

```ts
// make all dead enemies no longer able to be respawned
for (let enemy of enemySelector.latest()) {
    let enemyComps = this.ecs.getComponents(enemy);
    // if it's not dead, let it keep any spawnable prop it has
    if (!enemyComps.has(Dead)) {
        continue;
    }
    this.ecs.removeComponentIfExists(enemy, Spawnable);
}
```

There are a couple of new things in this code snippet:

- `enemeySelector` --- instance of a System that, you guessed it, selects all enemies. It's a bit of a weird pattern, because that System is then used by other Systems to get a list of Entities. But it's also super easy to implement, because Systems track sets of Entities out-of-the-box. We'll discuss this more in the post diving deeper into Systems.

- `ecs.removeComponentIfExists()` --- just like `removeComponent()`, but no error if the Component isn't there. I could totally imagine a game engine that just always does this behavior, in which case `removeComponent()` would be all you'd need.

### `Armed`

This Component stores the set of weapons that an Entity has, and tracks which one is currently equipped.

```ts
class Armed extends Component {
    public active: Weapon
    public inventory = new Array<Weapon>()
    public activeIdx = -1

    /**
     * Elapsed is the time in ms that has been spent in this.state. This
     * is used for display purposes (e.g. for flashing tints during
     * various stages of charging). It is set by the Swing system to
     * match its internal state and should only be observed by other
     * systems.
     */
    public elapsed = 0

    constructor(
            active: Weapon,

            /**
             * The state is set by the Swing system to match its
             * internal state and should only be observed by other
             * systems.
             */
            public state: SwingState = SwingState.Idle
    ) {
        super();
        this.active = cloneWeapon(active);
        this.inventory.push(active);
        this.activeIdx = 0;
    }
}
```

A couple of observations here:

- You might notice some potential weakness in the ECS design here, with the comments on the `elapsed` and `state` public variables. The comments tell you which System (i.e., `Swing`) should write its state. This is somewhat helpful, but it is error-prone. There's nothing stopping us from accidentally updating its state from another System. And there's no way to understand _why_ I wrote those comments without reading the code in the `Swing` System. What is going on here is that these properties are set as the result of complex logic in the `Swing` System, but must be read by other Systems, like the renderer. In short, it's a totally normal usage of Components to share data between Systems, but lacks any programmatic enforcement of invariants, like who is allowed to update what. This is one area you might consider modifying your ECS design: specifying contracts to prevent accidental variable misuse.

- You can see we do `cloneWeapon(active)` for the same reason that we did `position.copy()` in the `Spawnable` Component above: avoiding accidentally sharing object references between Components. I end up doing this kind of defensive copying many places, and it is a hazardous potential source of bugs. Another design extension you might consider would be some way to automatically make state copied by default. I chose to keep the design simpler and the syntax cleaner, at the cost of having to remember to make copies. This was an okay tradeoff for me to make, since I was the only one programming, and we had no pressure to make things perfect.

- This Component actually stores _a lot_ of state! You can't quite tell because I haven't shown you what's in the `Weapon` type.

To drill into that last point, here's the `Weapon` type.

```ts
/**
* Data class for what comprises a weapon.
*/
type Weapon = {
    timing?: CharacterTiming,
    swingAttack?: AttackInfo,
    quickAttack?: AttackInfo,
    comboAttack?: AttackInfo,
    partID?: PartID,
}
```

The `CharacterTiming` looks like this:

```ts
/**
 * Timing info for a weapon's swing stages. This is character-centric.
 */
type CharacterTiming = {
    idleCooldown: number,
    minChargeDuration: number,
    swingDuration: number,
    sheatheDuration: number,

    /**
     * How long after the quick attack state was entered (i.e., not
     * including the quickAttackAttackDelay) must the entity wait before
     * beginning the next quick attack (or combo). Should be less than
     * quickAttackDuration.
     */
    quickAttackNextWait: number,

    /**
     * How long a quick attack lasts before returning to idle. Starts
     * from when state was entered (i.e., not including the
     * quickAttackAttackDelay).
     */
    quickAttackDuration: number,

    /**
     * From from when the swing state was entered until the "Attack"
     * entity is spawned.
     */
    swingAttackDelay: number,

    /**
     * Time from when the quick attack state was entered until the
     * "Attack" entity is spawned.
     */
    quickAttackAttackDelay: number,

    /**
     * Total duration for the combo state.
     */
    comboDuration: number,

    /**
     * Time from when the combo state is entered until the attack
     * object (collision box) is spawned.
     */
    comboAttackDelay: number,
}
```

... and the `AttackInfo` looks like this:

```ts
/**
 * Info (including timing) for the attack. (This is attack-centric.)
 */
type AttackInfo = {
    // NOTE: cboxDims and cboxOffset should exist on normal attacks;
    // they should not exist for static damage definitions, because then
    // the attack takes the collision box of the parent object. We might
    // want to make a separate spec for this.
    cboxDims?: Point,
    cboxOffset?: Point,
    movement: AttackMovement,
    damage: number,
    attackType: AttackType,
    cTypes: CollisionType[],

    /**
     * Denotes that this attack cannot be blocked. Useful for, e.g.,
     * environmental attacks that are long-lived and shields shouldn't
     * protect you from.
     */
    unblockable?: boolean,

    /**
     * How much force is applied to the victim if this attack causes a
     * knockback.
     */
    knockbackForce: number,

    /**
     * How much force is applied to the victim if this attack causes a
     * stagger.
     */
    staggerForce: number,

    /**
     * How much force is applied to the attacker to move it forward.
     */
    lungeForce: number,

    /**
     * Time in ms before the attack is stopped. -1 for no limit
     * (e.g., arrows that go until they hit something).
     */
    duration: number,

    /**
     * If this attack is blocked (e.g., by the player's shield), this is
     * the amount of time in ms that the `Blocked` state will be
     * applied to the attacker. If not provided, uses
     * Blocked.DEFAULT_DURATION.
     */
    blockedDuration?: number,

    /**
     * Only relevant for AttackMovement.Launch; speed it flies.
     */
    velocity?: number,

    /**
     * Only relevant for AttackMovement.Launch; how to draw the attack
     * itself (e.g., an arrow).
     */
    animDatas?: Map<Anim.Key, Anim.Data>,

    /**
     * Sound effects to play based on different situations (e.g., swing,
     * hit).
     */
    sounds?: Sound.Attack,
}
```

Phew! Boy, even simple games are complicated. So many details of timing and state to keep track of.

### Usage

I've already overwhelmed you with so much code describing the state that the `Armed` Component keeps track of. Instead of providing more code, I'll give you a brief rundown of the places it is used.

where | how `Armed` is used
--- | ---
Level loading | Giving Entities their weapons
`Activity` System | Figuring out overall state of how an Entity should be rendered
Several AI Systems | Changing behavior based on what weapon the player has equipped, and what state of attacking the enemy is currently in
`Body` System | Figuring out detailed parts of how an Entity should be rendered (e.g., overlaying the body with the equipped weapon, synchronized to the right frames)
`Defend` System | Checking whether something is attacking to figure out whether it can defend (can't do both at same time)
`Movement` System | Slowing down movement when attacking
`PlayerHUDRenderer` System | Displaying the equipped weapons in the HUD, and highlighting the active one
`Swing` System | Managing the process of attacking: charging up, swinging, cooldown, combos, that kind of thing

## Extending Components

According to what I know about the design philosophy of ECS,[^alex] Components should be "pure state." They'd might as well be JSON. No code.

[^alex]: Full disclosure, my understanding of ECS wasn't from learning about it in industry, or even reading about it online (I couldn't find that much good stuff?), it was basically from talking to my friend [Alex](https://spacefiller.space/). So when I write stuff like, _"the design philosophy of ECS,"_ please take that with a grain of salt.

Buuuuuut, hey, we've already decided that Components are going to be classes in our code. And we already have some basic code running, like defensibly copying data passed into the constructors so that callers don't have to remember to. What if we bent the rules in a few situations and added some code to our Components?

The three main ways I modified Components were for debugging, sharing behavior, and optimizing updates. Let's dive in.

### Debugging with Setters

At some point during development, I had a problem where Entities were being thrown _way_ off into space, or would disappear entirely. As usual, this bug was pretty funny for a while, but eventually I had to buckle down and figure out what the hell was going on.

Using a live Component viewer tool I had built, I saw that the positions were being set to `NaN`. The question was, where? It took a little bit of refactoring, but I replaced all the places where code would modify an Entity's position to instead go through a setter:

```ts
class Position extends Component {
    // old code:
    // public p = new Point()

    // new code:
    private _p = new Point()
    private _revealP = new Point()
    public get p(): Point {
        return this._revealP.copyFrom_(this._p);
    }
    public set p(v: Point) {
        if (isNaN(v.x)) { throw Error('Tried to set x to NaN!'); }
        if (isNaN(v.y)) { throw Error('Tried to set y to NaN!'); }
        this._p.copyFrom_(v);
    }

    // Omitted: angle (i.e., facing direction)
}
```

<p class="figcaption">I also added <code>setX()</code> and <code>setY()</code> functions that behave as you'd expect.</p>

If you're not familiar with getters/setters, they automatically run under-the-hood when you try to get or set a value, like:

```ts
let foo = position.p; // runs getter
position.p = new Point(0, 0);  // runs setter
```

You can see in the setter (`set p()`), we check the coordinates passed in for `NaN`, and immediately throw an error when this happens. Could you do this check by setting a breakpoint in the debugger instead? Absolutely. But the nice thing is that you don't have to go and do that when problems arise---this way, your invariants are checked at all times. Despite how silly this error is, these `NaN` checks actually found errors several times after I fixed this particular bug.

Also, you might notice that there's another trick: we have a `_revealP` `Point` which we return in the getter (`get p()`). This protects users of the code from getting the underlying `Point` and modifying it. It's not a perfect fix, because callers still shouldn't use this `_revealP` object; if multiple callers got it and tried to modify it, they could still confuse each other. Still, it does protect the `Position` Component itself, while letting calling code easily read the `Point`, and without allocating a new `Point` for every access.

### Sharing Behavior with `Timebomb`

If you thought writing Components that ran code was sacrilegious, wait until you hear this one: I wrote a bunch of Components that used inheritance!

The name of the game here is restraint. I was really cautious of using inheritance, but it seemed like a great fit.

Here's the situation. I kept running into cases where I wanted a Component that would last a handful of frames, then disappear:
- `Attack` objects (the collision boxes generated by attacking)
- `Bleeding` state (emitted blood streaks)
- `Block` objects (the collision boxes generated by defending)
- `Blocked` state (when someone's attack was blocked; they might have a delay before they can attack again, or have to recoil backwards)
- `DamagedFlash` state (flashing from taking damage)
- `Immobile` state (temporarily can't move)
- _... (there are about six more)_

To accomplish this, I implemented a `Timebomb` Component, and then had other Components subclass it. I also had a `Timebomb` System that I would subclass---yes, I subclassed a System as well 😱. The `Timebomb` System would automatically apply the the common timing and destruction logic, and the particular subclass would add any specific behavior (e.g., for `Bleeding`, actually emit blood).

Here's what the `Timebomb` Component looks like:

```ts
/**
 * What to do when the timebomb goes off.
 */
enum Destruct {
	/**
	 * Remove the component.
	 */
	Component = 0,

	/**
	 * Remove the entire entity.
	 */
	Entity,
}

class Timebomb extends Component {
    /**
     * When created (set on first Timebomb System pass).
     */
    public startTime: number = -1

    constructor(
        /**
         * Total time in ms this will last (doesn't change).
         */
        public duration: number,

        /**
         * What to do upon destruction.
         */
        public destruct: Destruct,

        /**
         * A fuse, to allow others to request that the destruction is
         * activated.
         */
        public fuse: boolean = false,

        /**
         * An optional function that will be called upon destruction.
         */
        public lastWish?: (
            ecs: Engine.ECS, entity: Engine.Entity
        ) => void,
    ) {
        super();
    }
}
```

As an example Component extending this, here's the `Attack` Component. This Component is added to Entities that represent an "attack" collision box. It tracks the parameters of the attack by storing the `AttackInfo`, passed in from the weapon that created it. It extends `Timebomb` and passes in the particular attack's duration.

```ts
class Attack extends Timebomb {
    public info: AttackInfo

    /**
     * Whether the attack has hit something (used for combo logic).
     */
    public hit: boolean = false

    /**
     * Used to limit heavy-duty effects (like pause and flash) shown per
     * attack.
     */
    public heavyEffectsShown: boolean = false

    constructor(public attacker: Engine.Entity, info: AttackInfo) {
        // This is where we pass the critical information into our
        // Timebomb super class: how long does this last, and what
        // should happen when time runs out.
        super(info.duration, Destruct.Entity);
        // (Also storing some state for the Attack itself.)
        this.info = cloneAttackInfo(info);
    }
}
```

The `Timebomb` is also useful for objects that exist semi-indefinitely, like a "block" object. Blocks exist until the shield is lowered, or something else happens. For those cases, we just pass `-1` as the duration, and let managing code trigger the destruct action by setting the `fuse` attribute.

I won't go into the details of the `Timebomb` System, which actually handles counting down the destruct time and triggering the destruct action. But to briefly show how new Systems are made that extend it, here's the corresponding System for the `Attack` component:

```ts
/**
 * I've been omitting namespaces for brevity so far, but this is the
 * first time we've had a name collision. In reality, the classes above
 * were in the `Component` namespace, so they would be the
 * `Component.Attack` extending the `Component.Timebomb`. These are
 * Systems, so they'd be `System.Attack` extending `System.Timebomb`.
 */
class Attack extends Timebomb {
    /**
     * The Timebomb System requires this attribute, and uses it to
     * perform the common timing and destruction logic.
     */
    tbComp = Component.Attack

    public componentsRequired = new Set<Function>([
        Component.Attack,
    ])
}
```


### Optimizing Updates with Dirty Flags

This final example of adding code to Components was the messiest to implement, but also provided a huge performance optimization.

The feature allows Components to track whether their state has changed. Then, Systems can take the information about changed Components into account to only update a subset of the Entities. When you have Systems running on a large number of Entities, but with few changes every frame, this performance gain can be considerable.

However, describing this change is quite involved. It touches not only Components, but also Systems, and the ECS itself. As such, it warrants a post of its own.
