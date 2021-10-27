const { userDocs } = require("./userDocs");
const { validateDocs } = require("./validateDocs");
const { subBatchDocs } = require("./subBatchDocs");  
const { paths: userPaths, definitions: userDefinitions } = userDocs;
const { paths: subBatchPaths, definitions: subBatchDefinitions} = subBatchDocs;

const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        version: "3.0",
        title: "Byjus Mentor Konnect Server APIs",
        description: "Documentation of Byjus Mentor Konnect Server Api's",
    },
    servers: [
        {
            url: "http://localhost:4000/nucleusapi/mkms",
            description: "local",
        },
        process.env.NODE_ENV == 'production' ?
            {
                url: "https://nucleus.byjusorders.com/nucleusapi/mkms",
                description: "Prod",
            } :
            {
                url: "https://dev-nucleus.byjusorders.com/nucleusapi/mkms",
                description: "Dev",
            },
    ],
    tags: [
        {
            name: "Users",
            description: "API to handle user login",
        },
        {
            name: "Moderators",
            description: "API to performan screening activities on students initiated chats",
        },
        {
            name: "Sub-Batch",
            description:"API for sub-batch creation , updation , retrival and deletion."
        }
    ],
    components: {
        securitySchemes: {
            clientid: {
                type: "apiKey",
                name: "clientid",
                in: "header",
            },
            clientsecret: {
                type: "apiKey",
                name: "clientsecret",
                in: "header",
            },
        },
    },
    security: [
        {
            clientid: [],
        },
        {
            clientsecret: [],
        },
    ],
    schemes: ["https", "http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    paths: {
        ...userPaths,
        ...subBatchPaths
    },
    definitions: {
        ...userDefinitions,
        ...subBatchDefinitions
    },
};

module.exports = {
    swaggerDocument,
};
