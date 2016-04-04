'use strict';

const sendResponse = require('../../utils/sendResponse');


module.exports = function (req, res, next) {
    const bookState = req.bookSharing.bookState;
    const user = req.bookSharing.user;
    if(bookState.currentStatus == 'Available') {
        next();
    } else {
        sendResponse(res, {'message':'Invalid input.Book not available', status: false}, 400);
    }
};

