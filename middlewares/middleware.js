'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const config = require('../config/config');
const apiDocumentation = require('./documentation/apiDocumentation');
const logger = require('./logger/logger');
const routes = require('../routes/routes');
const setResponseTypeToJson = require('./setResponseTypeJson/setResponseTypeJson');
const reqTypeValidaton = require('./validation/requestTypeValidation');

const addEventHandlers = require('../eventHandlers/eventHandlers');

addEventHandlers();

const middleware = express();

middleware.use(bodyParser.json());
middleware.use(bodyParser.urlencoded({extended: true}));
middleware.use(logger.genericLogger);
middleware.use(passport.initialize());
middleware.use(apiDocumentation);


middleware.use('/api',reqTypeValidaton, setResponseTypeToJson, routes);
middleware.use('/public', express.static(config.publicDir));

middleware.use(function(req, res) {
    res.status(404).send({'message': 'Sorry, we cannot find that!', status: false});
});
middleware.use(logger.errorLogger);
middleware.use(function(err, req, res, next) {
    console.log(err);
    res.status(500).send({'message': 'Internal server error.', status: false});
});

module.exports = middleware;