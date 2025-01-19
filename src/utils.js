const Ajv = require('ajv');
const { textModels } = require('./constants/models');
const os = require('os');
const v8 = require('v8');

const ajv = new Ajv();

async function parseRequestConfig(config) {
    const schema = {
        type: "object",
        properties: {
            model: {type: "string"},
            system: {type: "string"},
            max_tokens: {type: "integer"},
            temperature: {type: "number"},
            top_p: {type: "number"},
            top_k: {type: "number"},
            // tool_choice: {
            //     type: "object",
            //     properties: {
            //         type: {type: "string"},
            //         disable_parallel_tool_use: {type: "boolean"}
            //     },
            //     required: ["type"],
            //     additionalProperties: false
            // }
        },
        required: ["model", "system", "max_tokens", "temperature", "top_p", "top_k"],
        additionalProperties: false
    };

    const validate = ajv.compile(schema);

    const valid = validate(config);

    if (!valid) {
        // console.error(validate.errors);
        throw new Error();
    } else {
        const { model, max_tokens, temperature, top_p, top_k } = config;

        if (typeof textModels.get(model) === "undefined") {
            throw new Error();
        }

        if (max_tokens <= 0) {
            throw new Error();
        }

        if (temperature < 0 || temperature > 1) {
            throw new Error();
        }

        if (top_k < 0) {
            throw new Error();
        }

        if (top_p < 0) {
            throw new Error();
        }

        return config;
    }
}

async function buildTools(functions) {
    let result = [];
    const functionsLen = functions.length;
    if (functionsLen > 0) {
        for (let i = 0; i < functionsLen; i++) {
            const { name, task, schema } = functions[i];
            result.push({
                name: name,
                description: task,
                input_schema: schema
            });
            if (i == functionsLen - 1) {
                return result;
            }
        }
    } else {
        return result;
    }
}

function countThreads() {
    return {
        total: os.cpus().length,
        avail: os.availableParallelism()
    };
}

function checkMemory() {
    return {
        total: os.totalmem(),
        alloc: v8.getHeapStatistics().heap_size_limit,
        avail: os.freemem()
    }
}

module.exports = {
    parseRequestConfig,
    buildTools
};
