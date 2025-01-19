const { Swarm, Skill } = require("../../src/main");

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
