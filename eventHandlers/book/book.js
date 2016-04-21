'use strict';

const workflow = require('../../workflow/workflow');

const bookStateRepo = require('../../repositories/bookState');
const bookTransactionRepo = require('../../repositories/bookTransaction');


const handleBookCreated = function (eventData) {
    return bookStateRepo.createBookState(eventData.app.currentAuthenticatedUser._id, eventData.book._id)
        .then(function (savedBookState) {
            return bookStateRepo.findById(savedBookState._id);
        })
        .then(function (foundBookState) {
            return bookTransactionRepo.indexBookTransaction(
                eventData.book,
                eventData.app.currentAuthenticatedUser,
                foundBookState,
                "uploaded"
            );
        });
};

const handleBookRequested = function (eventData) {
     
    
    return bookTransactionRepo.indexBookTransaction(
        eventData.bookState.book,
        eventData.user,
        eventData.bookState,
        "requested"
    );
};

const handleBookBorrowed = function (eventData) {
    return bookTransactionRepo.indexBookTransaction(
        eventData.bookState.book,
        eventData.user,
        eventData.bookState,
        "borrowed"
    );
};

const handleBookRead = function (eventData) {
    return bookTransactionRepo.indexBookTransaction(
        eventData.bookState.book,
        eventData.user,
        eventData.bookState,
        "read"
    );
};

const handleBookLost = function (eventData) {
    return bookTransactionRepo.indexBookTransaction(
        eventData.bookState.book,
        eventData.user,
        eventData.bookState,
        "lost"
    );
};

const handleBookRequestRejected = function (eventData) {
    return bookTransactionRepo.indexBookTransaction(
        eventData.bookState.book,
        eventData.user,
        eventData.bookState,
        "book_request_rejected"
    );
};
const handleBookRequestRejectedByMe = function (eventData) {
    return bookTransactionRepo.indexBookTransaction(
        eventData.bookState.book,
        eventData.user,
        eventData.bookState,
        "book_request_rejected_by_me"
    );
};
const handleBookLent = function (eventData) {
    return bookTransactionRepo.indexBookTransaction(
        eventData.bookState.book,
        eventData.user,
        eventData.bookState,
        "lent"
    );
};


workflow.on('book_created', handleBookCreated);
workflow.on('book_requested', handleBookRequested);
workflow.on('book_request_rejected', handleBookRequestRejected);
workflow.on('book_request_rejected_by_me', handleBookRequestRejectedByMe);
workflow.on('book_borrowed', handleBookBorrowed);
workflow.on('book_lent', handleBookLent);
workflow.on('book_returned', handleBookRead);
workflow.on('book_lost', handleBookLost);



