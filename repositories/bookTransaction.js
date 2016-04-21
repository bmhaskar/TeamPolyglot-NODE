'use strict';


const mongoose  = require('mongoose');
const indexer = require('../utils/indexer');
const debugLogger = require('../logger/debugLogger');

const getPlainObject = function (doc) {
    if(doc.toObject) {
        return Object.assign({}, doc.toObject());
    }
    return doc;
};

class BookTransactionRepo {
    indexBookTransaction(book, user, bookState, eventName) {
        let bookObject = getPlainObject(book);
        let relatedUser = getPlainObject(user);

        const relatedBook = Object.assign({uploadedBy: bookState.uploadedBy}, bookObject);

        const bookTransaction = {
            event: eventName,
            relatedUser: relatedUser,
            relatedBook: relatedBook,
            createdAt: new Date()
        };

        return indexer.add(bookTransaction, 'bookTransaction')
                .catch(function (err) {
                    debugLogger.log('error', 'Could not index record', {
                        bookTransaction: bookTransaction,
                        error: err
                    });
                    throw err;
                })
    };
};
const bookTransactionRepo = new BookTransactionRepo();
module.exports = bookTransactionRepo;
