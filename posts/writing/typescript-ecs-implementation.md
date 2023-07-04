---
title: A TypesScript ECS in 99 Lines of Code
date: 2021-09-04
tags: programming
series: Building an ECS in TypeScript
seriesOrder: 3
image: /assets/posts/typescript-ecs/ecs-screenshot.png
---

## Overview

Without further ado, this post is a minimal but complete TypeScript implementation of an ECS.

Here's a brief overview of five main parts of the code. I've written more about the `ComponentContainer`, since it seems like extra cruft, but is vital for making the API easy to work with.

1. `Entity` --- just a number.

2. `Component` --- just an empty class: subclass and add data!

3. `System` --- specifies which `Components` it needs to run on an entity, and what code to run each frame on `update()`.

4. `ComponentContainer` --- gives you access to an Entity's Components by the most convenient means for each circumstance:
    - **Instance:** when you will already have a Component, you just provide it (i.e., when `add()`ing that Component).
    - **Class:** when you won't have an instance of a Component, like when you want to `get()` a Component or see whether the Entity `has()` one, you instead provide its class.[^delete]

5. `ECS` --- you go through this to add or remove any Entity, Component, or System from the engine. It performs all the tracking and updating.

[^delete]: `delete()`ing the component is also implemented by **class** name, but it could be easily switched to instance instead. Or, you could provide both methods.

The actual code follows. I've heavily commented it up for readability, but if you remove the comments, it's [99 lines!](https://gist.github.com/mbforbes/c7bfba0ce62f1a1e6d69f9a8ffd1d828) I didn't make things JavaScript-y by, e.g., using functions for iterators (like with `.map()` or `.forEach()`), and instead stuck with generic, imperative programming.[^imperative]

[^imperative]: I kept the style imperative (a) to be true to how I wrote it originally, (b) to keep the code accessible to non-JavaScript programmers. Imperative TypeScript like this should be legible to most programmers. (I wasn't a TypeScript programer when I started writing an ECS engine in it, and even several thousand lines of code later, I still wouldn't really call myself one!)

## Code

```ts
/**
 * An entity is just an ID. This is used to look up its associated
 * Components.
 */
type Entity = number

/**
 * A Component is a bundle of state. Each instance of a Component is
 * associated with a single Entity.
 *
 * Components have no API to fulfill.
 */
abstract class Component { }

/**
 * A System cares about a set of Components. It will run on every Entity
 * that has that set of Components.
 *
 * A System must specify two things:
 *
 *  (1) The immutable set of Components it needs at compile time. (Its
 *      immutability isn't enforced by anything but my wrath.) We use the
 *      type `Function` to refer to a Component's class; i.e., `Position`
 *      (class) rather than `new Position()` (instance).
 *
 *  (2) An update() method for what to do every frame (if anything).
 */
abstract class System {

    /**
     * Set of Component classes, ALL of which are required before the
     * system is run on an entity.
     *
     * This should be defined at compile time and should never change.
     */
    public abstract componentsRequired: Set<Function>

    /**
     * update() is called on the System every frame.
     */
    public abstract update(entities: Set<Entity>): void

    /**
     * The ECS is given to all Systems. Systems contain most of the game
     * code, so they need to be able to create, mutate, and destroy
     * Entities and Components.
     */
    public ecs: ECS
}

/**
 * This type is so functions like the ComponentContainer's get(...) will
 * automatically tell TypeScript the type of the Component returned. In
 * other words, we can say get(Position) and TypeScript will know that an
 * instance of Position was returned. This is amazingly helpful.
 */
type ComponentClass<T extends Component> = new (...args: any[]) => T

/**
 * This custom container is so that calling code can provide the
 * Component *instance* when adding (e.g., add(new Position(...))), and
 * provide the Component *class* otherwise (e.g., get(Position),
 * has(Position), delete(Position)).
 *
 * We also use two different types to refer to the Component's class:
 * `Function` and `ComponentClass<T>`. We use `Function` in most cases
 * because it is simpler to write. We use `ComponentClass<T>` in the
 * `get()` method, when we want TypeScript to know the type of the
 * instance that is returned. Just think of these both as referring to
 * the same thing: the underlying class of the Component.
 *
 * You might notice a footgun here: code that gets this object can
 * directly modify the Components inside (with add(...) and delete(...)).
 * This would screw up our ECS bookkeeping of mapping Systems to
 * Entities! We'll fix this later by only returning callers a view onto
 * the Components that can't change them.
 */
class ComponentContainer {
    private map = new Map<Function, Component>()

    public add(component: Component): void {
        this.map.set(component.constructor, component);
    }

    public get<T extends Component>(
        componentClass: ComponentClass<T>
    ): T {
        return this.map.get(componentClass) as T;
    }

    public has(componentClass: Function): boolean {
        return this.map.has(componentClass);
    }

    public hasAll(componentClasses: Iterable<Function>): boolean {
        for (let cls of componentClasses) {
            if (!this.map.has(cls)) {
                return false;
            }
        }
        return true;
    }

    public delete(componentClass: Function): void {
        this.map.delete(componentClass);
    }
}

/**
 * The ECS is the main driver; it's the backbone of the engine that
 * coordinates Entities, Components, and Systems. You could have a single
 * one for your game, or make a different one for every level, or have
 * multiple for different purposes.
 */
class ECS {
    // Main state
    private entities = new Map<Entity, ComponentContainer>()
    private systems = new Map<System, Set<Entity>>()

    // Bookkeeping for entities.
    private nextEntityID = 0
    private entitiesToDestroy = new Array<Entity>()

    // API: Entities

    public addEntity(): Entity {
        let entity = this.nextEntityID;
        this.nextEntityID++;
        this.entities.set(entity, new ComponentContainer());
        return entity;
    }

    /**
     * Marks `entity` for removal. The actual removal happens at the end
     * of the next `update()`. This way we avoid subtle bugs where an
     * Entity is removed mid-`update()`, with some Systems seeing it and
     * others not.
     */
    public removeEntity(entity: Entity): void {
        this.entitiesToDestroy.push(entity);
    }

    // API: Components

    public addComponent(entity: Entity, component: Component): void {
        this.entities.get(entity).add(component);
        this.checkE(entity);
    }

    public getComponents(entity: Entity): ComponentContainer {
        return this.entities.get(entity);
    }

    public removeComponent(
        entity: Entity, componentClass: Function
    ): void {
        this.entities.get(entity).delete(componentClass);
        this.checkE(entity);
    }

    // API: Systems

    public addSystem(system: System): void {
        // Checking invariant: systems should not have an empty
        // Components list, or they'll run on every entity. Simply remove
        // or special case this check if you do want a System that runs
        // on everything.
        if (system.componentsRequired.size == 0) {
            console.warn("System not added: empty Components list.");
            console.warn(system);
            return;
        }

        // Give system a reference to the ECS so it can actually do
        // anything.
        system.ecs = this;

        // Save system and set who it should track immediately.
        this.systems.set(system, new Set());
        for (let entity of this.entities.keys()) {
            this.checkES(entity, system);
        }
    }

    /**
     * Note: I never actually had a removeSystem() method for the entire
     * time I was programming the game Fallgate (2 years!). I just added
     * one here for a specific testing reason (see the next post).
     * Because it's just for demo purposes, this requires an actual
     * instance of a System to remove (which would be clunky as a real
     * API).
     */
    public removeSystem(system: System): void {
        this.systems.delete(system);
    }

    /**
     * This is ordinarily called once per tick (e.g., every frame). It
     * updates all Systems, then destroys any Entities that were marked
     * for removal.
     */
    public update(): void {
        // Update all systems. (Later, we'll add a way to specify the
        // update order.)
        for (let [system, entities] of this.systems.entries()) {
            system.update(entities)
        }

        // Remove any entities that were marked for deletion during the
        // update.
        while (this.entitiesToDestroy.length > 0) {
            this.destroyEntity(this.entitiesToDestroy.pop());
        }
    }

    // Private methods for doing internal state checks and mutations.

    private destroyEntity(entity: Entity): void {
        this.entities.delete(entity);
        for (let entities of this.systems.values()) {
            entities.delete(entity);  // no-op if doesn't have it
        }
    }

    private checkE(entity: Entity): void {
        for (let system of this.systems.keys()) {
            this.checkES(entity, system);
        }
    }

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
}
```


## Example Usage

Of course, an engine isn't much fun without something to run on it. So let's try it out.

### Entities

To create and remove entities, we call `addEntity()` and `removeEntity()`:

```ts
let ecs = new ECS();
let entity = ecs.addEntity();
ecs.removeEntity(entity); // Removed after next update()
// Entity still here now.
ecs.update();
// Entity gone.
```

`removeEntity()`'s behavior is a bit funny on purpose. We don't want Entities being removed mid-frame, so we wait until the end of an `update()` to remove them.

### Components

To add Components, we have to make an actual Component of our own. Here's a Component that just stores some numbers:

```ts
class Position extends Component {
    constructor(public x: number, public y: number) { super(); }
}
```

To use it with our ECS, we use `addComponent()`, `getComponents()`, and `removeComponent()`.

```ts
let ecs = new ECS();
let entity = ecs.addEntity();
let position = new Position(5, 5);
ecs.addComponent(entity, position);  // add with *instance*
let comps = ecs.getComponents(entity);

// `comps` is a ComponentContainer
comps.has(Position)  // check with *class*
let p = comps.get(Position)  // get with *class*
// `p` is the same as `position`. TypeScript knows it is a Position
// instance at compile time, so we get autocomplete (`p.x`, `p.y`).
ecs.removeComponent(entity, Position);  // remove with *class*
```

### Systems

Our ECS requires each System specify (a) a non-empty list of Components it requires to run, (b) an `update()` method.

Here's a System that tracks all Entities that have a `Position` Component, and doesn't do anything during its `update()`.

```ts
class Locator extends System {
    componentsRequired = new Set<Function>([Position]);
    update(entities: Set<Entity>): void { super(); }
}
```

To our ECS, we can `addSystem()` and `removeSystem()`, and it will keep them up-to-date.

```ts
let ecs = new ECS();
let locator = new Locator();
ecs.addSystem(locator);

let entity = ecs.addEntity();
// The ECS is now tracking `entity`, but our `locator` won't care about
// it yet because it doesn't have a `Position`.
let position = new Position(5, 5);
ecs.addComponent(entity, position);
// Now, our Locator will get `entity` in its list for its next update().

ecs.removeSystem(locator); // Bye bye.
```

## What's Next

**Complexity.** This ECS is the one I started with when programming the game [Fallgate]({{ "/posts/fallgate/" | url }}). Its core design remained the same throughout the project, but over time I added a few more bells and whistles to handle needs that I encountered. So, I'd like to go through each aspect of the engine and write more about how it grew and why. I'll do that in the upcoming sections.

> In general, though, this was one area where organic growth worked well. If I didn't need some capability---like removing a system, as I mentioned above in the code---I just never wrote it.

**Design choices.** Where I can remember to, I'll also discuss design decisions that we made in the code above, and how you might do things differently. The essence of ECS is minimal: Systems selecting Entities with a superset of their required Components. This makes it straightforward to try different flavors of implementation.

But first, let's actually run some simple tests to see whether our code works.
