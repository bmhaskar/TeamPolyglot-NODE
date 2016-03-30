'use strict';
const BookState = require('../models/bookState');

const bookStateRepo = {};

bookStateRepo.createBookState= function(userId, bookId) {
    const bookState = new BookState({
        book: bookId,
        uploadedBy: userId,
        currentStatus: 'available'
    });
    return bookState.save();
};

bookStateRepo.findByBookId = function(bookId) {
    return BookState.findOne({book: bookId}).populate('book uploadedBy lentBy returnedBy requestedBy lostBy').exec();
};

bookStateRepo.findById = function(bookStateId) {
  return BookState.findOne({id: bookStateId}).populate('book uploadedBy lentBy returnedBy requestedBy lostBy').exec();
};

bookStateRepo.updateBookState = function(updatedBookState) {
  return updatedBookState.save();
};

module.exports = bookStateRepo;