const { Swarm, Skill } = require("../../src/main");
const http = require("http");

async function main() {
    const { Agent } = new Swarm();

    const agent = new Agent();

    const start_server = new Skill({
        name: "start_server",
        task: "Start an HTTP server",
        schema: {
            type: "object",
            properties: {
                port: {
                    type: "integer",
                    description: "The port to run the server at"
                }
            },
            required: ["port"],
            additionalProperties: false
        },
    }, async ({ port }) => {
        const server = http.createServer((req, res) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                data: "Hello World!",
            }));
        });
        server.listen(port, () => {
            console.log("Server is running at http://localhost:" + port);
        });
        return port;
    });

    const httpPlugin = {
        start_server
    };

    await agent.use(httpPlugin);

    await agent.do("Start an http server on port 1234");

    return;
}

main().catch(console.error);
