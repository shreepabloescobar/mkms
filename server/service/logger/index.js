const bunyan = require('bunyan');

const logger = loggerName => {
    const name = loggerName || 'default logger';

    return bunyan.createLogger({
        name,
        env: process.env.NODE_ENV,
        serializers: bunyan.stdSerializers,
        src: true,
    });
};

module.exports = logger;
