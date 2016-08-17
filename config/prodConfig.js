'use strict';
const path = require('path');
const bluebird = require('bluebird');
const config = {
    database: {
        mongoose: 'mongodb://localhost/prod/booksharing',
        options: { promiseLibrary: bluebird }
    },
    logDir: path.resolve(__dirname, '..', 'logs', 'prod')
};

module.exports = config;
