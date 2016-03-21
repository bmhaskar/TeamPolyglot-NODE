'use strict';
const path = require('path');

const config = {
    port: 3333,
    database: {
        mongoose: 'mongodb://localhost/test/booksharing'
    },
    logDir: path.resolve(__dirname, '..', 'logs', 'test')
};

module.exports = config;

