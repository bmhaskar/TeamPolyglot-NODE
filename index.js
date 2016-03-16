'use strict';

const express = require('express');
const mongoose = require('mongoose');

const config = require('./config/config');
const middleware = require('./middlewares/middleware');
const User = require('./models/user');

mongoose.connect(config.database.mongoose);

const app = express();

app.use(middleware);

const server = app.listen(config.port, config.host, function () {
    console.log('Book sharing application started at address: ' + server.address().address + ' port: ' + server.address().port);
});
const onError = function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

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
}
server.on('error', onError);

module.exports = server;
