'use strict';

const logger = require('./debugLogger');
const config = require('../config/config');

const elasticSearchLogger = function() {
    var log = logger;
    this.error = log.error.bind(log);
    this.warning = log.warn.bind(log);
    this.info = log.info.bind(log);
    this.debug = log.debug.bind(log);
    this.trace = function (method, req, body, res, status) {
        var parts = req.path.split('/');
        var meta = {
            host : req.protocol + '//' + req.hostname + ':' + req.port,
            index : config.elasticSearchMapping.index,
            type :  parts[2] || '',
            response : status,
            queryString : parts[parts.length-1],
            queryBody : body || ''
        };
        if(status !== 200) {
            meta.responseBody = res;
            log.trace('[ELASTICSEARCH] ' + method + ' @ ', meta);
        }
    };
    this.close = function () {  };
};

module.exports = elasticSearchLogger;
