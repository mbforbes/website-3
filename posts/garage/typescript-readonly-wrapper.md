---
title: TypeScript readonly wrapper
date: 2023-09-19
tags: ["til", "react", "typescript"]
---

## Summary

I stumbled upon a great type to enforce object immutability at compile time if that's all you're worried about:

```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
```

<p class="figcaption">
Maybe this was obvious to everybody already?
</p>

I'm using it in a situation where I want to be able to look at an object, but make sure I don't update it directly. (Instead, I want to force myself to call an `updateState()` function.)

Use it like this:

```ts
// A little protective wrapper around a state object
class Wrapper {
  constructor(private _state: GameState) {}

  get state(): DeepReadonly<GameState> {
    return this._state;
  }

  updateState() { ... }
}

// So that...
wrapper = new Wrapper({ foo: 1 });
wrapper.state.foo; // read: OK
wrapper.state.foo = 2; // write: error
wrapper.updateState((s) => {
  s.foo = 2;
}); // update: OK (using Immer btw)
```

<p class="figcaption">
{{ "Now I can read but not write `state`. Preventing accidental mutation by myself. Read below for more context." | md | safe }}
</p>

## Long version

I'm finally learning React, and I'm trying to manage state that is shared with React and an external system.

I'm working on a game that's trying to use React for the frontend and nothing else. I want to be able to implement complex application logic the way I've been thinking about it, rather than muscling it into `useEffect()` and jointly reasoning about component lifecycles.

I'm starting with what I hope is a straightforward approach:^[Still took me a long time to hack this together conceptually. Wow React is no joke.]

- have a state object
- do any updates with Immer
- React registers to listen to any changes
- React maintains its own copy with `useState` (the `setState` function is passed as the listener for the previous bullet)
- React's `useContext` provides the state globally
- any React component can call `useGame()` to access the Context and thus the state

Here's what the state wrapper looked like.

```ts
import { produce } from "immer";

interface GameState { ... } // just some object with stuff
type GameStateUpdater = (s: GameState) => void;
type GameStateListener = GameStateUpdater;

// Here's the little state wrapper
class Wrapper {
  private listeners: GameStateListener[];
  constructor(public state: GameState) {
    this.listeners = [];
  }

  // Either React or game code can update state using this.
  updateState(updater: GameStateUpdater) {
    this.state = produce(this.state, updater);
    this.listeners.forEach((listener) => listener(this.state));
  }

  // React passes setState here so it can keep its own copy in sync.
  addListener(listener: GameStateListener) {
    this.listeners.push(listener);
    listener(this.state);
  }
}
```

<p class="figcaption">
{{ "A minimal state wrapper. The class wraps an object (`GameState`) and lets you update it (`updateState()`) and broadcasts updates to listeners (sent into `addListener()`). React maintains its own copy of the state, and gets updates by passing its `setState` function into `addListener()`. But how do you expose `this.state` for readers, but prevent them from modifying it?" | md | safe }}
</p>

I'm going to omit all the React boilerplate stuff of setting up context, making its own copy of the state, subscribing as a listener, making a provider, and establishing an effect to provide this to components.

The issue here is that while there's a way to update state correctly, but I couldn't figure out how to allow both (a) reading the state easily, and (b) not accidentally writing the state.

Here's the correct way to update state. You pass an updating function. I let Immer do the update.

```ts
wrapper.updateState((s) => {
  s.foo = 2;
});
```

<p class="figcaption">
{{ "To update state, you pass a mutating updater function. The implementation uses Immer's `produce()` to make a new object." | md | safe }}
</p>

For the state to be useful, you have to be able to actually, you know, read it. If `this.state` is `public` you can just get the object. But then nothing is stopping you from mutating state directly.

```ts
// Bad! React won't know about my changes.
wrapper.state.foo = 2;
```

Doing this is very bad because React is listening for changes, and it only finds out about them if `updateState()` is called.

I wanted a simple-as-possible approach to solve this, and didn't want to install any more libraries if not absolutely necessary.

I started by writing a wrapper that would register itself as another listener alongside React, and expose views of the state object. I thought this would be good because then I could also precompute other data structures I wanted.

```ts
// NOTE: switch to something like https://www.npmjs.com/package/lodash.clonedeep
// if ever running into issues with more complex stuff.
function deepCopy<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Our own listener to subscribe to changes in GameStateWrapper
// and hold data structures to be used.
class GameStateObserver {
  public levelMap: Map<string, Level> = new Map();

  public update(state: GameState) {
    // update levelMap
    this.levelMap.clear();
    for (let level of state.levels) {
      this.levelMap.set(level.level_id, deepCopy(level));
    }
  }
}

// We register this observer as another listener, like React.
let obs = new GameStateObserver();
wrapper.addListener(obs);
```

<p class="figcaption">
{{ "This approach makes our own API of the state object by writing an observer. Every time the state changes, we make copies of what we want to use. It already feels over-engineered. Plus, we can still accidentally modify `state` during `update()`!" | md | safe }}
</p>

But then I realized this was probably a bad idea. I remembered back from the React tutorial that state typically includes _everything,_ including individual text fields that get updated every key press. With this approach, `update()` would be called constantly. This means I'd be deleting and re-creating all my data structures every keypress, making new copies of all the objects. To avoid that, I'd have to do something fancy, like looking at the updates Immer is actually doing and skipping them when I thought it was OK to.^[I.e., premature optimization, i.e., maintaining my own cache correctness, i.e., the potential root of a thousand woes.]

Plus, I can still accidentally update the state in the `GameStateObserver` itself! I have to write the `update()` function carefully to defensively copy objects. Sure, any code that _uses_ the `GameStateObserver` will get an immutable view. But since I'm really trying to guard against myself, I still have the original problem of tip-toeing around accidentally modifying state.

I looked around briefly---there's `Object.freeze`, which I _think_ would have been compatible with Immer, but I didn't want to think about recursive freezing and whether to keep my wrapper or make copies.

What I really wanted was just to be able to use `this.state` directly, but make sure I didn't accidentally write to it.

GPT-4 came up with a quick hack for this, the `DeepReadOnly` type wrapper. I made the state private (it became `this._state`) and made a getter that returns a `DeepReadOnly` wrapper of it.

```ts/0-2,7,11-13
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

// updated state wrapper, with private this._state, and getter
class GameStateWrapper {
  private listeners: GameStateListener[];
  constructor(private _state: GameState) {
    this.listeners = [];
  }

  get state(): DeepReadonly<GameState> {
    return this._state;
  }

  updateState(updater: GameStateUpdater) {
    this._state = produce(this._state, updater);
    this.listeners.forEach((listener) => listener(this._state));
  }

  addListener(listener: GameStateListener) {
    this.listeners.push(listener);
    listener(this._state);
  }
}
```

<p class="figcaption">
{{ "The changes: (1) we make a read-only wrapper type; (2) we make the state private; (3) we make a getter that returns the state, but uses the read-only wrapper to annotate its returned type." | md | safe }}
</p>

Now, we can use the state directly, while preventing ourselves from writing to it directly, and allowing ourselves to update it using the proper, React-subscribed, Immer-powered method.

```ts
wrapper.state.s.foo; // access, OK
wrapper.state.s.foo = 5; // error
wrapper.updateState((s) => {
  s.foo = 5;
}); // update, OK
```

<p class="figcaption">
{{ "Who knew protecting yourself from yourself could be so satisfying?" | md | safe }}
</p>
