'use strict';


const debugLogger = require('../logger/logger').debugLogger;
const Book = require('../models/book');
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