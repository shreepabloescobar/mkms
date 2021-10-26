const express = require("express");
const swaggerUi = require("swagger-ui-express");

const { swaggerDocument } = require("../swagger/docs");
const { authenticate } = require("../middlewares/auth");
const userRoutes = require("./user");
const subBatchRoutes = require("./subBatch")
const validationRoutes = require("./validate");
const countryCodesListRoutes = require("./countryCodesList")
const {
    apiProxyMiddleware,
    moderationMiddleWare
} = require("../middlewares/moderation");

const apiRouter = express.Router();

module.exports = (app) =>
    apiRouter
        .get("/healthcheck", (req, res) => {
            res.send("Byjus Mentor Konnect Server is up and running");
        })
        // .use(authenticate)
        .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
        .use("/user", userRoutes())
        .use("/sub-batch", subBatchRoutes())
        .use("/validate", validationRoutes())
        .use("/getCountryCodesList",countryCodesListRoutes())
        .use("/",moderationMiddleWare, apiProxyMiddleware)