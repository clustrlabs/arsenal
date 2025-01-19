# Wallet Generator

Let's do something a bit more advanced and provide our agent with a `Skill` called `create_wallet`, which generates an object array of addresses and private keys.

The amount of wallets generated is variable and inferred from the user's prompt.

In the prompt passed to `agent.do`, the user requests 100 wallets to be generated. This results in the model opting to run `create_wallet` with `{amount: 100}` as the parameter.

## wallet-generator.js

```js
const { Swarm, Skill } = require("@clustr/arsenal");
const ethers = require("ethers");

async function main() {
    const { Agent } = new Swarm();

    const agent = new Agent();

    const create_wallet = new Skill({
        name: "create_wallet",
        task: "Create one or more Etheruem wallets",
        schema: {
            type: "object",
            properties: {
                amount: {
                    type: "integer",
                    description: "The number of wallets to generate"
                }
            }
        },
    }, async ({ amount }) => {
        const wallets = [];

        for (let i = 0; i < amount; i++) {
            const wallet = ethers.Wallet.createRandom();
            wallets.push({ address: wallet.address, privateKey: wallet.privateKey });
            if (i === amount - 1) {
                return wallets;
            }
        }
    }, {
        type: "array",
        items: {
            type: "object",
            properties: {
                address: {type: "string"},
                privateKey: {type: "string"}
            },
            required: ["address", "privateKey"],
            additionalProperties: false
        }
    });

    const { error, data } = await agent.do("Generate 100 Etheruem wallets", [
        create_wallet
    ])

    if (error) {
        console.log("error:");
        console.log(error);
    } else {
        const wallets = data;

        console.log("wallets:");
        console.log(wallets);
    }

    return;
}

main().catch(console.error);
```
