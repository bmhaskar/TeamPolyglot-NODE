'use strict';
const sendResponse = require('../../utils/sendResponse');

const bookRepo = require('../../repositories/book');

module.exports = function(req, res, next) {
    const bookId  = req.params.id;
    if(!bookId) {
        sendResponse(res, {messgae: 'Invalid id.', status: false}, 400);
    }

    bookRepo.findById(bookId).then(function(doc){
        if(!doc) {
            sendResponse(res, {messgae: 'Could not find book with id: ' + bookId, status: false}, 404);
        }
        req.bookSharing = req.bookSharing || {};
        req.bookSharing.book = doc;

        next();
    },function(err){
        sendResponse(res, {messgae: 'Could not fetch book', status: false, error: err}, 500);
    });

}

