'use strict';
const path = require('path');

const config = {
    database: {
        mongoose: 'mongodb://localhost/test/booksharing'
    },
    logDir: path.resolve(__dirname, '..', 'logs', 'test')
};

module.exports = config;

