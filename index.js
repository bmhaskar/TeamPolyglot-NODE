'use strict';

const express = require('express');
var Promise = require("bluebird");

const config = require('./config/config');
const middleware = require('./middlewares/middleware');
const databaseUtil = require('./utils/database');
const indexerUtil = require('./utils/indexer');
const databaseSetup = require('./utils/databaseSetup');
const logger = require('./logger/debugLogger');

const app = express();
let server = {};
app.use(middleware);

const onServerError = function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const port = config.port;
    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.log('error', bind + ' requires elevated privileges', error);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.log('error', bind + ' is already in use', error);
            process.exit(1);
            break;
        default:
            throw error;
    }
};


const start = function () {
    return databaseUtil.connectDatabase()
        .then(databaseSetup)
        .then(indexerUtil.init)
        .then(function () {
            server = app.listen(config.port, config.host, function () {
                console.log('Book sharing application started at address: ' + server.address().address + ' port: ' + server.address().port);
            });
            return server.on('error', onServerError);
        }).catch(function (err) {
            logger.log('error', 'Could not start server', err);
        })
};

if(config.env != 'test') {
    start();
}

module.exports = {
    start: start
};
