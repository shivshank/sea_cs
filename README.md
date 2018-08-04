# The SeaCS Entity Component System (js)

The Silly Entity "a" Component System (the a's just there to sound good, okay! jeez).
Doesn't do anything special but is designed to offer a dumb simple API to illustrate the
concept of ECS.

Usage:

```js
let ecs = new SeaCs()

ecs.add_entity({
    "Pos": { x: 15, y: 15 },
    "Vel": { x: 0, y: 5 },
    "Health": 10,
})

ecs.add_entity({
    "Pos": { x: 0, y: 0 },
    "Vel": { x: 5, y: 0 },
})

ecs.add_entity({
    "Pos": { x: 15, y: 15 },
    "Text": "Hey guys!",
    "Health": 15,
})

ecs.join(
    ["Pos", "Vel"],
    (e) => {
        e.Pos.x += e.Vel.x
        e.Pos.y += e.Vel.y
    }
)

ecs.join(
    ["Health"],
    (e) => {
        e.Health -= 2
    }
)
```

Doesnt:
- Support delete (easy enough to add)
- Support random access (although you can just store your own refs to entities)
- Do anything fancy that will actually help your performance in any way

