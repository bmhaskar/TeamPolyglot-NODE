'use strict';

const express = require('express');
const routes = express.Router();
const url = require('url')

const reqTypeValidaton = require('../middlewares/validation/requestTypeValidation');
const jsDoc = require('./jsDoc');
const config = require('../config/config');
const allowCors = require('../middlewares/allowCors/allowCors');

routes.get('/api/doc-specs.json', reqTypeValidaton, allowCors, function (req, res) {
    res.type('json');
    res.send(jsDoc);
});

routes.get('/api/docs', function (req, res) {
    const urlString = url.format({hostname: config.host, port: config.port, pathname: '/api/doc-specs.json', protocol: 'http'});
    res.redirect('/public/api-docs/index.html?url=' + urlString);
})

module.exports = routes;