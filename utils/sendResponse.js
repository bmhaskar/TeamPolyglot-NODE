'use strict';

module.exports = function(res, msg, statusCode) {
    if(statusCode) {
        res.status(statusCode);
    }
    return res.send(msg).end();
}