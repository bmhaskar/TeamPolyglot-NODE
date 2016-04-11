'use strict';


const indexer = require('../utils/indexer');
const debugLogger = require('../logger/debugLogger');
class BookTransactionRepo {

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
