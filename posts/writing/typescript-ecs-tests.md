---
title: Tests
date: 2021-09-05
tags: programming
series: Building an ECS in TypeScript
seriesOrder: 4
image: /assets/posts/typescript-ecs/ecs-screenshot.png
---

The one time I ever wrote tests in making the game Fallgate was after writing the ECS at the very beginning of the project. I only wrote tests because I was in shock at how easy the ECS was to implement. I was sure I'd done something wrong.

Let's run some simple tests to verify things are working.

To set up our tests, I'm going to define some Components and Systems. Both Components just store data. The Systems will expose a public field called `entitiesSeenLastUpdate`, which they'll update during their `update()`. We'll use that to check that the Systems are seeing the Entities we expect them to. (Except for the `Destroyer` System, which we'll just use to remove our Entities.)

Here's the definitions of two components and four systems we'll use:

```ts
// Components:

class Position extends Component {
    constructor(public x: number, public y: number) { super(); }
}

class Health extends Component {
    constructor(public maximum: number, public current: number) {
        super();
    }
}

// Systems:

class Locator extends System {
    componentsRequired = new Set<Function>([Position]);

    public entitiesSeenLastUpdate: number = -1

    update(entities: Set<Entity>): void {
        this.entitiesSeenLastUpdate = entities.size;
    }
}

class Damager extends System {
    componentsRequired = new Set<Function>([Health]);

    public entitiesSeenLastUpdate: number = -1

    update(entities: Set<Entity>): void {
        this.entitiesSeenLastUpdate = entities.size;
    }
}

class HealthBarRenderer extends System {
    componentsRequired = new Set<Function>([Position, Health]);

    public entitiesSeenLastUpdate: number = -1

    update(entities: Set<Entity>): void {
        this.entitiesSeenLastUpdate = entities.size;
    }
}

class Destroyer extends System {
    componentsRequired = new Set<Function>([Health]);

    update(entities: Set<Entity>): void {
        for (let entity of entities) {
            this.ecs.removeEntity(entity);
        }
    }
}
```

The testing code is going to look terrible to anyone who actually writes tests using a good library or tool. I'm just using `console.log()` to print whether conditions we expect to be true indeed are. Why? It was quick and easy. And testing isn't really a main focus of what we're doing overall.

```ts
function test() {
    console.log("Running basic test.")
    let ecs = new ECS();

    // Try out basic Component operations.
    let entity1 = ecs.addEntity();
    let position1 = new Position(5, 5);
    ecs.addComponent(entity1, position1);
    console.log(
        ecs.getComponents(entity1).has(Position), "-- component adding");
    let gotP = ecs.getComponents(entity1).get(Position);
    console.log(
        gotP.x == position1.x && gotP.y == position1.y,
        "-- component retrieval"
    );
    ecs.removeComponent(entity1, Position);
    console.log(
        !ecs.getComponents(entity1).has(Position),
        "-- component deletion"
    );

    // Try out basic System operations.
    let locator = new Locator();
    ecs.addSystem(locator)
    // Important note: we don't call `update()` here to update the
    // system's tracking of entities. That happens automatically. We're
    // doing it because we had the Locator set its
    // `entitiesSeenLastUpdate` field when its `update()` is called. This
    // way we can verify it's updating correctly without peeking into
    // private state.
    ecs.update();
    console.log(
        locator.entitiesSeenLastUpdate == 0,
        "-- system doesn't track w/o match"
    );
    ecs.addComponent(entity1, position1);
    ecs.update();
    console.log(
        locator.entitiesSeenLastUpdate == 1,
        "-- system does track w/ match"
    );
    ecs.removeComponent(entity1, Position);
    ecs.update();
    console.log(
        locator.entitiesSeenLastUpdate == 0,
        "-- system removes tracking w/o match"
    );
    let health1 = new Health(10, 10);
    ecs.addComponent(entity1, position1);
    ecs.addComponent(entity1, health1);
    ecs.update();
    console.log(
        locator.entitiesSeenLastUpdate == 1,
        "-- system does track w/ superset"
    );

    // Try out Systems that track multiple Components.
    let damager = new Damager();
    ecs.addSystem(damager);
    let healthBarRenderer = new HealthBarRenderer();
    ecs.addSystem(healthBarRenderer);
    let entity2 = ecs.addEntity();
    let health2 = new Health(2, 2);
    ecs.addComponent(entity2, health2);
    // At this point:
    // e1 has Position, Health; should be tracked by Loc, Dmg, HBR
    // e2 has           Health; should be tracked by      Dmg
    ecs.update(); // Again, call to update Systems' records.
    console.log(
        locator.entitiesSeenLastUpdate == 1,
        "-- Locator tracking 1 entity"
    );
    console.log(
        damager.entitiesSeenLastUpdate == 2,
        "-- Damager tracking 2 entities"
    );
    console.log(
        healthBarRenderer.entitiesSeenLastUpdate == 1,
        "-- HealthBarRenderer tracking 1 entity"
    );

    // Try out Systems that remove entities. The Destroyer should mark
    // both of our Entities for removal when `update()` is called---but
    // crucially, the other Systems should still be able to see Entities
    // during their `update()`. This is because we've defined
    // `removeEntity` to *mark* entities for removal, but actually remove
    // them at the end of the `update()` call. We haven't implemented
    // priority ordering yet, so right now Systems update in Map
    // iteration order, which is insertion order
    // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/
    /// Reference/Global_Objects/Map).
    // Thus, to make sure that our "remove at end of `update()`" behavior
    // is actually working, we'll remove the other Systems, add the
    // Destroyer first, and then add the others back in.
    ecs.removeSystem(locator)
    ecs.removeSystem(damager)
    ecs.removeSystem(healthBarRenderer)
    let destroyer = new Destroyer();
    ecs.addSystem(destroyer)
    ecs.addSystem(locator)
    ecs.addSystem(damager)
    ecs.addSystem(healthBarRenderer)
    ecs.update(); // All Entities removed.
    console.log(
        locator.entitiesSeenLastUpdate == 1,
        "-- Locator: entity not removed during update"
    );
    console.log(
        damager.entitiesSeenLastUpdate == 2,
        "-- Damager: entity not removed during update"
    );
    console.log(
        healthBarRenderer.entitiesSeenLastUpdate == 1,
        "-- HealthBarRenderer: entity not removed during update"
    );
    ecs.update(); // Everyone should have seen zero this round.
    console.log(
        locator.entitiesSeenLastUpdate == 0,
        "-- Locator: entities gone "
    );
    console.log(
        damager.entitiesSeenLastUpdate == 0, "-- Damager: entities gone");
    console.log(
        healthBarRenderer.entitiesSeenLastUpdate == 0,
        "-- HealthBarRenderer: entities gone"
    );
}

test();
```

<script src="/assets/posts/typescript-ecs/01-pure-ecs.js"></script>

## You Already Ran This Test

Does the ECS pass this test? You tell me. The ECS is running on this webpage, and the test ran as soon as you loaded it. If you're on a Desktop, open up your developer tools console and check what you see.[^console]

[^console]: If you're not familiar with opening developer tools on a webpage, just Google "open developer tools &lt;browser&gt;". For Chrome on a Mac, Cmd+Shift+C works.

This is what I see:

![](/assets/posts/typescript-ecs/test-results.jpg)

## Try It Out

In case you'd like to try out the `ECS` yourself, I've also exposed it and the above Components and Systems on this page. In the console, try something like

```js
let ecs = new ECS();
ecs.addEntity();
```

... and see whether it gives you `0` back.
