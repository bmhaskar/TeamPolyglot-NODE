'use strict';
const path = require('path');

const config = {
    database: {
        mongoose: 'mongodb://localhost/dev/booksharing'
    },
    logDir: path.resolve(__dirname, '..', 'logs', 'dev')
};

module.exports = config;

