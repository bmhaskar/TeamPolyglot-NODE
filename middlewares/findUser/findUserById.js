'use strict';

const sendResponse = require('../../utils/sendResponse');

const userRepo = require('../../repositories/user');


module.exports = function (req, res, next) {
    const userId = req.params.userId;

    if (!userId) {
        return sendResponse(res, {message: 'Invalid id', status: false}, 400);
    }

    userRepo.findById(userId)
        .then(null, function (err) {
            sendResponse(res, {message: 'Internal server error Could not fetch user', status: false, error: err}, 500);
        })
        .then(function (foundUser) {
            if (!foundUser) {
                throw {message:'Could not find user with id: ' + userId, code:  404};
            }
            req.bookSharing = req.bookSharing || {};
            req.bookSharing.user = foundUser;
            next();

        }).then(null, function (err) {
            sendResponse(res, {message: err.message, status: false, error: err}, err.code);
        });
};




