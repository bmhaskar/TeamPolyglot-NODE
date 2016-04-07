'use strict';

const workflow = require('../../workflow/workflow');

const bookStateRepo = require('../../repositories/bookState');
const bookTransactionRepo = require('../../repositories/bookTransaction');


const handleBookCreated = function (eventData) {
    return bookStateRepo.createBookState(eventData.app.currentAuthenticatedUser._id, eventData.book._id)
        .then(function (savedBookState) {
            return bookTransactionRepo.indexBookTransaction(
                    eventData.book,
                    eventData.app.currentAuthenticatedUser,
                    "uploaded"
                )

        });
};

workflow.on('book_created', handleBookCreated);
