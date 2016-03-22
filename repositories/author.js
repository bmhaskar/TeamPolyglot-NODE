'use strict';

const Author = require('../models/author');

const authorRepo = {};

authorRepo.createAuthor = function (newAuthor) {
    let author = new Author({
        name: newAuthor.name
    });

    if (newAuthor.email) {
        author.email = newAuthor.email;
    }
    return author.save();
};

authorRepo.findByName = function (authorName) {
    return Author.findOne({name: authorName}).exec();
};

authorRepo.findByNameOrEmail = function (authorName, authorEmail) {
    return Author.find({$or: [{name: authorName}, {email: authorEmail}]}).exec();
};


authorRepo.findById = function (authorId) {
    return Book.findOne({_id: authorId}).exec();
};

module.exports = authorRepo;

