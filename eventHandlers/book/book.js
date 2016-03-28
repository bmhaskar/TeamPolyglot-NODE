'use strict';

const workflow = require('../../workflow/workflow');

const bookStateRepo = require('../../repositories/bookState');

const handleBookCreated = function(eventName, book) {
    bookStateRepo.createBookState();
};

workflow.on('book_created', handleBookCreated);
