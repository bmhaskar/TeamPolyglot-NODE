'use strict';


const debugLogger = require('../logger/logger').debugLogger;
const Book = require('../models/book');
/**
 *  @swagger
 *  /books:
 *    get:
 *      tags:
 *        - Book
 *      summary: List all books
 *      responses:
 *        200:
 *          description: 'A list of books'
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/definitions/'
 */
exports.getBooks = function (req, res) {
    //debugLogger.debug('Test debugLogger');
    // throw new Error("My test error");
    res.json([{
        name: 'Test Book'
    }]);
};

/**
 * @swagger
 * definition:
 *    bookAddedResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          example: 'Book added to library'
 *        data:
 *          $ref: '#/definitions/Book'
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
 *           $ref: '#/definitions/bookAddedResponse'
 *       405:
 *          description: Invalid input
 */
exports.post = function(req, res) {
    debugLogger.debug(req.body);

    var book = new Book();
    book.name = req.body.name;

    // Save the book and check for errors
    book.save(function(err) {
        if (err)
            res.send(err);

        //book.authors = req.body.authors;
        //@todo: Add service to check if authors already exists

        // Respond with new book object
        res.json({message: 'Book added to library', data: book });
    });

}