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
    return BookState.findOne({book: bookId})
      .populate('uploadedBy lentBy returnedBy requestedBy lostBy')
      .populate({
        path: 'book',
        populate: { path: 'authors' }
      })
      .exec();
};

bookStateRepo.findById = function(bookStateId) {
  return BookState.findOne({_id: bookStateId})
    .populate('uploadedBy lentBy returnedBy requestedBy lostBy book.authors')
    .populate({
      path: 'book',
      populate: { path: 'authors' }
    })
    .exec();

};

bookStateRepo.updateBookState = function(updatedBookState) {
  return updatedBookState.save();
};

module.exports = bookStateRepo;