'use strict';

const debugLogger = require('../middlewares/logger/logger').debugLogger;
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
 *         description: 'Added user.'
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
 *       404:
 *         description: 'Requested books not found'
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
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
 *       406:
 *         description: Not acceptable request.
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *
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
 *       404:
 *         description: 'Requested user not found'
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
 *       500:
 *         description: Internal server error
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               error:
 *                 type: string
 *       406:
 *         description: Not acceptable request.
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 */
exports.post = function(req, res) {
    bookRepo.createBook(req.body).then(function (user) {
        sendResponse(res, {'message': 'User created', status: true, data: maskPassword(user)}, 200);
    }, function (err) {
        sendResponse(res, {'message': 'Could not save user.', status: false, error: err}, 500);
    }).end();
}


