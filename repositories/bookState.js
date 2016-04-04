'use strict';
const BookState = require('../models/bookState');

const bookStateRepo = {};

bookStateRepo.createBookState = function (userId, bookId) {
    const bookState = new BookState({
        book: bookId,
        uploadedBy: userId,
        currentStatus: 'Available'
    });
    return bookState.save();
};

bookStateRepo.findByBookId = function (bookId) {
    return BookState.findOne({book: bookId})
        .populate('uploadedBy lentBy returnedBy requestedBy lostBy')
        .populate({
            path: 'book',
            model: 'Book',
            populate: {
                path: 'authors',
                model: 'Author'
            }
        })
        .lean()
        .exec();
};

bookStateRepo.findById = function (bookStateId) {
    return BookState.findOne({_id: bookStateId})
        .populate('uploadedBy lentBy returnedBy requestedBy lostBy')
        .populate({
            path: 'book',
            model: 'Book',
            populate: {
                path: 'authors',
                model: 'Author'
            }
        })
        .lean()
        .exec();

};

bookStateRepo.updateBookState = function (updatedBookState, existingBookState) {
    return BookState.findOneAndUpdate({_id: existingBookState._id} ,updatedBookState ,{new : true}).exec();
};

module.exports = bookStateRepo;