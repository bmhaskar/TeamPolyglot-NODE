'use strict';

const express = require('express');


const config = require('./config/config');
const middleware = require('./middlewares/middleware');
const databaseUtils = require('./utils/database');

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
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};


const start = function () {
    return databaseUtils.connectDatabase().then(function () {
        server = app.listen(config.port, config.host, function () {
            console.log('Book sharing application started at address: ' + server.address().address + ' port: ' + server.address().port);
        });
        return server.on('error', onServerError);
    });
};

if(config.env != 'test') {
    start();
}

module.exports = {
    start: start
};
