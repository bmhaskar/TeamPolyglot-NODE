'use strict';

const sendResponse = require('../../utils/sendResponse');
const bearerAuthenticationStrategy = require('../../authenticationStrategies/bearerStrategy');

const sendResponseIfInternalError = function (err, res) {
    if (err) {
        return sendResponse(res, {message: 'Internal server error', status: false}, 500);
    }
};
const parseAuthInfo = function (info) {
    return info.split(',').reduce(function (prev, current, index) {
        if (current.indexOf('=') != -1) {
            current = current.split('=').map((val) => val.trim().replace(/^"/, "").replace(/"$/, ''));
            prev[current[0]] = current[1];
        }
        return prev;
    }, {});
};

const sendResponseIfHeaderValueIsMissing = function (user, info, res) {
    if (!user && info && !info.message) {

        const newInfo = parseAuthInfo(info);

        if (!newInfo.error_description) {
            return sendResponse(res, {
                message: 'Forbidden: access is denied.  Authorization header value is missing',
                status: false
            }, 400);
        }
    }
};

const sendResponseIfIncorrectHeaderValue = function (user, info, res) {
    if (!user && !info) {
        return sendResponse(res, {
            message: 'Forbidden: access is denied. Authorization header value is incorrect.',
            status: false
        }, 401);
    }
};

const sendResponseIfTokenIsBlacklisted = function (user, info, res) {
    if (!user && info && !info.message) {
        const newInfo = parseAuthInfo(info);
        if (newInfo.error_description) {
            return sendResponse(res, {
                message: newInfo.error_description,
                status: false
            }, 401);
        }
    }
};

const sendResponseIfTokenRelatedError = function (user, info, res) {
    if (!user && info && info.messages) {
        return sendResponse(res, {message: info.message, status: false}, info.statusCode);
    }
};

const authenticate = function (req, res, next) {

    bearerAuthenticationStrategy.authenticate('bearer', function (err, user, info) {

        sendResponseIfInternalError(err, res);

        sendResponseIfHeaderValueIsMissing(user, info, res);

        sendResponseIfIncorrectHeaderValue(user, info, res);

        sendResponseIfTokenIsBlacklisted(user, info, res);

        sendResponseIfTokenRelatedError(user, info, res);

        req.bookSharing = req.bookSharing || {};
        req.bookSharing.authenticatedUserToken = info.token;
        req.bookSharing.currentAuthenticatedUser = user;
        next();

    })(req, res, next);

};


module.exports = authenticate;