'use strict';

const setResponseTypeToJson = function(req, res, next) {
    res.type('json');
    next();
}

module.exports = setResponseTypeToJson