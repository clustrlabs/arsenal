const { extractFunction } = require("./api");
const { NetworkError, InvalidAction, InvalidSchema, InvalidCallback, EmptyResponse, ContentRefusal, InsufficientTokens, ExecutionError } = require("./errors");
const { buildTools } = require("./utils");
const { logger } = require("./logger");
const { randomUUID } = require("node:crypto");
const { Worker, isMainThread, workerData, parentPort } = require("worker_threads");
const { Volume } = require("memfs");
const Database = require("better-sqlite3");
const Ajv = require("ajv");

const ajv = new Ajv();

const defaultConfig = {
    model: "claude-3-5-sonnet-latest",
    system: "",
    max_tokens: 4096,
    temperature: 0.5,
    top_p: 0.9,
    top_k: 40
};

const configSchema = {
    type: "object",
    properties: {
        model: {type: "string"},
        system: {type: "string"},
        max_tokens: {type: "integer", exclusiveMinimum: 0},
        temperature: {type: "number", minimum: 0, maximum: 1},
        top_p: {type: "number", minimum: 0},
        top_k: {type: "number", minimum: 0}
    },
    required: ["model", "system", "max_tokens", "temperature", "top_p", "top_k"],
    additionalProperties: false
};

class Swarm {
    constructor(options = {}, config = defaultConfig) {
        const schema = {
            type: "object",
            properties: {
                workspace: {type: "string"}
            },
            required: [],
            additionalProperties: false
        };

        let validate = ajv.compile(schema);

        let valid = validate(options);

        if (!valid) {
            throw new InvalidSchema(validate.errors);
        }

        if (config !== defaultConfig) {
            if (typeof config !== "object") {
                throw new Error();
            }
            config = { ...defaultConfig, ...config };

            validate = ajv.compile(configSchema);

            valid = validate(config);

            if (!valid) {
                throw new InvalidSchema(validate.errors);
            }
        }

        const { workspace } = options;

        this.workspace = workspace;

        this.vol = new Volume();
        this.db = new Database(":memory:");

        this.db.exec("CREATE TABLE agents (id INTEGER PRIMARY KEY, uuid TEXT)");
        this.db.exec("CREATE TABLE messages (id INTEGER PRIMARY KEY, uuid TEXT)");

        const uuid = randomUUID();
        this.id = uuid;

        const swarmLogger = logger.child({ swarmId: this.id });
        this.logger = swarmLogger;
        this.logger.debug("Created swarm: " + this.id);

        this.config = config;
        const swarmConfig = config;

        class ChildAgent extends Agent {
            constructor(config) {
                super(config);

                if (config === defaultConfig) {
                    this.config = swarmConfig;
                }

                this.swarm = uuid;

                this.id = randomUUID();

                this.logger = swarmLogger.child({ agentId: this.id });
                this.logger.debug("Created agent: " + this.id);
            }
        }

        return { Agent: ChildAgent };
    }

    saveAsBuffer() {
        const buffer = this.db.serialize();
        this.vol.writeFileSync("/database.db", buffer);
    }

    restoreFromBuffer() {
        const savedBuffer = this.vol.readFileSync("/database.db");
        this.db = new Database(savedBuffer);
    }
}

class Agent {
    constructor(config = defaultConfig) {
        this.functions = [];
        this.state = "idle";

        this.queue = [];

        this.messages = [];

        if (config !== defaultConfig) {
            if (typeof config !== "object") {
                throw new Error();
            }
            config = { ...defaultConfig, ...config };

            const validate = ajv.compile(configSchema);

            const valid = validate(config);

            if (!valid) {
                throw new InvalidSchema(validate.errors);
            }

            this.config = config;
        }
    }

    async clone(preserveHistory = false) {
        const agentClone = new Agent(this.config);
        agentClone.id = randomUUID();
        agentClone.messages = preserveHistory === false? [] : this.messages;
        agentClone.state = "idle";
        agentClone.logger = this.logger.child({ agentId: this.id });
        agentClone.logger.debug("Created clone: " + this.id);
        return agentClone;
    }

    async use(oneOrMoreFunctions) {
        if (typeof oneOrMoreFunctions !== "object")  {
            throw new Error();
        }
        this.functions = this.functions.concat(oneOrMoreFunctions);
    }

    async do(prompt, functions) {
        this.state = "working";

        functions = this.functions.concat(functions);

        const tools = await buildTools(functions);
        this.messages.push({
            role: "user",
            content: prompt
        });
        const data = await extractFunction(prompt, tools, this.logger, this.messages, this.config);
        const { content, usage, stop_reason, model } = data;
        // console.log(data)

        if (content.length == 0) throw new EmptyResponse();

        let chunks = {
            texts: [],
            steps: []
        }

        for (let i = 0; i < content.length; i++) {
            const chunk = content[i];
            // console.log(chunk);
            this.messages.push({
                role: "assistant",
                content: JSON.stringify(chunk)
            });
            if (chunk.type === "text") {
                chunks.texts.push(chunk);
            } else if (chunk.type === "tool_use") {
                chunks.steps.push(chunk);
            }
            if (i === content.length - 1) {
                const { prompt_tokens, completion_tokens, total_tokens } = usage;

                let json = content;
                try { json = JSON.parse(content); } catch (e) {}

                let result = null;

                if (chunks.steps.length > 0) {
                    for (let j = 0; j < chunks.steps.length; j++) {
                        const step = chunks.steps[j];
                        const func = functions.indexOf(functions.find((e) => e.name === step.name));// todo: enforce unique names across imports
                        try {
                            result = await functions[func].func(step.input);
                        } catch (error) {
                            return {
                                error: error,
                                data: null,
                                usage: {
                                    prompt_tokens: prompt_tokens,
                                    completion_tokens: completion_tokens,
                                    total_tokens: total_tokens
                                }
                            }
                        }
                        // this.logger.debug("Processed function: " + chunk.name);
                        // console.log(this.messages)
                        if (j === chunks.steps.length - 1) {
                            this.state = "idle";

                            // return { result, chunks };
                            return {
                                error: null,
                                data: result
                            };
                        }
                    }
                } else {
                    // return { result, chunks };
                    return {
                        error: null,
                        data: null
                    };
                }
            }
        }
    }
}

class Skill {
    constructor(config, func, responseSchema = {type: "any"}) {
        const schema = {
            type: "object",
            properties: {
                name: {type: "string"},
                task: {type: "string"},
                schema: {type: "object"},
                responseSchema: {type: "object"}
            },
            required: ["name", "task", "schema"],
            additionalProperties: false
        };

        const validate = ajv.compile(schema);

        const valid = validate(config);

        if (!valid) {
            throw new InvalidSchema(validate.errors);
        } else {
            if (typeof func !== "function") {
                throw new InvalidCallback();
            } else {
                const { name, task, schema } = config;

                // const responseSchema = typeof config.responseSchema === "undefined" ? {type: "string"} : config.responseSchema;

                this.name = name;
                this.task = task;
                this.schema = schema;
                this.responseSchema = responseSchema;

                this.func = func;
            }
        }
    }
}

module.exports = {
    Swarm,
    Skill
};
