'use strict';

const workflow = require('../../workflow/workflow');

const bookStateRepo = require('../../repositories/bookState');

const handleBookCreated = function(eventData) {
    return bookStateRepo.createBookState(eventData.app.currentAuthenticatedUser._id,
      eventData.book._id
    );
};

workflow.on('book_created', handleBookCreated);
