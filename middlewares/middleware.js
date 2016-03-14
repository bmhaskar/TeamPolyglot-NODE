'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const config = require('../config/config');
const documentation = require('../documentation/documentation');
const logger = require('../logger/logger');
const routes = require('../routes/routes');
const responseTypeToJson = require('./responseTypeJson/responseTypeJson');
const reqTypeValidaton = require('./validation/requestTypeValidation');


const middleware = express();

middleware.use(bodyParser.json());
middleware.use(bodyParser.urlencoded({extended: true}));
middleware.use(logger.genericLogger);
middleware.use(documentation);


middleware.use('/api',reqTypeValidaton, responseTypeToJson, routes);
middleware.use('/public', express.static(config.publicDir));

middleware.use(function(req, res) {
    res.status(404).send({'message': 'Sorry, we cannot find that!', status: false});
});
middleware.use(logger.errorLogger);
middleware.use(function(err, req, res, next) {
    res.status(500).send({'message': 'Internal server error.', status: false});
});

module.exports = middleware;