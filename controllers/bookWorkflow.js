'use strict';

const sendResponse = require('../utils/sendResponse');
const bookStateRepo = require('../repositories/bookState');
const bookStateUtil = require('../utils/bookStateUtil');
const userRepo = require('../repositories/user');

const updateBookState = function (updatedBookState, bookState) {
    return bookStateRepo.updateBookState(updatedBookState, bookState);

};

const getUpdatedBookState = function (updatedBookState) {
    return bookStateRepo.findById(updatedBookState._id)
        .catch(function (err) {
            throw {
                message: 'Internal server error. Could not find updated book state',
                code: 500
            };
        });
};

/**
 * @swagger
 * /book/request/{bookId}:
 *   put:
 *     operationId: requestBook
 *     description: Send a request to borrow a book
 *     summary: Borrow a book
 *     tags:
 *      - Book Request
 *     parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *        description: The id of book which is requested.
 *        type: string
 *      - name: 'Authorization'
 *        in: header
 *        type: string
 *        required: true
 *        description: 'Token which needs to be sent as "Authorization: Bearer XXXXXX" '
 *     responses:
 *       200:
 *        description: Requested book's current state
 *        schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *                status:
 *                  default: true
 *                data:
 *                  type: object
 *                  $ref: '#/definitions/BookState'
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Requested books not found'
 *        schema:
 *         allOf:
 *          - $ref: '#/definitions/Response'
 *       406:
 *        description: Not acceptable request.
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *       500:
 *        description: Internal server error
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *          - type: object
 *            properties:
 *              error:
 *                type: string
 *
 */
exports.requestBook = function (req, res) {
    const bookState = req.bookSharing.bookState;
    const user = req.bookSharing.currentAuthenticatedUser;


    bookStateUtil.isRequestedByUser(bookState, user)
        .then(function (requestedByInfo) {            
            sendResponse(res, {'message': 'Book request exists', status: false}, 400);
        })
        .then(null, function (err) {
            let updatedBookState = Object.assign({}, bookState);
            updatedBookState.requestedBy.push(user._id);

            updateBookState(updatedBookState, bookState)
                .catch(function (err) {
                    throw {
                      messgae: "Internal server error. Could not create book request",
                        code: 500
                    };
                })
                .then(getUpdatedBookState)
                .then(function(foundBookState){

                    sendResponse(res, {message: 'Book request created', status: true, data: foundBookState},
                        200);
                }).catch(function (err) {
                    sendResponse(res, {message: err.message, status: false}, err.code);
                })



        });


};

/**
 * @swagger
 * /book/request/approve/{bookId}/{userId}:
 *   put:
 *     operationId: approveBookRequest
 *     description: Approve the request for borrowing book
 *     summary: Lend a book
 *     tags:
 *      - Book Request
 *     parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *        description: The id of book which is requested.
 *        type: string
 *      - name: userId
 *        in: path
 *        required: true
 *        description: The id of user whose request needs to be approved.
 *        type: string
 *      - name: 'Authorization'
 *        in: header
 *        type: string
 *        required: true
 *        description: 'Token which needs to be sent as "Authorization: Bearer XXXXXX" '
 *     responses:
 *       200:
 *        description: Requested book's current state
 *        schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *                status:
 *                  default: true
 *                data:
 *                  type: object
 *                  $ref: '#/definitions/BookState'
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Requested books not found'
 *        schema:
 *         allOf:
 *          - $ref: '#/definitions/Response'
 *       406:
 *        description: Not acceptable request.
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *       500:
 *        description: Internal server error
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *          - type: object
 *            properties:
 *              error:
 *                type: string
 *
 */
exports.approveBookRequest = function (req, res) {
    const bookState = req.bookSharing.bookState;
    const user = req.bookSharing.user;
    const index = req.bookSharing.requestedByUserIndex;

    let updatedBookState = Object.assign({}, bookState);
    updatedBookState.requestedBy.splice(index, 1);
    updatedBookState.currentStatus = 'Not available';
    updatedBookState.borrowedBy = user;

    updateBookState(updatedBookState, bookState)
        .catch(function (err) {
            throw {
                messgae: 'Internal server error. Could not approve book request',
                code: 500
            };
        })
        .then(getUpdatedBookState)
        .then(function(foundBookState){

            sendResponse(res, {message: 'Book request approved', status: true, data: foundBookState},
                200);
        }).catch(function (err) {
        sendResponse(res, {message: err.message, status: false}, err.code);
    });

};

/**
 * @swagger
 * /book/request/reject/{bookId}/{userId}:
 *   put:
 *     operationId: rejectBookRequest
 *     description: Reject the request for borrowing book
 *     summary: Reject the request for borrowing a book
 *     tags:
 *      - Book Request
 *     parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *        description: The id of book whose request needs to be rejected.
 *        type: string
 *      - name: userId
 *        in: path
 *        required: true
 *        description: The id of user whose request needs to be rejected.
 *        type: string
 *      - name: 'Authorization'
 *        in: header
 *        type: string
 *        required: true
 *        description: 'Token which needs to be sent as "Authorization: Bearer XXXXXX" '
 *     responses:
 *       200:
 *        description: Requested book's current state
 *        schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *                status:
 *                  default: true
 *                data:
 *                  type: object
 *                  $ref: '#/definitions/BookState'
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Requested books not found'
 *        schema:
 *         allOf:
 *          - $ref: '#/definitions/Response'
 *       406:
 *        description: Not acceptable request.
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *       500:
 *        description: Internal server error
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *          - type: object
 *            properties:
 *              error:
 *                type: string
 *
 */
exports.rejectBookRequest = function (req, res) {
    const bookState = req.bookSharing.bookState;
    const user = req.bookSharing.user;
    const index = req.bookSharing.requestedByUserIndex;

    let updatedBookState = Object.assign({}, bookState);
    updatedBookState.requestedBy.splice(index, 1);

    updateBookState(updatedBookState, bookState)
        .catch(function (err) {
            throw {
                messgae: 'Internal server error. Could not reject book request',
                code: 500
            };
        })
        .then(getUpdatedBookState)
        .then(function(foundBookState){

            sendResponse(res, {message: 'Book request rejected', status: true, data: foundBookState},
                200);
        }).catch(function (err) {
        sendResponse(res, {message: err.message, status: false}, err.code);
    });


};


/**
 * @swagger
 * /book/return/{bookId}/{userId}:
 *   put:
 *     operationId: markBookAsReturned
 *     description: Return borrowed book
 *     summary: Return Book
 *     tags:
 *      - Book Return and Lost Operations
 *     parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *        description: The id of book which is returned
 *        type: string
 *      - name: userId
 *        in: path
 *        required: true
 *        description: The id of user who is returning the book. If not provided current logged in user is used
 *        type: string
 *      - name: 'Authorization'
 *        in: header
 *        type: string
 *        required: true
 *        description: 'Token which needs to be sent as "Authorization: Bearer XXXXXX" '
 *     responses:
 *       200:
 *        description: Requested book's current state
 *        schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *                status:
 *                  default: true
 *                data:
 *                  type: object
 *                  $ref: '#/definitions/BookState'
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Requested books not found'
 *        schema:
 *         allOf:
 *          - $ref: '#/definitions/Response'
 *       406:
 *        description: Not acceptable request.
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *       500:
 *        description: Internal server error
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *          - type: object
 *            properties:
 *              error:
 *                type: string
 *
 */
exports.markBookAsReturned = function (req, res) {
    const bookState = req.bookSharing.bookState;
    const user = req.bookSharing.user;
    const index = req.bookSharing.requestedByUserIndex;

    let updatedBookState = Object.assign({}, bookState);
    updatedBookState.borrowedBy = null;
    updatedBookState.lostBy = null;
    updatedBookState.returnedBy = user;
    updatedBookState.currentStatus = 'Available';

    updateBookState(updatedBookState, bookState)
        .catch(function (err) {
            throw {
                messgae: 'Internal server error. Could not mark book as returned',
                code: 500
            };
        })
        .then(getUpdatedBookState)
        .then(function(foundBookState){

            sendResponse(res, {message: 'Book marked as returned', status: true, data: foundBookState},
                200);
        }).catch(function (err) {
        sendResponse(res, {message: err.message, status: false}, err.code);
    });
};


/**
 * @swagger
 * /book/lost/{bookId}:
 *   put:
 *     operationId: markBookAsLost
 *     description: Mark borrowed book as lost
 *     summary: Mark lost book
 *     tags:
 *      - Book Return and Lost Operations
 *     parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *        description: The id of book which is returned
 *        type: string
 *      - name: userId
 *        in: query
 *        required: false
 *        description: 'The id of user who had borrowed the book.
 *        If not provided, the recent borrower will be used as default.'
 *        type: string
 *      - name: 'Authorization'
 *        in: header
 *        type: string
 *        required: true
 *        description: 'Token which needs to be sent as "Authorization: Bearer XXXXXX" '
 *     responses:
 *       200:
 *        description: Requested book's current state
 *        schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *                status:
 *                  default: true
 *                data:
 *                  type: object
 *                  $ref: '#/definitions/BookState'
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Requested books not found'
 *        schema:
 *         allOf:
 *          - $ref: '#/definitions/Response'
 *       406:
 *        description: Not acceptable request.
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *       500:
 *        description: Internal server error
 *        schema:
 *          allOf:
 *          - $ref: '#/definitions/Response'
 *          - type: object
 *            properties:
 *              error:
 *                type: string
 *
 */
exports.markBookAsLost = function (req, res) {
    const bookState = req.bookSharing.bookState;
    const userId = req.query.userId;
    let user = bookState.borrowedBy;

    const markLost = function (bookState, res, user) {
        let updatedBookState = Object.assign({}, bookState);
        updatedBookState.lostBy = user;
        updatedBookState.returnedBy = user;
        updatedBookState.currentStatus = 'Lost';

        updateBookState(updatedBookState, bookState)
            .catch(function (err) {
                throw {
                    messgae: 'Internal server error. Could not mark book as lost',
                    code: 500
                };
            })
            .then(getUpdatedBookState)
            .then(function(foundBookState){

                sendResponse(res, {message: 'Book marked as lost', status: true, data: foundBookState},
                    200);
            }).catch(function (err) {
            sendResponse(res, {message: err.message, status: false}, err.code);
        });
    };

    if(userId) {
        userRepo.findById(userId)
            .then(null, function (err) {
                throw {message: 'Internal server error Could not fetch user', status: false, code: 500};
            })
            .then(function (foundUser) {
                if (!foundUser) {
                    throw {message:'Could not find user with id: ' + userId, code:  404};
                }
                user = foundUser;
                markLost(bookState, res, user);
            }).catch(function (err) {
                sendResponse(res, {message: err.message, status: false, error: err}, err.code);
            });

    } else {
        markLost(bookState, res, user);
    };

};
