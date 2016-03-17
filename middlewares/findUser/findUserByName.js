'use strict';

const User = require('../../models/user');
const sendResponse = require('../../utils/sendResponse');

const findByNameService = function (username) {
    return User.findOne({username: username}).exec();
}

module.exports = function (req, res, next) {
    const username = req.params.username;
    findByNameService(username).then(function (doc) {
        if (!doc) {
            sendResponse(res, {messgae: 'Could not find user with name: ' + username, status: false}, 404);
        } else {

            req.bookSharing = req.bookSharing || {};
            req.bookSharing.user = doc;
            next();
        }
    }, function (err) {
        sendResponse(res, {messgae: 'Could not fetch error', status: false, error: err}, 500);
    });
};