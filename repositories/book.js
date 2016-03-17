'use strict';

const Book = require('../models/book');

const bookRepo = {};

bookRepo.createBook = function(newBook) {
    let book = new Book({
        //name:
    });
    return book.save();
};

bookRepo.findBooks = function (limit, page) {
    return Book.paginate({},{limit: Number(limit), page: page});
};

module.exports = bookRepo;
