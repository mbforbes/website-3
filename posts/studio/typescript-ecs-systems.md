---
title: "Deeper Dive: Systems"
date: 2022-01-24
tags: programming
series: Building an ECS in TypeScript
seriesOrder: 9
# image: /data/typescript-ecs/TBD.jpg
---

We've already covered the basics of how Systems work. Here I'll touch on four advanced topics: ordering, disabling, cleanup, and communication.

## 1. System Ordering

When I add `System`s to the `ECS`, I also provide a priority order. Then, each frame, the `System`s' `update()`s called in in that order.

As an example, here's some of my code that adds `System`s:

```ts
ecs.addSystem(5, playerSelector);
ecs.addSystem(10, new System.PlayerInputMouseKeyboard(...));
ecs.addSystem(10, new System.AISystem(playerSelector));
ecs.addSystem(20, new System.Swing());
ecs.addSystem(20, new System.Defend());
ecs.addSystem(45, new System.SpatialHash());
ecs.addSystem(50, new System.CollisionDetection(...));
ecs.addSystem(60, new System.CollisionMovement());
ecs.addSystem(60, new System.CollisionBlock());
ecs.addSystem(70, new System.Attack());
ecs.addSystem(70, new System.Block());
ecs.addSystem(70, new System.Stagger());
ecs.addSystem(80, new System.FollowCamera());
ecs.addSystem(90, new System.StaticRenderer(...));
ecs.addSystem(90, new System.AnimationRenderer(...));
ecs.addSystem(90, new System.Lighting(...))
```

To implement this, the `ECS`'s `addSystem()` function takes a priority and the `System`, and keeps (a) a sorted away it can iterate through to call updates, (b) a map from priority order to the `System`s to run.

```ts
public addSystem(priority: number, system: System): void {
    // ... previously described code omitted ...

    // (a) Make a sorted list for calling updates in order.
    this.priorities = Array.from(
        (new Set(this.priorities)).add(priority)
    );
    // Yes, you actually need a custom sorting function for numbers.
    this.priorities.sort((a: number, b: number) => { return a - b});

    // (b) Keep a map from [priority order] to [Systems to run].
    if (!this.updateMap.has(priority)) {
        this.updateMap.set(priority, new Set<System>());
    }
    this.updateMap.get(priority).add(system);
}
```

This is a dead simple way of making `System`s update in a particular order. The immediate benefit is it lets you ensure a particular System A runs before System B so that they function properly.

It also had an unexpected side benefit: it let me create a better mental map of what was happening each frame. I partitioned the update logic into coarse chunks by what `System`s were running:

priority range | kinds of `system`s that `update()`
--- | ---
`0s` | Read input, select groups of Entities, other "library" Systems
`10s` | Player and AI control, debug Systems
`20s` | Main actions: attack and defend
`40s` | Position child/parent nodes in render tree, run physics forward step, run spatial hashing
`50s` | Collision detection
`60s` | All collision resolution, calculate damage
`70s` | Tick "timebombs" (Components that last a limited number of frames), misc game logic
`80s` | Camera, determine what's visible for rendering, run tweens
`90s` | Renderers: effects, lighting, HUD, text, GUI, particles, animations; also all audio
`100s` | Debug rendering (collision, HTML tables, inspection, timing inspecter)
`110s` | Bookkeeping (game score and stats) and screen fading


### Downside: Implicit Logic in Ordering

With the power to order Systems, you can now cause yourself headaches by encoding _implicit_ game logic into your System update order.

If you program two Systems such that one _must_ run before the other for them to behave correctly, you now have to remember that this is the case when you order their priorities. I did this just by writing comments in code that added Systems:

```ts
// SpatialHash must come before CollisionDetection
this.ecs.addSystem(45, new System.SpatialHash());
// CollisionDetection must come after Movement (to avoid sinking in
// objects)
this.ecs.addSystem(50, new System.CollisionDetection(...));
```

But nothing in your code stops you from screwing this up or making a circular dependency.

As a result, I tried to minimize assumptions I was making about which `System`s ran before which other ones when I was writing them. However, it wasn't entirely avoidable. And it got messier the more I added to the game.

## 2. Disabling Systems

In my ECS implementation, all Systems are added when the game starts. Rather than adding and removing them throughout the game, I let them be **enabled and disabled**, and had **debug** Systems that are updated even when the rest of the game is paused.

These are specified in the `System`'s constructor. Hey, check out how bad my code is: this is before I knew about the getter/setter syntax, so I just made a public attribute with instructions not to use it:

```ts
abstract class System {

    /**
     * @param disabled DO NOT SET THIS AFTER CONSTRUCTION. Use
     * ecs.toggleSystem(), ecs.disableSystem(), and ecs.enableSystem().
     * Lets systems start out disabled. Disabled systems are not updated.
     *
     * @param debug Denotes a debug system that is updated even when the
     * game is paused.
     */
    constructor(
        public disabled: boolean = false, public debug: boolean = false
    ) { }

    /**
     * onDisabled() is called when a system is disabled; after this, it
     * won't receive any more update() calls (until it is enabled again).
     * It is expected to clean up its state as necessary (e.g., wiping
     * what it's drawn from the screen).
     */
    public onDisabled(entities: Map<Entity, Aspect>): void { }

    /**
     * onEnabled() is called when a system is enabled, having previously
     * been disabled.
     */
    public onEnabled(entities: Map<Entity, Aspect>): void { }
}
```

In practice, this meant that each `System` would specify their `disabled` and `debug` attributes in the `super()` call in their `constructor`. Here are a couple examples:

```ts
/**
 * We can select Entities to inspect during debugging. This System
 * renders a graphic around the selected Entity.
 */
class DebugInspectionRenderer extends System {
    constructor(...) {
        // starts disabled, and is a debug system
        super(true, true);
    }
}

/**
 * Lets us adjust the game speed on-the-fly for debugging weird game
 * events in slow motion.
 */
class DebugGameSpeed extends System {
    constructor(...) {
        // starts enabled, but is a debug system
        super(false, true);
    }
}
```

I had a global variable denote whether the game was a debug build, and the game only added debug systems when that was on. (There are probably better ways of doing that.)

The ECS update loop (that calls `update()` on all the Systems) has changed a bit now that we have priority ordering, debug Systems, and disabled Systems. It's still relatively straightforward, and looks roughly like:

```ts
public update(gameDelta: number): void {
    // Apply any slow motion (not described in this tutorial, and my
    // implementation was quite rudimentary) to get timestep to use.
    let delta = this.slowMotion.update(gameDelta);
    let debugOnly = delta == 0;

    // Call update on all systems in priority order.
    for (let priority of this.priorities) {
        let systems = this.updateMap.get(priority);
        for (let sys of systems.values()) {
            // update. can't be disabled. debugOnly either must be off,
            // or if it's on, the system must be a debug system.
            if (!sys.disabled && (!debugOnly || sys.debug)) {
                sys.update(delta, this.systems.get(sys));
            }
        }
    }
}
```

What should a System do when it is disabled or enabled?

When a System is disabled, it has to clean up any state that would normally affect the game when it is running. And when it's enabled, it must recreate that state.

Let's look at an example of a System that draws stuff to the screen and must do some state cleanup/re-creation when it's disabled/enabled. This is from the `DebugInspectionRenderer` System we saw briefly above, which renders an indicator over the object being debugged:

```ts
// Each Aspect holds a reference to a parent "display object"
// (I used `dobj` as a shorthand) that contains everything
// this System draws. We set them all to be invisible when
// the System is disabled.
@override
public onDisabled(entities: Map<Entity, DebugInspectionAspect>): void {
    for (let aspect of entities.values()) {
        aspect.dobj.visible = false;
    }
}

// Here's the update() method. What, no onEnabled()? Read the text
// below for why.
public update(
    delta: number, entities: Map<Entity, DebugInspectionAspect>
): void {
    for (let aspect of entities.values()) {
        let position = aspect.get(Component.Position);

        // update position and rotate
        aspect.dobj.visible = true;
        aspect.dobj.position.set(position.p.x, position.p.y);
        aspect.dobj.rotation = angleClamp(
            aspect.dobj.rotation + DebugInspectionAspect.ROTATE_DELTA);
    }
}
```

I don't actually use the `onEnabled()` method here. And in fact, I only use it a couple times in the whole game! My usual pattern is what you see here: remove stuff in `onDisabled()`, and make sure everything is setup properly in `update()`.

The reason I don't use `onEnabled()` is simple: `update()` takes care of putting everything in the correct state, and `update()` is never called when a System is disabled. This means that if we write `update()` properly, we can rely on it to always put things back in the correct state after a System has been disabled.

## 3. ECS (and System) Cleanup

How many ECS engines should you have running in your game?

I didn't really know the answer to this question. So here's what I did:

- There's only ever one ECS, which owns everything.
- When you exit a level, all the Entities and Components are destroyed, and only the Systems persist.
- When you enter a new level, the game loads up all of the new Entities and Components into the ECS.

We could make a new ECS each level, but it seemed simplest to set up a single ECS once, wipe the objects when exiting a level, and build up the new level afterwards.

To support this kind of cleanup, the ECS has a `clear()` method. Here's what it is verbatim in my game codebase:

```ts
class ECS {

    /** (other code omitted) */

    /**
     * This is how you can remove all entities from the game (e.g., for
     * switching between scenes). Happens IMMEDIATELY.
     */
    public clear(): void {
        // remove all entities
        for (let entity of mapKeyArr(this.entities)) {
            this.destroyEntity(entity);
        }
        // clear the destroy queue. when destroying entities (above),
        // they will be removed from systems. some systems will then
        // try to queue up destruction of their own tracked entities
        // (e.g., gui entities). the queue would then carry onto the
        // next frame, where new legit entities would be deleted.
        arrayClear(this.entitiesToDestroy);

        // start fresh (done before onClear() because some systems will
        // start creating new entities right away (ahem, fx refilling
        // pools, ahem))
        this.nextEntityID = 0
        // tell all systems
        for (let system of this.systems.keys()) {
            system.onClear();
        }
        // tell all event handlers
        this.eventsManager.clear();

    }
}
```

You might notice a reference to a bug that I had previously (_"ahem, fx refilling pools, ahem"_). The way I implemented some Systems, like animated particle effects, was that they kept a pool of Entities around. When I implemented their `onClear()` functions, I had them immediately refill their pool of Entities. However, I hadn't reset the `ECS's` internal state properly yet (in particular, `this.nextEntityID`), so it shouldn't have been ready to accept new Entities. But the ECS faithfully added the new Entities anyway, using the high ID numbers.

If I recall correctly, we managed to avoid hitting this bug for a long time. I only found it when really bizarre things started happening, like certain walls lacking collision boxes---a result of Entity IDs being reused improperly and the Components getting jumbled.

Just for completeness, here's a couple example `onClear()` functions for some Systems:

```ts
// The Audio system queues up sounds to play, and ensures that it
// doesn't try to play the same one multiple times per frame.
class Audio extends System {

    // Clears its queue of things to play, and what has been played.
    @override
    public onClear() {
        arrayClear(this.queue);
        this.playedThisFrame.clear();
    }
}


// FxAnimations handle effects that are animated (e.g., particles that
// have multiple frames) and so must plug into the animation System.
class FxAnimations extends System {

    // The ECS has done the job of clearing all the Entities and
    // Components that existed, so our job is to create new ones.
    // Internally, the emitter clears its cache of Entity IDs and makes
    // new ones.
    @override
    public onClear(): void {
        for (let emitter of this.emitters.values()) {
            emitter.refillPools();
        }
    }
}
```

## 4. Systems Communicating

The way Systems communicated caused me more design stress than anything else in the game.

Have you ever read _The Zen of Python?_

> There should be one---and preferably only one---obvious way to do it.
>
> --- _Tim Peters, The Zen of Python_

Well, the problem was that I ended up making _three_ ways for Systems to communicate:

1. Passing information through `Component`s
    - This feels like the "officially supported" method for an ECS. It's implicit communication only: Systems only know about the Components, not other Systems.

2. Using an event system
    - I made an `EventsManager` (one per ECS) that let Systems both subscribe to and broadcast events. As a rule-of-thumb, I tried to have Systems still only take meaningful actions during their `update()`, rather than right when they received an event, so I could better reason about when things happened in each frame. This meant that some Systems would store a queue of events to process.

3. Directly calling methods (or changing attributes 😱) of other `System`s
    - I started by passing one `System` into another's `constructor`. But that awkwardly requires one to be created before the other, so I eventually added a `getSystem()` function to the ECS.

This diversity of options led to some monstrosities like the following, which lives in a `Script` section of the codebase:[^scripts]

[^scripts]: The abstraction I called `Script`s were my second-least-favorite design decision (after the many-ways-for-Systems-to-talk thing). Scripts lived somewhere outside the ECS, and would basically stitch Systems together through timed events and helper functions. They would continuously make things go awry, when, say, one script responsible for changing levels would step all over a script responsible for some screen transitions or control changes.

```ts
/**
 * Things that happen before a single frame is run in the new level.
 */
function startLevelInit(this: Script, allowAllAIs: boolean) {
    // disable player input (start w/ this b/c sometimes we start a level
    // w/o having exited a previous one, like at the start of the game)
    this.eventsManager.dispatch({
        name: Events.EventTypes.PlayerControl,
        args: { allow: false },
    });

    // maybe disable non-cutscene AIs
    if (!allowAllAIs) {
        this.ecs.getSystem(System.AISystem).inCutscene = true;
    }

    // fade in here
    this.ecs.getSystem(System.Fade).request(0, 1000);
}
```

This one function
- (a) uses the event system,
- (b) changes an attribute of one System
- (c) calls a method on another System

The big picture challenge here is that Systems end up being a catch-all place to add game logic, but there isn't an obvious way to orchestrate behavior across Systems. I'll write about this much more in the upcoming post called _Beyond Systems._

### Case Study: Passing Information with Components

For now, though, I want to illustrate the challenge of only passing information with Components. This seems like the most "pure" application of an ECS---no separate event system, no Systems talking to each other.

So, say we want to do something in our game like "go to the next level," and we want to make the changes described in the above piece of code:
- remove player control
- turn off AIs (maybe)
- fade in the screen from black.

How might we do that while only passing information in Components? Several awkward problems arise:

1. What Entities and Components would one use for a "go to next level" event? Even just this notion is totally bizarre---unlike the idea of a "player" or an "enemy," there's no object in the game world that is naturally represented by the concept of "let's change the level."

2. Even more awkward, we'd be overloading simple Systems with more responsibilities. Taking the example above, we have the `PlayerControl`, `AI`, and `Fade` Systems.[^systemDetails] Each of these tracks only the Entities they care about. If we want them to react to some Component that denotes the changing of a level, does this mean that we put like a special `LevelChange` Component on the player, all the enemies, and, uh... the map?

3. Finally, the orchestration itself is awkward. We might might have to wait for several frames for different Systems to react to some state change shoved into a Component, especially if the effects cascade. And the logic is no longer centralized, but spread across several Systems, which makes it harder to find in your code and reason about.

It seems clear that we need a place for _some_ higher order game logic that can orchestrate changes. As far as I can tell, we end up with two options:

1. Let other code (Systems or otherwise) directly reference Systems and call methods on them.
2. Partition your game logic so that everything that _would_ need higher level orchestration lives outside of Systems and the ECS.

[^systemDetails]: Technically that code snippet actually referenced two systems called `AISystem` and `Fade`, and sent an _event_ that referenced player control. (Just to be crystal clear for the sharp reader.)

This is where my expertise really reaches its limits, because these are issues I struggled with in programming the game. If you want my musings for what you might think about doing beyond pure Systems, stay tuned for the next post.
