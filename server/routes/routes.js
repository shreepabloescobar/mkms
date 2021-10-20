const express = require("express");
const swaggerUi = require("swagger-ui-express");

const { swaggerDocument } = require("../swagger/docs");
const { authenticate } = require("../middlewares/auth");
const userRoutes = require("./user");
const validationRoutes = require("./validate");

const apiRouter = express.Router();

module.exports = (app) =>
    apiRouter
        .get("/healthcheck", (req, res) => {
            res.send("Byjus Mentor Konnect Server is up and running");
        })
        // .use(authenticate)
        .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
        .use("/user", userRoutes())
        .use("/validate", validationRoutes())