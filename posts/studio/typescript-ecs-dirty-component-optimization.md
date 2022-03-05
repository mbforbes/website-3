---
title: Dirty Component Optimization
date: 2021-10-17
tags: programming
series: Building an ECS in TypeScript
seriesOrder: 7
# image: /data/typescript-ecs/TBD.jpg
---

## Backstory: Crates

A while into development, my co-developer Cooper made a level with a ton of objects. Specifically, crates.[^collab]

![]({{ "/assets/posts/typescript-ecs/lot-of-crates.jpg" | url }})

<p class="figcaption">A similar level in the finished game. That's a lotta crates.</p>

Even though they sound like boring dumb wooden boxes, crates are interesting because they actually have a lot of functionality. Two relevant things crates support:

1. **Collision:** crates could be run into (like walls) and attacked (like enemies), so they had multi-purpose collision boxes.

2. **Animation:** crates could also be destroyed, so they had animations (e.g., "exploding").

As game objects, these properties made crates pretty "heavy," by which I mean they had several Components on them, and several expensive Systems were running code on them.

[^collab]: This was one of the many great reminders of the benefits of working with others who think differently than you. I would never have filled a room with crates. I'm not sure why. But for Cooper, it was totally natural---hey, we have crates, what if you had a huge room full of them you had to smash through. And when he did this, it totally broke the game. If it was just me, I might of thought, oops, that was a bad design. But because he did it, I was forced to think a bit more. And I realized, yeah, it's actually a pretty reasonable design, and the engine is weak if it doesn't support it. This caused me to implement a profiling system and make some great upgrades to the engine. I think you'd call this an example of artistic direction influencing the technical side of things.

So what happened with this room full of crates?

The symptom was obvious: you'd enter the level, and your frame rate would drop.

The only thing different about the level was the proliferation of crates, so we figured out pretty quickly that the crates were causing the slowdown. Delete the crates, and the frame rate would be fine.

Intuitively, the problem felt fixable, because the crates aren't actually _doing_ anything most of the time. So if a bunch of these unmoving objects are causing the engine to chug, it's probably a sign of inefficiencies we can iron out in the engine code.

Fortunately, I had my wits about me. Rather than blindly rushing in and optimizing, I implemented a profiling system that would let us see what was taking so long in Cooper's Crate-topia.

![]({{ "/assets/posts/typescript-ecs/measurement-before.jpg" | url }})

<p class="figcaption">Our profiling (white bars and text) rendering on top of the game's debug view.</p>

The timings are on the right side of picture. If you look at the **Overall** section (top), you can see we've split our game loop into two parts that take all the time:

1. _update_ (game logic), which is taking 11.8 ms
2. _render_, which is taking 5.7 ms.

This totals 17.5 ms, which is greater than the 16.6 ms you need to hit to achieve 60 FPS. And the situation was worse on older computers.

Getting the _render_ faster involved better using our rendering library (the awesome [PixiJS](https://github.com/pixijs/pixijs)). I won't go into detail here---if you're curious, check out this footnote[^render]---but suffice to say, we'll be focusing on the _update_ (game logic).

[^render]: There are a few basics of using PixiJS so that it can render things fast. This was in 2018, so things might have changed by now. But the two main improvements we did were: (1) avoiding `Graphics` objects, which are extremely slow in PixiJS, and instead using textures almost exclusively. We were using `Graphics` objects to draw the collision boxes during debugging mode, so part of the slowdown was from debugging itself. We created a single white pixel (1x1) texture, then colored it and stretched it over the areas we wanted. This was a massive speedup. (2) For particles, we started using PixiJS's `ParticleContainer` over a vanilla `Container`. Combined, these two changes sped up rendering nearly 3x (5.7ms &rarr; 1.8ms).

Breaking the _update_ down into **Systems** (block second from top), the `AnimationRenderer` and `CollisionDetection` Systems were the culprits. Fixing these involved many modifications to the game: implementing spatial hashing, reorganizing the collision sets that are run, optimizing a few other Systems, and implementing the _dirty Component optimization_ feature.

It's this last one---dirty Component optimization---that we'll discuss here.

## Dirty Component Optimization

Here's the main idea of dirty Component optimization:

> An _opt-in_ feature where Components can track whether their state has changed, and Systems can choose not to update them if it hasn't.

It was important to me to make this feature opt-in, because I didn't want to have to change all of the game's Components and Systems to support it---especially the ones that were running just fine.

Making this optimization required changes to `Component`, `System`, and `ECS`---so basically the whole ECS engine! (Thankfully, `Entity`s remained simple numbers, blissfully ignorant of their surroundings.)

- The `Component` implementation must change because Components are the ones that will track whether they're dirty.

- The `System` class must change because Systems are the ones that actually run code on Components---i.e., the Systems are the source of the slowdown. The Systems need to be given information about which Components are dirty so they can perform optimizations.

- And we have to change the `ECS` to manage everything correctly: passing information about dirty Components to the Systems.

Let's walk through each of these changes in their own section.

## Dirtying the `Component`

Remember that our Component class has been about as minimal as possible so far:

```ts
abstract class Component { }
```

<p class="figcaption">Our previous <code>Component</code> implementation.</p>

To start things off, I added two things to the base `Component` class:

1. A `dirty()` method the Component can use to signal its state has changed.
2. A `signal()` method the ECS injects later which runs when `dirty()` is called.

Now our `Component` class looks like this:

```ts
abstract class Component {
    /**
     * If a Component wants to support dirty Component optimization, it
     * manages its own bookkeeping of whether its state has changed,
     * and calls `dirty()` on itself when it has.
     */
    public dirty() {
        this.signal();
    }

    /**
     * Overridden by ECS once it tracks this Component.
     */
    public signal: () => void = () => { }
}
```

<p class="figcaption">Our new <code>Component</code> implementation for the dirty Component optimization.</p>

You might ask, "why have two methods when we only need one?" And to that, I say, whoops, I think I over-engineered this one. I thought I might (a) want to override the implementation of `dirty()` in a specific Component to do more stuff, or (b) want to add more code in the `dirty()` of this base `Component` class. But I probably should have followed the YAGNI (you ain't gonna need it) rule, and just crossed that bridge when the need arose.

### Dirty `Component` Examples

Here are a few examples of dirty `Components` in action:

```ts
class CollisionShape extends Component {
    /** Omitted: Core data, like the polygon's vertices, offset,
     * collision type, ...
     */

    /**
     * Can be used to make the collision shape inactive without having to
     * destroy and recreate it. Disabled collision shapes don't collide
     * with anything.
     */
    public get disabled(): boolean {return this._disabled;}
    public set disabled(v: boolean) {
        if (this._disabled !== v) {
            this._disabled = v;
            this.dirty();
        }
    }
    private _disabled: boolean = false
}
```

<p class="figcaption">A snippet of the <code>CollisionShape</code> Component, which holds data about a polygon that participates in collision detection.</p>

The properties of a `CollisionShape` never change once it is created. This was an invariant that worked for our game, because we didn't have any objects that changed shape. As such, the only time a `CollisionShape`'s data meaningfully changed was when it was disabled.

You may immediately be wondering, _but wait, what about its position? Doesn't the position have, uh, a huge effect on whether a collision shape will collide with something?_

The answer is: yes, absolutely, but remember that we're doing an ECS. An entity's position lives in its own Component, which can track whether it is dirty on its own.

Speaking of the `Position` Component, let's look at how it manages its dirty state.

```ts
class Position extends Component {
    // All this is just for getting/setting the (x, y) values.
    private _p = new Point()
    private _revealP = new Point()
    public get p(): Point {
        return this._revealP.copyFrom_(this._p);
    }
    public set p(v: Point) {
        this.setP(v.x, v.y);
    }
    public setX(x: number): void {
        this.setP(x, this._p.y);
    }
    public setY(y: number): void {
        this.setP(this._p.x, y);
    }
    public setP(x: number, y: number): void {
        if (!this._p.equalsCoords(x, y)) {
            this._p.set_(x, y);
            this.dirty();
        }
    }

    // We originally used getters and setters here so that we can control
    // the angle value with angleClamp(), which keeps the angle between
    // 0 and 360 degrees. If you're writing something like this, you
    // should document whether this value is in degrees or radians :-)
    private _angle: number = 0
    public get angle(): number {
        return this._angle;
    }
    public set angle(v_raw: number) {
        // This was to debug (and then prevent) setting angles to NaN
        if (isNaN(v_raw)) { throw Error('Tried to set angle to NaN!'); }
        let v = angleClamp(v_raw);
        if (this._angle !== v) {
            this._angle = v;
            this.dirty();
        }
    }
}
```

<p class="figcaption">The <code>Position</code> Component, now with dirty Component optimization.</p>

First, as a quick throwback, you may notice two techniques that we covered in our [`Component` deep-dive]({{ "/posts/typescript-ecs-components/" | url }}):
- that we reveal only a copy of our underlying `Point` using getters/setters
- that we check angles against being `NaN`before setting

But on to the main logic: if the (x, y) coordinate or angle changes, the Component becomes dirty. We've internally routed all our (x, y) changes through the `setP()` method, so we only check for changes and call `dirty()` there.[^broad]

[^broad]: You might notice that the API for changing the `Position` is very broad. It's broad because the `Position` is such a central Component in the game. Pretty much everything has a position, so there are many different little ways callers might want to change it. Since we haven't exposed the underlying `Point`, we can't use its methods to change the actual value, so we must write our own wrappers.

## Dirtying the `System`

I'll show the `System` changes next because it's simpler than the `ECS`. You'll see how the Systems will receive dirty Component information.

If you recall our `System` implementation from before, it's pretty minimal: just the set of required Components, the `update()` function that gets called every frame, and a reference to the `ECS` so it can actually do anything.

```ts
abstract class System {
    public abstract componentsRequired: Set<Function>
    public abstract update(entities: Set<Entity>): void
    public ecs: ECS
}
```

<p class="figcaption">Our previous <code>System</code> implementation.</p>

We will make two changes here:

1. A set of `dirtyComponents` that the System is interested in. If the System is tracking an Entity with a Component in this list, and that Component calls `dirty()`, then this System wants to know about it on the next `update()`.

2. The `update()` will now be passed an additional set of Entities: the ones with any dirty Components from the `dirtyComponents` list.

```ts
abstract class System {
    public abstract componentsRequired: Set<Function>

    /**
     * Set of Component classes. If *ANY* of them become dirty, the
     * System will be given that Entity during its update(). Components
     * here need *not* be tracked by `componentsRequired`. To make this
     * opt-in, we default this to the empty set.
     */
    public dirtyComponents: Set<Function> = new Set()

    /**
     * Note the addition of the second set.
     */
    public abstract update(
        entities: Set<Entity>, dirty: Set<Entity>
    ): void

    public ecs: ECS
}
```

<p class="figcaption">The new <code>System</code> base class that supports dirty Component optimization. Note how both additions can be ignored for Systems that don't wish to support it.</p>

You may be wondering why we made the design decision mentioned in the comment on `dirtyComponents`: _"Components here need *not* be tracked by `componentsRequired`."_ I'll show why with an example.

Check out the `componentsRequired` and `dirtyComponents` from the `AnimationRenderer` System, a huge System in charge of rendering everything that has an animation:

```ts
/**
 * Renders animations, AKA almost all sprites, AKA basically everything
 * on screen except the background!
 */
class AnimationRenderer extends System {
    public componentsRequired = new Set<Function>([
        Component.Position,
        Component.Animatable,
    ])

    public dirtyComponents = new Set<Function>([
        // changes in these require updates.
        Component.Position,
        Component.Animatable,
        Component.Activity,
        Component.Body,

        // listening for these to be added/removed as also means update
        // required
        Component.Dead,
        Component.DamagedFlash,
    ])

    // ... other code omitted ...
}
```

<p class="figcaption">The <code>AnimationRenderer</code> System is interested in a much larger set of dirty Components than it selects for in its update.</p>

The `componentsRequired` says: anything that has a `Position` and is `Animatable`, I want to know about it so I can render it.

But the `dirtyComponents` says: changes to _any_ of these `Components` mean I'll need to re-render the Entity.

In other words, the `componentsRequired` still specifies what Entities the System cares about. But a broader set of Components (`dirtyComponents`) affects whether any state has changed about an Entity in question. If any state has changed, the System has to update that Entity.

> In practice, this means that anything that is currently animating---like a player or enemy moving around---is still going to be dirty, and hence updated, every frame. But something that is just sitting still, _like a crate_, won't be dirty.

Backing up a bit, you might notice this is caching at a relatively high level. Rather than trying to optimize _within_ a System by seeing whether we can be lazy about how we modify state---which I would call low level---we're trying to optimize _what the System updates in the first place._ If we decide an Entity is dirty, we just run the full, normal update on it. Both types of optimization have their place. I like this one because it's a mechanism that can apply to any System.

> **Important aside:** A way to reduce bugs and retain your sanity is to keep implementing your Systems such that they behave correctly, just perhaps slowly, if they update every Entity every frame. The changes to a System for dirty Component optimization should alter _performance,_ but not _correctness_. In other words, avoid update logic relying on only a subset of Entities to be updated every frame in order to be correct.

## Dirtying the `ECS`

We now have to make sure our `ECS` tracks dirty Components (which have called `signal()`) and keeps up-to-date lists of those Entities for participating Systems (who have defined `dirtyComponents`).

To pull this off, we have to be a bit careful.

### A Buggy First Draft

One thing we might try is to create a fresh list of dirty Entities every frame.

In other words, at the beginning of each frame, no Components are dirty, so no Entities are considered dirty by any System. Then, as Systems run, Components become dirty. We pass each System the set of currently dirty Entities (based on the System's `dirtyComponents`. Then, at the end of the frame, we say that all Entities and Components are are clean.

Can you spot the bug?

Imagine this scenario:
- System `A` cares about when the `Position` Component gets dirty.
- System `B` changes the `Position` Component.

The problem happens if System `A` runs before System `B`. Imagine the following frame:
1. Start of frame: nothing is dirty.
2. System `A` runs, sees no dirty Entities, and does nothing.
3. System `B` runs on Entity 1, and changes its `Position`. Entity 1 is correctly marked as dirty for System `A`.
4. End of frame: we clear the dirty list.

System `A` never found out about Entity 1's dirty `Position` component.

### Fixed: Clear After Update

To prevent this, we can instead make the following rule: each System's list of dirty Entities is only cleared _after it actually runs.[^disable]_

[^disable]: Another nice aspect of the "clear after run" decision is another feature I added to Systems that I haven't covered yet: disabling them. Instead of removing Systems, I would disable and enable them. This would be another potential source of pain with the dirty Component optimization. But since we keep a list of dirty Entities per System, and we don't clear the list until a System runs, the System simply accumulates dirty Entities while it is disabled. Then, once the System runs again, it simply plows through the list of everything it missed while it was disabled. Piece of cake.

With that implementation, the above scenario would now play out:

- Frame `i`
    1. Start of frame. Nothing is dirty.
    2. System `A` runs, sees no dirty Entities, and does nothing.
    3. System `B` runs on Entity 1, and changes its `Position`. Entity 1 is correctly marked as dirty for System `A`.
    4. End of frame. System `A` thinks that Entity 1 is dirty.
- Frame `i+1`
    1. Start of frame. System `A` thinks that Entity 1 is dirty.
    2. System `A` runs, sees Entity 1 is dirty, updates it, and clears its dirty list.
    3. System `B` does whatever (let's say it does nothing, for simplicity).
    4. End of frame. Nothing is dirty.

System `A` was able to update its dirty Entity on the next frame. (This is the earliest it could have found out about System `B`'s changes anyway, since System `A` runs before System `B` each frame.[^order])

[^order]: In Fallgate, I had Systems run in a specific order in each frame. This created invisible logical dependencies that I had to remember to not do things out-of-order. It was trivial to remember at first, because the order was like "run game logic before drawing." But later, it became more complex, like "update the particular attack state before updating the visible body parts." If I were to build another game with an ECS, I would try to avoid this.

### The Implementation

OK, let's make those changes to our ECS to support dirty Component optimization.

In the upcoming code block, I'll show just the parts of the `ECS` that have changed. Afterwards, I'll link to a complete listing of the code so far.

I've changed six sections for the dirty Component optimization:

1. Two new data structures --- tracking dirty state
2. `addComponent()` --- hooking up dirty `signal()` and calling it
3. `componentDirty()` --- new function: what to do when Component is dirty
4. `addSystem()` --- make dirty Component / Entity lists for new Systems
5. `update()` --- pass dirty Entities to Systems each frame, then clear
6. `destroyEntity()` --- remove Entity from any dirty lists

```ts
class ECS {

    // NEW: Data structures for dirty Component optimization.
    private dirtySystemsCare = new Map<Function, Set<System>>()
    private dirtyEntities = new Map<System, Set<Entity>>()

    public addComponent(entity: Entity, component: Component): void {
        /** Code omitted */

        // NEW: Let Component signal ECS when it gets dirty.
        component.signal = () => {
            this.componentDirty(entity, component);
        }

        // NEW: Initial dirty signal to broadcast to interested Systems
        // so that it gets a first update.
        component.signal();
    }

    /**
     * NEW: This whole function.
     */
    private componentDirty(
        entity: Entity, component: Component
    ): void {
        // For all systems that care about this Component becoming
        // dirty, tell them, but only if they're actually tracking
        // this Entity.
        if (!this.dirtySystemsCare.has(component.constructor)) {
            return;
        }
        for (let system of this.dirtySystemsCare.get(
            component.constructor)
        ) {
            if (this.systems.get(system).has(entity)) {
                this.dirtyEntities.get(system).add(entity);
            }
        }
    }

    public addSystem(system: System): void {
        /** Code omitted */

        // NEW: Bookkeeping for dirty Component optimization.
        for (let c of system.dirtyComponents) {
            if (!this.dirtySystemsCare.has(c)) {
                this.dirtySystemsCare.set(c, new Set());
            }
            this.dirtySystemsCare.get(c).add(system);
        }
        this.dirtyEntities.set(system, new Set());
    }


    /**
     * NOTE: Removed the `removeSystem()` function because it was
     * just for proof-of-concept in the initial post. If we kept it,
     * we'd need to remove the System from `dirtySystemsCare` and
     * `dirtyEntities`.
     */

    public update(): void {
        for (let [system, entities] of this.systems.entries()) {
            // NEW: Pass in list of dirty Entities (2nd parameter).
            system.update(entities, this.dirtyEntities.get(system));
            // NEW: Clear System's dirty Entity list.
            this.dirtyEntities.get(system).clear();
        }

         /** Code omitted */
    }

    private destroyEntity(entity: Entity): void {
        /** Code omitted */

        for (let [system, entities] of this.systems.entries()) {
            // Remove Entity from System (if applicable).
            entities.delete(entity);  // no-op if doesn't have it

            // NEW: Remove Entity from dirty list if it was there.
            if (this.dirtyEntities.has(system)) {
                // Again, simply a no-op if it's not in there.
                this.dirtyEntities.get(system).delete(entity);
            }
        }
    }
}
```

<p class="figcaption">Code changes to our <code>ECS</code> to support dirty Component optimization.</p>

> **Note: Adding Systems during gamplay.** In Fallgate, I never added Systems later on during the game. They were all added upfront, before any Entities or Components were made. If you wanted to add Systems dynamically during gameplay, and wanted dirty Component optimization to work correctly for them, you'd need to also make sure the System runs once on all of its matching Entities. Otherwise, it would miss everything that already exists. You might do this, for example, by marking all Entities that match a System as dirty whenever a System is added. Later, we'll make an `onAdd()` function for when an Entity is first tracked by a System; you could do it there.

> Here's the [complete code listing](https://gist.github.com/mbforbes/5604a426a7f9b054d0308ac3cc170037) for the ECS with dirty Component optimization.


## Trying it out

I've made a tiny demo to show the dirty Component optimization at work.

We'll start with our basic `Health` Component, as before, but add in `dirty()` reporting whenever it changes:


```ts
class Health extends Component {
    constructor(private _maximum: number, private _current: number) {
        super();
    }

    public get current(): number {
        return this._current
    }
    public set current(value: number) {
        this._current = value;
        this.dirty();
    }
    public get maximum(): number {
        return this._maximum
    }
    public set maximum(value: number) {
        this._maximum = value;
        this.dirty();
    }
}
```

<p class="figcaption">The <code>Health</code> Component stores two numbers, but calls <code>dirty()</code> whenever either changes. There's probably a more elegant way to do this in TypeScript 😅</p>

We'll make a `LatestHealthLogger` System that logs the latest value of an Entity's `Health` Component.


```ts
class LatestHealthLogger extends System {
    componentsRequired = new Set<Function>([Health]);
    dirtyComponents = new Set<Function>([Health]);

    update(entities: Set<Entity>, dirty: Set<Entity>): void {
        for (let entity of dirty) {
            let health = this.ecs.getComponents(entity).get(Health);
            console.log(health.current + "/" + health.maximum);
        }
    }
}
```

<p class="figcaption">Notice that the <code>LatestHealthLogger</code> ignores its full set of <code>entities</code> and only iterates over the <code>dirty<code/> ones!</p>


Now, we can run a little function to test it out.

```ts
function main(): void {
    let ecs = new ECS();
    ecs.addSystem(new LatestHealthLogger());

    let entity = ecs.addEntity();
    let health = new Health(10, 10);
    ecs.addComponent(entity, health);

    ecs.update(); // should print "10/10" (Component starts dirty)
    ecs.update(); // should not print anything
    health.current = 8;
    ecs.update(); // should print "8/10"
    ecs.update(); // should not print anything
}
```

Sure enough, when I run this, I see:

```txt
10/10
8/10
```

If we change the `LatestHealthLogger` to iterate over all `entities`, rather than just `dirty`, it prints:

```txt
10/10
10/10
8/10
8/10
```

## Epilogue: What Happened with the Crates?

After the dirty Component optimization---and some other improvements to collision detection, which I might cover elsewhere---we brought the _update_ time for each frame from **11.8ms** down to **1.4ms**. The game now ran buttery smooth.

![]({{ "/assets/posts/typescript-ecs/measurement-after.jpg" | url }})

Most importantly, the changes meant the game's performance now depended on the number of things that _changed_ every frame, not the number of things that simply _existed._ This paved the way for even bigger levels without worrying about performance.
