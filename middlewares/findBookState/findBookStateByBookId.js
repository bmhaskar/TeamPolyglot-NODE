'use strict';
const sendResponse = require('../../utils/sendResponse');

const bookStateRepo = require('../../repositories/bookState');

module.exports = function(req, res, next) {
    const bookId  = req.params.bookId;
    if(!bookId) {
        sendResponse(res, {messgae: 'Invalid id.', status: false}, 400);
    }

    bookStateRepo.findByBookId(bookId).then(function(doc){
        if(!doc) {
            sendResponse(res, {messgae: 'Could not find book status with book id: ' + bookId, status: false}, 404);
        }
        req.bookSharing = req.bookSharing || {};
        req.bookSharing.bookState = doc;

        next();
    },function(err){
        sendResponse(res, {messgae: 'Could not fetch book state', status: false, error: err}, 500);
    });

}