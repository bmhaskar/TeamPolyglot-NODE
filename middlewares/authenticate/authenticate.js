'use strict';

const sendResponse = require('../../utils/sendResponse');
const bearerAuthenticationStrategy = require('../../authenticationStrategies/bearerStrategy');

const authenticate = function (req, res, next) {

    bearerAuthenticationStrategy.authenticate('bearer', function (err, user, info) {
        if (err) {
            sendResponse(res, {message: 'Internal server error', status: false}, 500);
        }
        if (!user) {
            let newInfo = {};
            if(info) {
                if (info.message) {
                    sendResponse(res, {message: info.message, status: false}, info.statusCode);
                } else {

                    newInfo = info.split(',').reduce(function (prev, current, index) {
                        if(current.indexOf('=') != -1) {
                            current = current.split('=').map((val) => val.trim().replace(/^"/, "").replace(/"$/, ''));
                            prev[current[0]] = current[1];
                        }
                        return prev;
                    },{});
                    if(newInfo.error_description) {
                        sendResponse(res, {
                            message: newInfo.error_description ,
                            status: false
                        }, 401);
                    } else {
                        sendResponse(res, {
                            message: 'Forbidden: access is denied.  Authorization header value is missing' ,
                            status: false
                        }, 400);
                    }
                }
            } else {
                sendResponse(res, {
                    message: newInfo.error_description || 'Forbidden: access is denied. Authorization header value is incorrect.',
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