const express = require('express');
var helmet = require('helmet');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const config = require('./config/environment');
const logger = require('./service/logger')('server')

const { port } = config;

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
    const client = await MongoClient.connect(config.db, { useUnifiedTopology: true });
    mongoose.leado = await mongoose.createConnection(config.db, mongooseOptions);
    mongoose.nucleus = await mongoose.createConnection(config.db, mongooseOptions);
    mongoose.friendlyPotato = await mongoose.createConnection(config.db, mongooseOptions);

    global.byjus = { nativeClient: client };

    const apiRoutes = require('./routes/routes');
    const app = express();

    app.use(helmet());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json({ limit: '10mb' }));

    app.use('/nucleusapi/mkms', apiRoutes(app));

    app.listen(port, err => {
        if (err) throw err;
        console.log('Server listen on port ', port);
    });

});