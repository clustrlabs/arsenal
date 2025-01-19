const { Skill } = require("../main");
const fs = require("fs").promises;
const path = require("path");

function createSchema(properties) {
    return {
        type: "object",
        properties: properties,
        required: Object.keys(properties),
        additionalProperties: false
    };
}

const create_file = new Skill({
    name: "create_file",
    task: "Create a file in the current directory",
    schema: createSchema({
        fileName: {
            type: "string",
            description: "The name of the file"
        },
        fileContent: {
            type: "string",
            description: "The contents of the file"
        }
    })
}, async ({ fileName, fileContent }) => {
    const filePath = path.join(process.cwd(), fileName);
    await fs.writeFile(filePath, new Uint8Array(Buffer.from(fileContent)));
    return filePath;
}, {
    name: "filePath",
    type: "string"
});

const create_directory = new Skill({
    name: "create_directory",
    task: "Create a new directory",
    schema: createSchema({
        directoryName: {
            type: "string",
            description: "The name of the new directory"
        }
    })
}, async ({ directoryName }) => {
    const directoryPath = path.join(process.cwd(), directoryName);
    await fs.mkdir(directoryName);
    return directoryPath;
}, {
    name: "directoryPath",
    type: "string"
});

const read_file = new Skill({
    name: "create_file",
    task: "Read a file at a given path",
    schema: createSchema({
        filePath: {
            type: "string",
            description: "The path of the file"
        }
    })
}, async ({ filePath }) => {
    const fileContent = await fs.readFile(filePath, {
        encoding: 'utf8',
        flag: 'r'
    });
    return fileContent;
}, {
    name: "fileContent",
    type: "string"
});

const read_directory = new Skill({
    name: "create_file",
    task: "List the items in a given directory",
    schema: createSchema({
        directoryPath: {
            type: "string",
            description: "The path of the directory"
        },
    })
}, async ({ directoryPath }) => {
    const directoryItems = await fs.readdir(directoryPath);
    return directoryItems;
}, {
    name: "directoryItems",
    type: "array"
});

const get_file_stats = new Skill({
    name: "get_file_stats",
    task: "Get the stats of a file at a given path",
    schema: createSchema({
        filePath: {
            type: "string",
            description: "The path of the file"
        }
    })
}, async ({ filePath }) => {
    const fileStats = await fs.stat(filePath);
    return fileStats;
}, {
    name: "fileStats",
    type: "object"
});

module.exports = {
    create_file,
    create_directory,
    read_file,
    read_directory,
    get_file_stats
};
