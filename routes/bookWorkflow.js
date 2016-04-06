'use strict';

const bookWorkflowController = require('../controllers/bookWorkflow');

const authenticateRequest = require('../middlewares/authenticate/authenticate');
const verifyBookRequestedByGivenUser = require('../middlewares/validation/verifyBookRequestedByGivenUser');
const verifyBookAvailable = require('../middlewares/validation/verifyBookAvailable');
const verifyBorrowedByGivenUser = require('../middlewares/validation/verifyBorrowedByGivenUser');
const findUserById = require('../middlewares/findUser/findUserById');
const findUserByName = require('../middlewares/findUser/findUserByName');
const findBookById = require('../middlewares/findBook/findBookById');
const findBookStateByBookId = require('../middlewares/findBookState/findBookStateByBookId');

const bookWorkflow = function (routes) {
    routes.route('/book/request/:bookId')
        .put(
            authenticateRequest,
            findBookStateByBookId,
            verifyBookAvailable,
            bookWorkflowController.requestBook
        );
    routes.route('/book/request/approve/:bookId/:userId')
        .put(
            authenticateRequest,
            findBookStateByBookId,
            findUserById,
            verifyBookRequestedByGivenUser,
            bookWorkflowController.approveBookRequest
        );
    routes.route('/book/request/reject/:bookId/:userId')
        .put(
            authenticateRequest,
            findBookStateByBookId,
            findUserById,
            verifyBookRequestedByGivenUser,
            bookWorkflowController.rejectBookRequest
        );

    routes.route('/book/return/:bookId/:userId')
        .put(
            authenticateRequest, 
            findBookStateByBookId, 
            findUserById,
            verifyBorrowedByGivenUser,
            bookWorkflowController.markBookAsReturned
        );
    routes.route('/book/lost/:bookId/:userId')
        .put(
            authenticateRequest, 
            findBookStateByBookId, 
            bookWorkflowController.markBookAsLost);

};


module.exports = bookWorkflow;
