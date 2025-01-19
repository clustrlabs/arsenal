# arsenal

Multi-threaded, unopinionated, and task-agnostic AI agent framework.

## Features

- **Your data, your way:** Design the exact schema you want for all inputs and outputs. Define function templates and let AI models generate type-safe parameters that adhere to your function's input schema.

- **Customize everything:** Run agents in-memory or use adapters for data persistence, set configuration options like `max_tokens` and `temperature`, choose your Hugging Face model, and more.

- **Task-agnostic:** Build AI-enabled building blocks tailored to create powerful workflows for your specific use case, or import premade building blocks from a plugin.

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
