---
title: What is an ECS?
date: 2021-11-25
tags: programming
series: Building an ECS in TypeScript
seriesOrder: 1
# image: /data/typescript-ecs/TBD.jpg
---

## Preface

This series is intended to be a simple walkthrough of building an ECS-based game engine in TypeScript. It's based off my work on [Fallgate]({{ "/posts/fallgate/" | url }}), a small 2D action-adventure game I built with my friend [Cooper](https://schmidlak.com/) over about two years of evenings and weekends.

## So, what _is_ an ECS?

ECS stands for _entity component system_. It is a design pattern used when programming games.

It works this way: you have Entities, Components, and Systems. (I'll capitalize these throughout.)

- **Entities** represent any game object, like the player, or a tree, or a spell. Each entity is just an ID number, like 42.

- **Components** are data associated with Entities. For example, the player Entity might have several Components, like a `Position` Component that holds its world coordinates, a `PlayerInput` Component that stores the latest controller input, and a `Sprite` Component that holds data for how to draw the player. Think of Components as bags of data, like JSON files.

    > Later on, we'll break this rule of "Components are just data" and squeeze some a little bit of code into them. But "Components are just data" is the right conceptual model.

- **Systems** are the actual code. They contain the game logic. Each System---and this is the important bit---selects all Entities which contain _at least_ the set of required components. For example, a `Renderer` System could select all entities that have both a `Position` and a `Sprite` Component, and would draw each `Sprites` at the `Position`.

    > You might already see why a System may be interested in additional Components. For example, the `Renderer` System may check whether the Entity also has a `Damaged` Component on it, indicating the Entity has recently taken damage. If so, it could render the `Sprite` with a red tint.

## ECS Visualization

This ECS visualization demonstrates the core concept of Systems: **selecting Entities that Contain _at least_ their required Components.** Under-the-hood, the visualization is powered by the ECS that we'll build in this series.

<script defer src="{{ "/assets/lib/three-r131.min.js" | url }}"></script>
<script defer src="{{ "/assets/lib/p5-1.4.0.min.js" | url }}"></script>
<script defer src="{{ "/assets/p5js/03-ecs-diagram.js" | url }}"></script>
<div class="mt5 mb5 dt w-100 ba">
    <div id="parent" class="dtc v-mid tc">
    </div>
</div>

- Try clicking on "add/remove entity" randomly generate/remove entities.

- Try hovering over the System areas to show the Systems selecting all Entities that match their set of required Components.
