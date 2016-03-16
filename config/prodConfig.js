'use strict';
const path = require('path');

const config = {
    database: {
        mongoose: 'mongodb://localhost/prod/booksharing'
    },
    logDir: path.resolve(__dirname, '..', 'logs', 'prod')
};

module.exports = config;
