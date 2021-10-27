const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

function makeNewConnection(uri) {
    const db = mongoose.createConnection(uri, {
        // useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    db.on('error', function (error) {
        console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
        db.close().catch(() => console.log(`MongoDB :: failed to close connection ${this.name}`));
    });

    db.on('connected', function () {
        mongoose.set('debug', function (col, method, query, doc) {
            console.log(`MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(query)},${JSON.stringify(doc)})`);
        });
        console.log(`MongoDB :: connected ${this.name}`);
    });

    db.on('disconnected', function () {
        console.log(`MongoDB :: disconnected ${this.name}`);
    });

    return db;
}

const wrapperConnection = makeNewConnection(process.env.MONGODB_LOCAL_URI);
const rocketChatConnection = makeNewConnection(process.env.MONGODB_NUCLEUS_URI);

module.exports = {
    wrapperConnection,
    rocketChatConnection,
};