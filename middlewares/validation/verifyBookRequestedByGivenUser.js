'use strict'
const sendResponse = require('../../utils/sendResponse');
const bookStateUtil = require('../../utils/bookStateUtil');

module.exports = function (req, res, next) {
    const bookState = req.bookSharing.bookState;
    const user = req.bookSharing.user;

    bookStateUtil.isRequestedByUser(bookState, user)
        .then(null, function (err) {
            sendResponse(res, {'message':'Invalid input.User never requested this book', status: false}, 400);
        })
        .then(function (requestedByInfo) {
            req.bookSharing.requestedByUser = requestedByInfo.user;
            req.bookSharing.requestedByUserIndex = requestedByInfo.index;
            next();
        })
};
