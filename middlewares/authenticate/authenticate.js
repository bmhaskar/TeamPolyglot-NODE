'use strict';

const sendResponse = require('../../utils/sendResponse');
const passport = require('../passport/bearerStrategy');

const authenticate = function (req, res, next) {
    
    const token = req.headers.authorization;
    if(!token) {
        sendResponse(res, {message: 'Forbidden: access is denied. Token is missing.', status: false}, 401);
    } else {
        passport.authenticate('bearer', function (err, user, info) {
            if (err) {
                sendResponse(res, {message: 'Internal server error', status: false}, 500);
            }
            if (!user) {
                sendResponse(res, {message: info.message, status: false}, info.statusCode);
            } else {

                req.bookSharing = req.bookSharing || {};
                req.bookSharing.currentAuthenticatedUser = user;
                next();
            }
        })(req, res, next);
    }
};


module.exports = authenticate;