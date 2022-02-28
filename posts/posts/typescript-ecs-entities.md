---
title: "Deeper Dive: Entities"
date: 2021-09-07
tags: programming
series: Building an ECS in TypeScript
seriesOrder: 5
# image: /data/typescript-ecs/TBD.jpg
---

Our Entity implementation is about as simple as can be.

```ts
/**
 * An entity is just an ID. This is used to look up its associated
 * Components.
 */
type Entity = number
```

But let me use this as an excuse to tell a little story. The story is about the most beautiful refactor of my life.

## My First `Entity` Implementation

When I was programming an ECS for the first time, I did what any good programmer would, and invented a pointless abstraction in fear of what the future might bring.

```ts
class Entity {
    private repr: string

    constructor(private id: number) {
        this.repr = 'Entity(' + id + ')';
    }

    public toString(): string {
        return this.repr;
    }
}
```

I am being a bit harsh on myself here. After all, I had no idea what kinds of things programming a game would demand. Perhaps I'd find a dire need to squirrel away information inside the Entity?

## The Most Beautiful Refactor of My Life

I wrote that first implementation on October 30, 2016.

On July 13, 2018, nearly two years of programming later, I had built a pretty hefty codebase with this ECS engine as the backbone. It managed tens of thousands of Entities across a variety of levels. The Entities ranged from the player, to enemies, to items, to environment objects, to even pieces of the GUI. The `Entity` class was referenced across several dozen files.

But all this time, I'd never put anything else inside the `Entity` class. So I had a simple thought: could we just change it to a number? Would this possibly work?

There was no reason to except elegance. Wanting to change this was pure greed---but the greed where you want a program to be simpler just because it's more beautiful that way.

Worth a try. I deleted the whole class, replacing it with the simple type alias above. Then, I changed the only place in the entire codebase an `Entity` was created, a single line in the ECS's `addEntity()` function, from

```ts
let entity = new Entity(this.nextEntityID);
```

to

```ts
let entity: Entity = this.nextEntityID;
```

... and that was it.

I pressed "compile." The whole game compiled. No errors.

I ran the game. No problems.

I could not believe it.
