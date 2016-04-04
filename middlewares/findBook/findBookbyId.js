'use strict';
const sendResponse = require('../../utils/sendResponse');

const bookRepo = require('../../repositories/book');

module.exports = function(req, res, next) {
    const bookId  = req.params.bookId;

    if(!bookId) {
        return sendResponse(res, {message: 'Invalid id.', status: false}, 400);
    }
    bookRepo.findById(bookId)
        .then(null,function(err){
            sendResponse(res, {message: 'Could not fetch book', status: false, error: err}, 500);
        })
        .then(function(doc){
            if(!doc)  {
                throw {message: 'Could not find book with id: ' + bookId, code:  404};
            }

            req.bookSharing = req.bookSharing || {};
            req.bookSharing.book = doc;

            next();

        }).then(null, function(err){
            sendResponse(res, {message: err.message, status: false, error: err},  err.code);
        });

}

