'use strict';


const sendResponse = require('../../utils/sendResponse');
const userRepo = require('../../repositories/user');


module.exports = function (req, res, next) {

    const username = req.params.username;

    userRepo.findByName(username).then(function (doc) {
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