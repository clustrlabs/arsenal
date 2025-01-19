# arsenal

<div align="center">
    <img src="https://clustr.network/assets/app-arsenal.png" alt="Arsenal Logo" width="128"/>
</div>

Multi-threaded, unopinionated, and task-agnostic AI agent framework.

Build your own AI to accomplish any task you can dream of faster and easier than ever.

- Create advanced AI-enabled workflows from modular building blocks tailored to your specific use case.
- Scaffold powerful swarms and agents rapidly thanks to an intuitive API built from first principles.
- Design the exact schema you want for all inputs and outputs.

## Installation

With NPM:

```bash
npm i @clustr/arsenal
```

With Yarn:

```bash
yarn add @clustr/arsenal
```

With Bun:

```bash
bun install @clustr/arsenal
```

## Usage

```javascript
const { Swarm, Skill } = require("@clustr/arsenal");

const { Agent } = new Swarm();

const agent = new Agent();

const console_log = new Skill({
    name: "console_log",
    task: "Log text to the console",
    schema: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "The text to log"
            }
        },
        required: ["text"],
        additionalProperties: false
    },
}, async ({ text }) => {
    console.log(text);
    return null;
});

await agent.do("Create a description of yourself, a helpful AI agent. Then log it to the console", [
    console_log
]);
```

## License

MIT
