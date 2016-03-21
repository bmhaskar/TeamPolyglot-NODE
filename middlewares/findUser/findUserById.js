'use strict';

const sendResponse = require('../../utils/sendResponse');

const userRepo = require('../../repositories/user');

module.exports = function(req, res, next) {
    const userId  = req.params.id;
    if(!userId) {
        sendResponse(res, {messgae: 'Invalid id.', status: false}, 400);
    }

    userRepo.findById(userId).then(function(doc){
        if(!doc) {
            sendResponse(res, {messgae: 'Could not find user with id: ' + userId, status: false}, 404);
        }
        req.bookSharing = req.bookSharing || {};
        req.bookSharing.user = doc;

        next();
    },function(err){
        sendResponse(res, {messgae: 'Could not fetch error', status: false, error: err}, 500);
    });

}

