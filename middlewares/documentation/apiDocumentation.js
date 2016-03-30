'use strict';

const express = require('express');
const routes = express.Router();
const url = require('url');

const config = require('../../config/config');
const reqTypeValidaton = require('../validation/requestTypeValidation');
const allowCors = require('../allowCors/allowCors');
const swaggerJsDocConfigObject = require('./swaggerJsDocConfigObject');

routes.get('/api/doc-specs.json', reqTypeValidaton, allowCors, function (req, res) {
    res.type('json');
    res.send(swaggerJsDocConfigObject);
});

routes.get('/api/docs', function (req, res) {
    const urlString = url.format({hostname: config.host, port: config.port, pathname: '/api/doc-specs.json', protocol: 'http'});
    res.redirect('/public/api-docs/index.html?url=' + urlString);
})

module.exports = routes;