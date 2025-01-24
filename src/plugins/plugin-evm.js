const { Skill, Plugin } = require("../main");
const ethers = require("ethers");

function createSchema(properties) {
    return {
        type: "object",
        properties: properties,
        required: Object.keys(properties),
        additionalProperties: false
    };
}

const create_wallet = new Skill({
    name: "create_wallet",
    task: "Create one or more Etheruem wallets",
    schema: createSchema({
        amount: {
            type: "integer",
            description: "The number of wallets to generate"
        }
    })
}, async ({ amount }) => {
    const wallets = [];

    for (let i = 0; i < amount; i++) {
        const wallet = ethers.Wallet.createRandom();
        wallets.push({ address: wallet.address, privateKey: wallet.privateKey });
        if (i === amount - 1) {
            console.log(wallets);
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

const get_native_balance = new Skill({
    name: "get_native_balance",
    task: "Get the native balance an EVM wallet",
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
            console.log(wallets);
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

module.exports = {
    create_wallet
};
