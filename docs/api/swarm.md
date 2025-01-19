# Swarm

A `Swarm` is a global workspace for one or more [Agent](api/agent.md).

The `Swarm` class is a top-level export from the Arsenal module.

This snippet instantiates a basic Swarm with the default configuration options:

```js
const { Swarm } = require("@clustr/arsenal");

const swarm = new Swarm();
```

## Constructor

Configuration options can be tweaked on a per-swarm basis, per-agent basis, per-skill basis, or even a per-action basis.

You can set the default configuration for every `Agent` and `Skill` within your swarm by passing a configuration `options` object to your `Swarm` constructor.

To create agents within your swarm, simply instantiate them using the `Agent` class embedded in the `{ Agent }` object returned by the constructor.

```js
// Default options:
const options = {
    model: "claude-3-5-sonnet",
    system: "",
    max_tokens: 4096,
    temperature: 0.5,
    top_p: 0.9,
    top_k: 40
};

const { Agent } = new Swarm(options);

// create agents using the "Agent" class returned by the Swarm constructor
```

### options.model

- Type: `string`
- Default: `"claude-3-5-sonnet"`

Sets the model.

**Example**

```js
const swarm = new Swarm({
    model: "claude-3-5-sonnet-latest"
});
```

### options.system

- Type: `string`
- Default: `""`

Defines a system prompt.

**Example**

```js
const swarm = new Swarm({
    system: "This is a top-level system prompt!"
});
```

### options.max_tokens

- Type: `integer`
- Default: `4096`

**Example**

```js
const swarm = new Swarm({
    max_tokens: 8192
});
```

### options.temperature

- Type: `number`
- Default: `0.5`

**Example**

```js
const swarm = new Swarm({
    temperature: 0.6
});
```

### options.top_p

- Type: `number`
- Default: `0.9`

**Example**

```js
const swarm = new Swarm({
    top_p: 0.8
});
```

### options.top_k

- Type: `number`
- Default: `40`

**Example**

```js
const swarm = new Swarm({
    top_k: 30
});
```

## Properties

### swarm.id

**Type**: `string`

Returns the UUID of the given agent:

```js
const uuid = swarm.id;
// e41ba5aa-b0a4-4cf5-b4de-bc01c942c92c
```
