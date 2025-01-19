# CLI Chatbot

This CLI chatbot example emulates a ChatGPT-like experience in the terminal.

Our chatbot agent prompts the user to ask a question, then responds to the user with a reply and another prompt in case they would like to continue the conversation.

For simplicity, the `Swarm` in this example doesn't use any database adapters for ensuring persistence, so conversation history with the user is stored in-memory and wiped once the process is terminated.

## cli-chatbot.js

```js
const { Swarm, Skill } = require("@clustr/arsenal");
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
```
