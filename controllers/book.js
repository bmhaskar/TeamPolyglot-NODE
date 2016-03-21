'use strict';


const bookRepo = require('../repositories/book');
const sendResponse = require('../utils/sendResponse');

/**
 * @swagger
 * /books:
 *    get:
 *      operationId: getBooks
 *      parameters:
 *       -  name: limit
 *          in: query
 *          required: false
 *          description: 'Number of users to be retrieved'
 *          type: integer
 *       -  name: page
 *          in: query
 *          required: false
 *          description: 'Page number from where we want to start fetching books.'
 *          type: integer
 *      tags:
 *        - Book
 *      summary: Retrieves list of books
 *      responses:
 *       200:
 *         description: 'List of books'
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               status:
 *                 default: true
 *               data:
 *                  type: object
 *                  properties:
 *                    docs:
 *                      type: array
 *                      items:
 *                        $ref: '#/definitions/Book'
 *                    total:
 *                       type: integer
 *                    limit:
 *                       type: integer
 *                    page:
 *                       type: integer
 *                    pages:
 *                       type: integer
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
 *       404:
 *         description: 'Requested books not found'
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *       406:
 *         description: Not acceptable request.
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       500:
 *         description: Internal server error
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               error:
 *                 type: string
 *
 */
exports.getBooks = function (req, res) {

    let page = req.query.page || 1;
    let limit = req.query.limit || 10;

    if (isNaN(page) || isNaN(limit)) {
        sendResponse(res, {message: 'Invalid input.', status: false}, 400);
    }

    bookRepo.findBooks(limit, page).then(function (result) {
        if (!result.docs.length) {
            sendResponse(res, {messgae: 'Could not find books', status: false}, 404);
        } else {
            sendResponse(res, {message: 'Found books', data: result, status: true}, 200);
        }
    }, function (error) {
        sendResponse(res, {messgae: 'Could not fetch books', status: false, error: error}, 500);
    });
};

/**
 * @swagger
 * /book:
 *    post:
 *      operationId: addBook
 *      parameters:
 *       -  name: body
 *          in: body
 *          required: true
 *          description: 'Book object which needs to be added to the library'
 *          schema:
 *            $ref: '#/definitions/NewBook'
 *      tags:
 *        - Book
 *      summary: Creates a book
 *      responses:
 *       200:
 *          description: 'Book object which is added to the library'
 *          schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               status:
 *                 default: true
 *               data:
 *                 type: object
 *                 $ref: '#/definitions/Book'
 *
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
 *       406:
 *         description: Not acceptable request.
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       500:
 *         description: Internal server error
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               error:
 *                 type: string
 */
exports.post = function(req, res) {
    bookRepo.createBook(req.body).then(function (user) {
        sendResponse(res, {'message': 'User created', status: true, data: maskPassword(user)}, 200);
    }, function (err) {
        sendResponse(res, {'message': 'Could not save user.', status: false, error: err}, 500);
    }).end();
}

/**
 * @swagger
 * /book/{bookId}:
 *    put:
 *      operationId: putForId
 *      summary: Updates book details
 *      tags:
 *        - Book
 *      parameters:
 *       -  name: bookId
 *          in: path
 *          required: true
 *          description: 'Id of the book to be modified'
 *          type: string
 *       -  name: body
 *          in: body
 *          required: true
 *          description: 'User object details which needs to be updated'
 *          schema:
 *            type: object
 *            $ref: '#/definitions/NewBook'
 *      responses:
 *       200:
 *         description: 'Updated book object'
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               status:
 *                  default: true
 *               data:
 *                  $ref: '#/definitions/Book'
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
 *       404:
 *         description: 'Requested book not found'
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *       406:
 *         description: Not acceptable request.
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       500:
 *         description: Internal server error
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               error:
 *                 type: string
 *
 */
exports.put = function (req, res) {

}



/**
 * @swagger
 * /book/request/{bookId}:
 *   get:
 *     operationId: requestBook
 *     description: Send a request to borrow a book
 *     summary: Borrow a book
 *     tags:
 *      - Book
 *     parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *        description: The id of book which is requested.
 *        type: string
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
exports.requestBook = function(req, res) {

}

/**
 * @swagger
 * /book/request/approve/{bookId}/{userId}:
 *   get:
 *     operationId: approveBookRequest
 *     description: Approve the request for borrowing book
 *     summary: Lend a book
 *     tags:
 *      - Book
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
exports.approveBookRequest = function(req, res) {

}

/**
 * @swagger
 * /book/request/reject/{bookId}/{userId}:
 *   get:
 *     operationId: rejectBookRequest
 *     description: Reject the request for borrowing book
 *     summary: Reject the request for borrowing a book
 *     tags:
 *      - Book
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
exports.rejectBookRequest = function(req, res) {
}


/**
 * @swagger
 * /book/return/{bookId}/{userId}:
 *   get:
 *     operationId: markBookAsReturned
 *     description: Return borrowed book
 *     summary: Return Book
 *     tags:
 *      - Book
 *     parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *        description: The id of book which is returned
 *        type: string
 *      - name: userId
 *        in: path
 *        required: false
 *        description: The id of user who is returning the book. If not provided current logged in user is used
 *        type: string
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
exports.markBookAsReturned = function(req, res) {
}


/**
 * @swagger
 * /book/lost/{bookId}/{userId}:
 *   get:
 *     operationId: markBookAsLost
 *     description: Mark borrowed book as lost
 *     summary: Mark lost book
 *     tags:
 *      - Book
 *     parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *        description: The id of book which is returned
 *        type: string
 *      - name: userId
 *        in: path
 *        required: false
 *        description: 'The id of user who had borrowed the book.
 *        If not provided, the recent borrower will be used as default.'
 *        type: string
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
exports.markBookAsLost = function(req, res) {
}