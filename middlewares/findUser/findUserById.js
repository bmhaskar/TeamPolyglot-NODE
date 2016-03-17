'use strict';

const User = require('../../models/user');
const sendResponse = require('../../utils/sendResponse');

const findByIdService = function(userId) {
    return User.findById(userId,'-password').exec();
}

module.exports = function(req, res, next) {
    const userId  = req.params.id;
    if(!userId) {
        sendResponse(res, {messgae: 'Invalid id.', status: false}, 400);
    }

    findByIdService(userId).then(function(doc){
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

