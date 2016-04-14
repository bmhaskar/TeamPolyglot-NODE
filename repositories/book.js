'use strict';

const Book = require('../models/book');

const bookRepo = {};

bookRepo.createBook = function (newBook) {
    let book = new Book({
        publishedOn: new Date(newBook.publishedOn)
    });
    const fields = ['authors', 'publisher', 'name', 'comments', 'isbn13', 'isbn10'];

    fields.forEach(function (field, index) {
        if (field in newBook) {
            book[field] = newBook[field];
        }
    });

    return book.save();
};

bookRepo.updateBook = function (updatedBook, existingBook) {
    const fields = ['authors', 'publisher', 'name', 'comments', 'isbn13', 'isbn10'];
    if(updatedBook.publishedOn) {
        existingBook.publishedOn = new Date(updatedBook.publishedOn);
    }
    fields.forEach(function (field, index) {
        if (field in updatedBook) {
            existingBook[field] = updatedBook[field];
        }
    });

    return existingBook.save();
};

bookRepo.findBooks = function (limit, page) {
    return Book.paginate({}, {limit: Number(limit), page: page, populate: ['authors', 'comments.createdBy']});
};

bookRepo.findById = function (bookId) {
    return Book.findOne({_id: bookId}).populate('authors comments.createdBy').exec();
};

bookRepo.deleteBook = function (bookId) {
    return Book.findByIdAndRemove(bookId).exec();
};

bookRepo.findByFromDate = function (limit, page, dateFrom) {
  return   Book.paginate({"createdAt": {"$gte": dateFrom}}, {limit: Number(limit), page: page, populate: ['authors', 'comments.createdBy']});
};


module.exports = bookRepo;
