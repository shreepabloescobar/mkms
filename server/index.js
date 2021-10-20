const express = require('express');
var helmet = require('helmet');
const mongoose = require('mongoose');

const config = require('./config/environment');
const logger = require('./service/logger')('server')

const { port } = config;

const {
    apiProxyMiddleware,
    moderationMiddleWare
} = require("./middlewares/moderation");


process.on('unhandledRejection', err => console.log(err));
mongoose.Promise = global.Promise;
const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
};

mongoose.connect(config.db, mongooseOptions);
const db = mongoose.connection;

db.on('error', err => {
    logger.error('Mongoose error', err);
});

db.once('open', async () => {
    console.log('Connected To', config.db);

    const apiRoutes = require('./routes/routes');
    const app = express();

    app.use(helmet());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json({ limit: '10mb' }));

    app.use('/nucleusapi/mkms', apiRoutes(app));

    // app.use("/api/v1", moderationMiddleWare, apiProxyMiddleware);

    app.listen(port, err => {
        if (err) throw err;
        console.log('Server listen on port ', port);
    });

});