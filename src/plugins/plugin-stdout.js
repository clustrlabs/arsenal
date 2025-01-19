const { Skill } = require("../main");

function createSchema(properties) {
    return {
        type: "object",
        properties: properties,
        required: Object.keys(properties),
        additionalProperties: false
    };
}

const console_log = new Skill({
    name: "console_log",
    task: "Log text to the console",
    schema: createSchema({
        text: {
            type: "string",
            description: "The text to log"
        }
    })
}, async ({ text }) => {
    console.log(text);
    return null;
});

module.exports = {
    console_log
};
