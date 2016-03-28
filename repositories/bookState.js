'use strict';
const BookState = require('../models/bookState');

const bookStateRepo = {};

BookState.createBookState= function(newBookState) {
    let bookState = new BookState({
        book: newBookState.book._id
    });


};
BookState.findByBookId = function(bookId) {
    BookState.findOne({book: bookId}).populate('book uploadedBy lentBy returnedBy requestedBy lostBy').exec();
};

module.exports = BookState;