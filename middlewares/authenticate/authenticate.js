'use strict';

const sendResponse = require('../../utils/sendResponse');
const bearerAuthenticationStrategy = require('../../authenticationStrategies/bearerStrategy');

const authenticate = function (req, res, next) {

    bearerAuthenticationStrategy.authenticate('bearer', function (err, user, info) {
        if (err) {
            sendResponse(res, {message: 'Internal server error', status: false}, 500);
        }
        if (!user) {
            if (info && info.message) {
                sendResponse(res, {message: info.message, status: false}, info.statusCode);
            } else {
                const newInfo = info.split(',').reduce(function (prev, current, index) {
                        current = current.split('=').map((val) => val.trim().replace(/^"/,"").replace(/"$/,''));
                        prev[current[0]] = current[1];
                        return prev;
                    },{});
                sendResponse(res, {
                    message: newInfo.error_description || 'Forbidden: access is denied. Token is missing or incorrect token format.',
                    status: false
                }, 401);
            }
        } else {
            req.bookSharing = req.bookSharing || {};
            req.bookSharing.authenticatedUserToken = info.token;
            req.bookSharing.currentAuthenticatedUser = user;
            next();
        }
    })(req, res, next);

};


module.exports = authenticate;