---
title: Aspects
date: 2022-01-03
tags: programming
series: Building an ECS in TypeScript
seriesOrder: 8
image: /assets/posts/typescript-ecs/ecs-screenshot.png
---

> **Disclaimer:** I'm not sure whether "Aspects" are really a standard thing for ECS. (Or, if they are, whether my usage is the standard one.) When I was learning about ECS, my friend [Alex](https://spacefiller.space/) told me about this idea of Aspects, so I implemented them as he described. They proved useful, so I'm including them here.

## What is an Aspect?

An Aspect stores transient state about an Entity for a System.

For example, if you have a `Renderer` System, then it might have an Aspect (e.g., the `RendererAspect`) that stores information about the underlying graphics objects it is using to render an Entity. Whereas an Entity's Component (e.g., a `Sprite` component) might contain the high level information needed to draw it (e.g., the image paths for different animations), the `RendererAspect` could contain the raw texture data used by the underlying graphics library.

Here are some properties of Aspects:

- Aspects are optional. A System might not need them.

- An Aspect is specific to a particular System. No other System will see an Aspect.

- An Aspect should store data that can be reconstructed by Components. In other words, the game state should be fully represented by the Components.

You can think of Aspects like per-Entity caches that Systems use to store internal state. It's simply a standard place for a System to store data that is (a) specific to an Entity, and (b) not a good fit for storing in Components.

## Planning Our Implementation

I implemented Aspects by having them become the default way Systems access Entities and their Components. Every time a System starts tracking an Entity, it creates an Aspect for it.

This way, Systems can easily upgrade their Aspect usage to include storing additional information. By default, a System gets the standard Aspect, which just has references to the Entity and Components. But if a System decides to make a custom Aspect, then it will receive them instead.

Let's dive in.

## The `Aspect`

First, we have the Aspect itself. There's a bit of awkwardness around initialization, especially storing the Components, which you can see in the `setCC()` method. I'll discuss it more below.

```ts
/**
 * An Aspect is a System's view of an Entity. In other words, it
 * allows a System to store its own (transient!) state for each
 * Entity.
 */
class Aspect {

    public entity: Entity
    private components: ComponentContainer

    /**
     * Called by ECS at setup to pass in the Entity's Component
     * Container reference. Simply done this way so Systems and
     * Aspect subclasses don't have to pass these around during
     * construction. Any initialization will likely be done in the
     * System's `onAdd()` function, which is given the new Aspect.
     */
    public setCC(cc: ComponentContainer) {
        this.components = cc;
    }

    /**
     * Directly gets a Component. Example: `aspect.get(Position)`.
     *
     * @param c The Component class (e.g., Position).
     */
    public get<T extends Component>(c: ComponentClass<T>): T {
        return this.components.get(c);
    }

    /**
     * Check whether 1 or more components exist. Returns true only if
     * *all* components exist. Example: `aspect.has(Position)`.
     *
     * @param cs One or more Component classes (e.g., Position).
     */
    public has(...cs: Function[]): boolean {
        for (let c of cs) {
            if (!this.components.has(c)) {
                return false;
            }
        }
        return true;
    }
}
```

I chose to have the `setCC()` method in the `Aspect` base class, and to use it in the `ECS` engine. This is a bit ugly, but it means that custom `Aspect` subclasses, and `System`s that create them, don't have to worry about passing the `Component`s to the `Aspect`; it all happens in the `ECS`.

Speaking of which, let's check out our modifications to `System`.

## Making the `System` use `Aspect`s

We'll make four modifications to the `System` to handle `Aspects`:

1. A new `makeAspect()` method, which can be overridden to make a custom `Aspect`

2. A new `onAdd()` method, called when a new `Entity` is tracked

3. A new `onRemove()` method, called when an `Entity` is no longer tracked

4. The `update()` method will now provide the `System` its `Aspects`

Here's how these look in our `System` class:

```ts
abstract class System {

    /** ... omitting what we 've seen before ...*/

    /**
     * `makeAspect()` is called to make a new Aspect for this System,
     * which happens whenever an Entity is added. By default, Systems
     * get a standard Aspect. If they override this, they can return
     * a subclass of Aspect instead, which they can use to store
     * stuff in. Whatever they return here will be the Aspect they
     * get in `update()`, `onAdd()`, and `onRemove()`.
     */
    public makeAspect(): Aspect {
        return new Aspect();
    }

    /**
     * `onAdd()` is called just AFTER an entity is added to a system.
     * (It *will* be in the system's set of entities.)
     */
    public onAdd(aspect: Aspect): void { }

    /**
     * `onRemove()` is called just AFTER an entity is removed from a
     * system. (It will *not* be in the system's set of entities.)
     */
    public onRemove(aspect: Aspect): void { }

    /**
     * `update()` is called on the System every frame.
     */
    public abstract update(
        entities: Map<Entity, Aspect>, dirty: Set<Entity>
    ): void
}
```

## Making the `ECS` use `Aspect`s

There are three changes to the `ECS` to support `Aspects`: (1) tracking `Aspect`s, (2) adding `Entity`s, (3) removing `Entity`s.[^diffviz]

[^diffviz]: I wish I could just render a `diff` of the `ECS` code before and after the `Aspect` implementation. I spent a while trying to find a simple `diff` renderer that I could embed here, but I didn't find anything that would provide syntax highlighting, match the website style, and let me just render it (to HTML) beforehand. If you're reading this and know of one, please let me know.

### 1. Tracking `Aspect`s

For each `System`, we now track a mapping from `Entity` to `Aspect`:

```ts
// Before:
private systems = new Map<System, Set<Entity>>()
// After:
private systems = new Map<System, Map<Entity, Aspect>>()
```

And so, when we add a System, we make `Map` instead of a `Set`:

```ts
// Before:
this.systems.set(system, new Set());
// After:
this.systems.set(system, new Map());
```

### 2. Adding `Entity`s

We have a private `checkES()` helper method, which checks whether an `Entity` should be tracked by a `System`. The implementation before was quite simple: if the `Component`s fulfill the `System`'s requirements, it's added to the `System`'s set.

```ts
// Before:
private checkES(entity: Entity, system: System): void {
    let have = this.entities.get(entity);
    let need = system.componentsRequired;
    if (have.hasAll(need)) {
        // should be in system
        this.systems.get(system).add(entity); // no-op if in
    } else {
        // should not be in system
        this.systems.get(system).delete(entity); // no-op if out
    }
}
```

With `Aspect`s, the logic to check whether an `Entity` should be tracked is the same, but what we do becomes a tiny bit more complicated, because we have to make an `Aspect` and add the `Entity` and `Components` to it.

```ts
// After:
private checkES(entity: Entity, system: System): void {
    let have = this.entities.get(entity);
    let need = system.componentsRequired;
    let aspects = this.systems.get(system);
    if (have.hasAll(need)) {
        // should be in system; add if not
        if (!aspects.has(entity)) {
            let aspect = system.makeAspect();
            aspect.entity = entity;
            aspect.setCC(have);
            aspects.set(entity, aspect);
            system.onAdd(aspect);
        }
    } else {
        // should not be in system
        aspects.delete(entity); // no-op if out
    }
}
```

### 3. Removing `Entity`s

Getting rid of an `Entity` now means letting the `System` know we've removed the `Aspect` by calling `onRemove()` so it can do any cleanup.

> Aside: I'm omitting the extra logic we added for the [dirty Component optimization](/posts/typescript-ecs-dirty-component-optimization); it's included in the complete code listing linked below.

```ts
// Before:
private destroyEntity(entity: Entity): void {
    this.entities.delete(entity);
    for (let [system, entities] of this.systems.entries()) {
        // Remove Entity from System (if applicable).
        entities.delete(entity);  // no-op if doesn't have it
    }
}
```

```ts
// After:
private destroyEntity(entity: Entity): void {
    this.entities.delete(entity);
    for (let [system, entities] of this.systems.entries()) {
        // Remove Entity from System (if applicable).
        if (entities.has(entity)) {
            let aspect = entities.get(entity);
            entities.delete(entity);
            system.onRemove(aspect);
        }
    }
}
```

## Trying It Out

Now we have an `Aspect` implementation, and we've changed `System` and `ECS` to use them. They've become the way that `Systems` know about `Entity`s and `Component`s. We've also made it so that a `System` can subclass `makeAspect()`. When it does that, the `System` will instead receive its custom Aspects:

- when it starts tracking an Entity (`onAdd()`)
- when it stops tracking an Entity (`onRemove()`)
- on every `update()`

Let's take it for a ride.

Say we have some data in a `Component`. To make things dead simple, let's store a single number:

```ts
class NumberHolder extends Component {
    constructor(public myNumber: number) { super(); }
}
```

Now, let's imagine that we have a `System` that needs something that can be computed based on the `NumberHolder` Component, but it's really expensive to do so. Just for a simple example, let's store the square of that number.

> To be crystal clear: the square of a number is trivial to compute, even every frame. We're just imagining that it's something expensive, like some internal graphics objects used for rendering.

To store this, we can make a special `Aspect`:

```ts
class NumberSquarerAspect extends Aspect {
    public numberSq: number
}
```

Finally, we'll make a `System` that:

1. Overrides `makeAspect()` to ask for a `NumberSquarerAspect` instead of a normal `Aspect`

2. Overrides `onAdd()` to do something every time a new `NumberSquarerAspect` is made---specifically, it will square the Component's number and store it

3. Provides an `update()` to show off what it's done

```ts
class NumberSquarer extends System {
    componentsRequired = new Set<Function>([NumberHolder])

    makeAspect(): NumberSquarerAspect {
        return new NumberSquarerAspect()
    }

    onAdd(aspect: NumberSquarerAspect): void {
        let n = aspect.get(NumberHolder).myNumber;
        aspect.numberSq = n * n;
    }

    update(
        entities: Map<Entity, NumberSquarerAspect>,
        dirty: Set<Entity>
    ): void {
        for (let aspect of entities.values()) {
            let n = aspect.get(NumberHolder).myNumber;
            console.log("n=" + n + ', n^2=' + aspect.numberSq);
        }
    }
}
```

We can run the above with a couple example Components:

```ts
let ecs = new ECS();

ecs.addSystem(new NumberSquarer());

let e1 = ecs.addEntity();
ecs.addComponent(e1, new NumberHolder(4));
let e2 = ecs.addEntity();
ecs.addComponent(e2, new NumberHolder(10));

ecs.update();
```

When we run it, we see:

```txt
n=4, n^2=16
n=10, n^2=100
```

During the `update()`, the `System` was successfully able to retrieve the data it stored in the `Aspect` for each `Entity`.

## Real `Aspect` Use Cases

I generally used `Aspect`s to store `System`-specific state that _needed to persist between frames._ Here are some examples:

- **AI** --- My AI `System`s stored a bunch of temporary state, like where the `Entity` last spawned, what action it's doing, and how long it's been doing that action.

- **Particles** --- Particle effects, like bleeding after being hit, only happen for a short period of time. The `System`s controlling those effects would track how many frames an effect has been happening.

- **Tweens** --- `System`s responsible for running tweens---i.e., interpolations between values---store a queue of tweens that are waiting to happen, and a set of running tweens along with their state.

- **Graphics Objects** --- Rendering `System`s stored references to the underlying objects they constructed. Since I was using [PixiJS](https://github.com/pixijs/pixijs), the `Aspect`s stored references to Pixi objects, or my own thin wrappers around them.

## Final Thoughts: `Aspect` vs `Component`

Some of the above use cases probably seem like good candidates for storing in `Component`s rather than in `Aspect`s.

Here's how I made that call: I used `Aspect`s when I wanted to store extra per-`Entity` data that only one `System` would ever care about. If the data ever became useful for more than one `System`, that was a sign it should probably go in a `Component` instead.

However, we might wonder whether we should use `Aspect`s at all. Should we just use `Component`s for everything?

I think there's a good argument to be made for only using `Component`s to store all data. To me, this is a perfectly acceptable design decision because it avoids the complexity of introducing a new concept (the `Aspect`) to the engine.

The advantage of storing single `System`-specific data in `Aspect`s is that other `System`s don't need to bother with even looking at that data. Since `Component`s can be accessed by all `System`s, their state is "global," in a sense. Squirreling some state away in `Aspect`s was a way of keeping **`System`-local** state for `Entity`s that persisted between frames.

## Code Listing

Here's the [full code listing so far](https://gist.github.com/mbforbes/be6583042eb9a16091f0af98662fb2e6), which includes the [dirty Component optimization](/posts/typescript-ecs-dirty-component-optimization) and `Aspect`s.
