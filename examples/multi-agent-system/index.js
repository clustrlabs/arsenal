const { Swarm, Skill } = require("../../src/main");

async function main() {
    const { Agent } = new Swarm();

    const agent = new Agent();

    const clonedAgent = await agent.clone();

    const console_log = new Skill({
        name: "console_log",
        task: "Log text to the console",
        schema: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "The text to log"
                },
                agentId: {
                    type: "string",
                    description: "The UUID of the agent"
                }
            },
            required: ["text"],
            additionalProperties: false
        },
    }, async ({ text, agentId }) => {
        console.log("\n" + agentId, ":", text + "\n");
        return null;
    });

    clonedAgent.do("Create a description of yourself, a helpful AI agent. Then log it to the console. Your agent ID is: " + clonedAgent.id, [
        console_log
    ]);

    await agent.do("Create a description of yourself, a helpful AI agent. Then log it to the console. Your agent ID is: " + agent.id, [
        console_log
    ]);

    return;
}

main().catch(console.error);
