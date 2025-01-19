# Hello World

Let's start by creating a simple `Skill` called `console_log`, which teaches our agent to log text to the terminal.

This basic example demonstrates how Arsenal takes a prompt and:

1. Extracts intent from natural language.

2. Chooses one or more available `Skill` relevant to the intent of the prompt.

3. Generates type-safe parameters according to the input schema of the skill.

4. Executes the skill with the parameters chosen by the AI.

## hello-world.js

```js
const { Swarm, Skill } = require("@clustr/arsenal");

async function main() {
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

    return;
}

main().catch(console.error);
```
