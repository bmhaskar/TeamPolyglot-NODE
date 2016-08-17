'use strict';
const path = require('path');
const elasticSearchMapping = require('./elasticSearchMapping');
const bluebird = require('bluebird');
const config = {
    port: 3333,
    database: {
        mongoose: 'mongodb://localhost/test/booksharing',
        options: { promiseLibrary: bluebird }
    },
    logDir: path.resolve(__dirname, '..', 'logs', 'test'),
    elasticSearchMapping: Object.assign(elasticSearchMapping, {
        index: 'booksharing-test'
    })
};

module.exports = config;

