const pino = require('pino');

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        },
        sync: false
    },
});

module.exports = {
    logger
};
