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
            throw {message: 'Could not fetch book', code: 500};
        })
        .then(function(foundBook){
            if(!foundBook)  {
                throw {message: 'Could not find book with id: ' + bookId, code:  404};
            }

            req.bookSharing = req.bookSharing || {};
            req.bookSharing.book = foundBook;

            next();

        }).catch(function(err){
            sendResponse(res, {message: err.message, status: false, error: err},  err.code);
        });

}

