'use strict';
const sendResponse = require('../../utils/sendResponse');

const bookStateRepo = require('../../repositories/bookState');

module.exports = function (req, res, next) {
    const bookId = req.params.bookId;
    if (!bookId) {
        sendResponse(res, {message: 'Invalid id.', status: false}, 400);
    }

    bookStateRepo.findByBookId(bookId)
        .then(null, function (err) {
            throw {message: 'Could not fetch book state', code: 500};
        })
        .then(function (foundBookState) {
            if (!foundBookState) {
                throw {message: 'Could not find book status with book id: ' + bookId, code: 404};
            }
            req.bookSharing = req.bookSharing || {};
            req.bookSharing.bookState = foundBookState;
            next();

        }).catch(function (err) {
        sendResponse(res, {message: err.message, status: false, error: err}, err.code);
    });


};