'use strict';

const sendResponse = require('../../utils/sendResponse');


module.exports = function (req, res, next) {
    const bookState = req.bookSharing.bookState;
    const user = req.bookSharing.user;
    if(!bookState.borrowedBy) {
        sendResponse(res, {'message':'Invalid input.Book was never borrowed.', status: false}, 400);
    } else if(bookState.borrowedBy._id.toString() == user._id.toString()) {
        next(); 
    } else {
        sendResponse(res, {'message':'Invalid input.Book was not borrowed by given user', status: false}, 400);
    }
};


