'use strict';

const logger = require('./logger');

class elasticSearchLogger {
    constructor() {
        this.logger = logger.debugLogger;
    }

    error(msg, details) {
        this.logger.log('error', msg, details)
    }

    warning(msg, details) {
        this.logger.log('warning', msg, details);
    }
    info(msg, details) {
        this.logger.log('info', msg, details);
    }

    debug(msg, details) {
        this.logger.log('debug', msg, details);
    }


    trace(method, requestUrl, body, responseBody, responseStatus) {
       this.logger.log('trace','Trace '+ requestUrl, {
        method: method,
        requestUrl: requestUrl,
        body: body,
        responseBody: responseBody,
        responseStatus: responseStatus
        });
    };
    close() {

    }
}
//@todo: Refactor it as a separate component

module.exports = elasticSearchLogger;
