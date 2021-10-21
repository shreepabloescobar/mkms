const { userDocs } = require("./userDocs");
const { validateDocs } = require("./validateDocs");

const { paths: userPaths, definitions: userDefinitions } = userDocs;

const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        version: "3.0",
        title: "Byjus Mentor Konnect Server APIs",
        description: "Documentation of Byjus Mentor Konnect Server Api's",
    },
    servers: [
        {
            // url: "http://localhost:9016/nucleusapi/mkapp",
            url: "http://localhost:8888/nucleusapi/mkms/",
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
            name: "Chat Assignment",
            description: "API to help mentors for chat assignment",
        },

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
        ...userPaths
    },
    definitions: {
        ...userDefinitions
    },
};

module.exports = {
    swaggerDocument,
};
