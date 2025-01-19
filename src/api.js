const { config } = require("dotenv");
const { Axios } = require("axios");
const { NetworkError, InvalidResponse } = require("./errors");
const { parseRequestConfig } = require("./utils");

config();

const { API_URL, API_KEY } = process.env;

const axios = new Axios({
    baseURL: API_URL,
    headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type":  `application/json`
    }
});

async function extractFunction(prompt, tools, logger, messages, config = {
    model: "claude-3-5-sonnet-latest",
    system: "",
    max_tokens: 8192,
    temperature: 0.5,
    top_p: 0.9,
    top_k: 40
}) {
    const { model, system, max_tokens, temperature, top_p, top_k } = await parseRequestConfig(config);
    logger.debug({
        promptType: "function",
        prompt: prompt,
        tools: tools,
    });
    let response;
    try {
        response = await axios.post("/messages", JSON.stringify({
                model: model,
                system: system,
                tools: tools,
                messages: messages,
                max_tokens: max_tokens,
                temperature: temperature,
                top_p: top_p,
                top_k: top_k,
                stream: false,
                tool_choice: {
                    type: "any",
                    disable_parallel_tool_use: false
                }
            }));
    } catch (error) {
        throw new NetworkError(error.message);
    }
    try {
        const data = JSON.parse(response.data);
        return data;
    } catch (error) {
        throw new InvalidResponse(error.message);
    }
}

module.exports = {
    extractFunction
};
