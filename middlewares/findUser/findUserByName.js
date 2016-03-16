'use strict';

const User = require('../../models/user');
const sendResponse = require('../../utils/sendResponse');

module.exports = function(req, res, next) {
    const username  = req.params.username;
    User.findOne({username: username},function(err, doc) {
        if (err) {
            sendResponse(res, {messgae: 'Could not fetch error', status: false, error: err}, 500);
        } else if (!doc) {
            sendResponse(res, {messgae: 'Could not find user with name: ' + username, status: false}, 404);
        } else {

            req.bookSharing = req.bookSharing || {};
            req.bookSharing.user = doc;
            next();
        }
    });
}