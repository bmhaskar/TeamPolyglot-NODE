'use strict';

const Author = require('../models/author');

const authorRepo = {};

authorRepo.createAuthor = function(newAuthor) {
    let author = new Author({
        name: newAuthor.name
    });

    if(newAuthor.email) {
        author.email = newAuthor.email;
    }

    return author.save();
};

authorRepo.findByName = function (authorName) {
    return Author.findOne({name: authorName}).exec();
};


module.exports = authorRepo;

