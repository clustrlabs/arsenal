# Agent

An `Agent` is a self-contained AI agent descending from a [Swarm](api/swarm.md).

The `Agent` class is *not* a top-level export from the Arsenal module.

Creating a `Swarm` returns a descendant class which can be used to instantiate an `Agent` descending from the same Swarm. It's okay if your Swarm only contains one agent!

This snippet instantiates a basic Agent with the default configuration options:

```js
const { Swarm } = require("@clustr/arsenal");

// Remember to create a swarm first!
const { Agent } = new Swarm();

// This agent is a descendant of the swarm
const agent = new Agent();
```

## Constructor

Configuration options can be set for an `Agent`, just like how they can be set for a `Swarm` or a `Skill`.

You can set the default configuration for any `Agent` within your swarm by passing a configuration `options` object to your `Agent` constructor.

The constructor returns an instance of the `Agent` class.

```js
const { Agent } = new Swarm();

// Default options:
const options = {
    model: "claude-3-5-sonnet",
    system: "",
    max_tokens: 4096,
    temperature: 0.5,
    top_p: 0.9,
    top_k: 40
};

const agent = new Agent(options);
```

Configuration options are inherited based on scope.

To illustrate this, consider the following `Swarm` and the following `Agent`, which share an apparent conflict in their configuration options:

```js
const { Agent } = new Swarm({
    model: "claude-3-5-sonnet-latest",
    temperature: 0.8
});
// model: "claude-3-5-sonnet-latest"
// temperature: 0.8

const agent = new Agent({
    temperature: 0.4
});
// model: "claude-3-5-sonnet-latest"
// temperature: 0.4
```

Because the `Agent` is more nested than the `Swarm`, its configuration takes precedence over the configuration of its parent swarm.

Therefore, the `temperature: 0.8` option is overwritten by the `temperature: 0.4` option.

But since there is no conflict in the `model: "claude-3-5-sonnet-latest"` option, the `Agent` inherits it from the `Swarm` like normal.

## Properties

### agent.id

**Type**: `string`

Returns the UUID of the given agent:

```js
const uuid = agent.id;
// e41ba5aa-b0a4-4cf5-b4de-bc01c942c92c
```

### agent.messages

**Type**: `array`

Returns the in-memory messages of the given agent:

```js
const messages = agent.messages;
// []
```

## Methods

### agent.do(prompt, functions)

**Parameters:**

- `prompt` (required):
  - **Type**: `string`
  - **Description**: The prompt that you want your agent to extract intent from.
- `functions` (required):
  - **Type**: `Skill[]`
  - **Description**: An array of one or more skills which the agent can use to complete its task.

**Returns:**

- `object`
  - `error`: `null` | `Error`
  - `data`: `any`
  - `usage`:
    - `prompt_tokens`: `integer`
    - `completion_tokens`: `integer`
    - `total_tokens`: `integer`

This is where the real magic happens!

Every agent has a `do()` method, which can be used to execute predefined functions using type-safe parameters based on intent inferred from a prompt.

Here's an example, which assumes that a `Skill` called `console_log` is already defined:

```js
const { error, data, usage } = await agent.do("Say something and log it to the console", [
    console_log
]);

// Implement your own error handling
if (error) {
    throw new Error(error.message)
}

// Do something with the returned data...
console.log(data);

// You can record token usage stats if you want...
const { prompt_tokens, completion_tokens, total_tokens } = usage;
```

### agent.use(...functions)

```js
// TODO
```

### agent.clone(preserveHistory)

**Parameters:**

- `preserveHistory` (default: `false`)
  - **Type**: `boolean`
  - **Description**: A boolean dictating whether `agent.messages` should be wiped.

**Returns:**

- `Agent`

The `agent.clone()` method returns a copy of itself in the same swarm, but with a new UUID:

```js
// Suppose you have an Agent called "agent":

console.log(agent.id);

const clone = agent.clone()

console.log(clone.id);

// agent.id !== clone.id
```
