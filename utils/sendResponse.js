'use strict';

module.exports = function(res, msg, statusCode) {
    if(statusCode) {
        res.status(statusCode);
    }
    res.send(msg);
}