'use strict';


const indexer = require('../utils/indexer');
const debugLogger = require('../logger/debugLogger');
class BookTransactionRepo {

    // indexBookIfNotIndexed(book, bookTransactionId) {
    //     book.id = book.id || book._id;
    //     book._id = undefined;
    //     book.parent = bookTransactionId;
    //     return indexer.add(book, 'book', bookTransactionId);
    // };
    //
    // indexUserIfNotIndexed(user, bookTransactionId) {
    //     user.id = user.id || user._id;
    //     user._id = undefined;
    //     user.parent = bookTransactionId;
    //     return indexer.add(user, 'relatedUser', bookTransactionId);
    // };
    //
    // indexBookTransaction(book, user, eventName) {
    //     const bookTransactionRepo = this;
    //     const bookTransaction = {event: eventName, createdAt: new Date()};
    //     debugLogger.log('debug', 'In book transactions before indexing ', bookTransaction);
    //
    //     return indexer.add(bookTransaction, 'bookTransaction')
    //         .then(function (res) {
    //             const bookPromise = bookTransactionRepo.indexBookIfNotIndexed(book, res._id);
    //             const userPromise = bookTransactionRepo.indexUserIfNotIndexed(user, res._id);
    //             return Promise.all([bookPromise, userPromise]);
    //         }).catch(function (err) {
    //             console.log(err);
    //         })
    //     };

    indexBookTransaction(book, user, bookState, eventName) {

        const relatedBook = Object.assign({uploadedBy: bookState.uploadedBy}, book);

        const bookTransaction = {
            event: eventName,
            relatedUser: user,
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
