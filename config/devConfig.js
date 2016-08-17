'use strict';
const path = require('path');
const bluebird = require('bluebird');

const config = {
    database: {
        mongoose: 'mongodb://localhost/dev/booksharing',
        options: { promiseLibrary: bluebird }
    },
    logDir: path.resolve(__dirname, '..', 'logs', 'dev')
};

module.exports = config;

