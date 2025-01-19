const { Swarm, Skill } = require("../../src/main");
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
    ]);

    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }

    return;
}

main().catch(console.error);
