/******/ (() => { // webpackBootstrap
    var __webpack_exports__ = {};
    /*!**********************************!*\
      !*** ./src/01-pure-ecs/index.ts ***!
      \**********************************/
    /**
     * A Component is a bundle of state. Each instance of a Component is
     * associated with a single Entity.
     *
     * Components have no API to fulfill.
     */
    class Component {
    }
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
    class System {
    }
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
        constructor() {
            this.map = new Map();
        }
        add(component) {
            this.map.set(component.constructor, component);
        }
        get(componentClass) {
            return this.map.get(componentClass);
        }
        has(componentClass) {
            return this.map.has(componentClass);
        }
        hasAll(componentClasses) {
            for (let cls of componentClasses) {
                if (!this.map.has(cls)) {
                    return false;
                }
            }
            return true;
        }
        delete(componentClass) {
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
        constructor() {
            // Main state
            this.entities = new Map();
            this.systems = new Map();
            // Bookkeeping for entities.
            this.nextEntityID = 0;
            this.entitiesToDestroy = new Array();
        }
        // API: Entities
        addEntity() {
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
        removeEntity(entity) {
            this.entitiesToDestroy.push(entity);
        }
        // API: Components
        addComponent(entity, component) {
            this.entities.get(entity).add(component);
            this.checkE(entity);
        }
        getComponents(entity) {
            return this.entities.get(entity);
        }
        removeComponent(entity, componentClass) {
            this.entities.get(entity).delete(componentClass);
            this.checkE(entity);
        }
        // API: Systems
        addSystem(system) {
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
        removeSystem(system) {
            this.systems.delete(system);
        }
        /**
         * This is ordinarily called once per tick (e.g., every frame). It
         * updates all Systems, then destroys any Entities that were marked
         * for removal.
         */
        update() {
            // Update all systems. (Later, we'll add a way to specify the
            // update order.)
            for (let [system, entities] of this.systems.entries()) {
                system.update(entities);
            }
            // Remove any entities that were marked for deletion during the
            // update.
            while (this.entitiesToDestroy.length > 0) {
                this.destroyEntity(this.entitiesToDestroy.pop());
            }
        }
        // Private methods for doing internal state checks and mutations.
        destroyEntity(entity) {
            this.entities.delete(entity);
            for (let entities of this.systems.values()) {
                entities.delete(entity); // no-op if doesn't have it
            }
        }
        checkE(entity) {
            for (let system of this.systems.keys()) {
                this.checkES(entity, system);
            }
        }
        checkES(entity, system) {
            let have = this.entities.get(entity);
            let need = system.componentsRequired;
            if (have.hasAll(need)) {
                // should be in system
                this.systems.get(system).add(entity); // no-op if in
            }
            else {
                // should not be in system
                this.systems.get(system).delete(entity); // no-op if out
            }
        }
    }
    // ------------------------
    // Code to test out the ECS
    // ------------------------
    class Position extends Component {
        constructor(x, y) {
            super();
            this.x = x;
            this.y = y;
        }
    }
    class Health extends Component {
        constructor(maximum, current) {
            super();
            this.maximum = maximum;
            this.current = current;
        }
    }
    class Locator extends System {
        constructor() {
            super(...arguments);
            this.componentsRequired = new Set([Position]);
            this.entitiesSeenLastUpdate = -1;
        }
        update(entities) {
            this.entitiesSeenLastUpdate = entities.size;
        }
    }
    class Damager extends System {
        constructor() {
            super(...arguments);
            this.componentsRequired = new Set([Health]);
            this.entitiesSeenLastUpdate = -1;
        }
        update(entities) {
            this.entitiesSeenLastUpdate = entities.size;
        }
    }
    class HealthBarRenderer extends System {
        constructor() {
            super(...arguments);
            this.componentsRequired = new Set([Position, Health]);
            this.entitiesSeenLastUpdate = -1;
        }
        update(entities) {
            this.entitiesSeenLastUpdate = entities.size;
        }
    }
    class Destroyer extends System {
        constructor() {
            super(...arguments);
            this.componentsRequired = new Set([Health]);
        }
        update(entities) {
            for (let entity of entities) {
                this.ecs.removeEntity(entity);
            }
        }
    }
    function test() {
        console.log("Running basic test.");
        let ecs = new ECS();
        // Try out basic Component operations.
        let entity1 = ecs.addEntity();
        let position1 = new Position(5, 5);
        ecs.addComponent(entity1, position1);
        console.log(ecs.getComponents(entity1).has(Position), "-- component adding");
        let gotP = ecs.getComponents(entity1).get(Position);
        console.log(gotP.x == position1.x && gotP.y == position1.y, "-- component retrieval");
        ecs.removeComponent(entity1, Position);
        console.log(!ecs.getComponents(entity1).has(Position), "-- component deletion");
        // Try out basic System operations.
        let locator = new Locator();
        ecs.addSystem(locator);
        // Important note: we don't call `update()` here to update the
        // system's tracking of entities. That happens automatically. We're
        // doing it because we had the Locator set its
        // `entitiesSeenLastUpdate` field when its `update()` is called. This
        // way we can verify it's updating correctly without peeking into
        // private state.
        ecs.update();
        console.log(locator.entitiesSeenLastUpdate == 0, "-- system doesn't track w/o match");
        ecs.addComponent(entity1, position1);
        ecs.update();
        console.log(locator.entitiesSeenLastUpdate == 1, "-- system does track w/ match");
        ecs.removeComponent(entity1, Position);
        ecs.update();
        console.log(locator.entitiesSeenLastUpdate == 0, "-- system removes tracking w/o match");
        let health1 = new Health(10, 10);
        ecs.addComponent(entity1, position1);
        ecs.addComponent(entity1, health1);
        ecs.update();
        console.log(locator.entitiesSeenLastUpdate == 1, "-- system does track w/ superset");
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
        console.log(locator.entitiesSeenLastUpdate == 1, "-- Locator tracking 1 entity");
        console.log(damager.entitiesSeenLastUpdate == 2, "-- Damager tracking 2 entities");
        console.log(healthBarRenderer.entitiesSeenLastUpdate == 1, "-- HealthBarRenderer tracking 1 entity");
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
        ecs.removeSystem(locator);
        ecs.removeSystem(damager);
        ecs.removeSystem(healthBarRenderer);
        let destroyer = new Destroyer();
        ecs.addSystem(destroyer);
        ecs.addSystem(locator);
        ecs.addSystem(damager);
        ecs.addSystem(healthBarRenderer);
        ecs.update(); // All Entities removed.
        console.log(locator.entitiesSeenLastUpdate == 1, "-- Locator: entity not removed during update");
        console.log(damager.entitiesSeenLastUpdate == 2, "-- Damager: entity not removed during update");
        console.log(healthBarRenderer.entitiesSeenLastUpdate == 1, "-- HealthBarRenderer: entity not removed during update");
        ecs.update(); // Everyone should have seen zero this round.
        console.log(locator.entitiesSeenLastUpdate == 0, "-- Locator: entities gone ");
        console.log(damager.entitiesSeenLastUpdate == 0, "-- Damager: entities gone");
        console.log(healthBarRenderer.entitiesSeenLastUpdate == 0, "-- HealthBarRenderer: entities gone");
        Object.assign(window, {
            ECS, Position, Health, Locator, Damager, HealthBarRenderer,
            Destroyer
        });
    }
    test();

    /******/
})()
    ;
