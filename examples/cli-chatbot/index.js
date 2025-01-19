const { Swarm, Skill } = require("../../src/main");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on("close", function() {
    console.log("\nGoodbye!");
    process.exit(0);
});

async function main() {
    const { Agent } = new Swarm();

    const agent = new Agent();

    const chat = new Skill({
        name: "chatbot",
        task: "Respond as a generic chatbot to messages from users",
        schema: {
            type: "object",
            properties: {
                response: {
                    type: "string",
                    description: "Your response to the user"
                }
            }
        },
    }, ({ response }) => {
        return response;
    }, {
        type: "string"
    });

    function promptUser(question) {
        rl.question("\n" + question + "\n>", async function(prompt) {
            const { error, data } = await agent.do(prompt, [chat]);
            if (!error) {
                promptUser(data);
            } else {
                console.error(error);
            }
        });
    }

    promptUser("How can I help you today?");
}

main().catch(console.error);
