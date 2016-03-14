'use strict';


const debugLogger = require('../logger/logger').debugLogger;
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
 *              $ref: '#/definitions/Book'
 */
exports.get = function (req, res) {
    //debugLogger.debug('Test debugLogger');
    // throw new Error("My test error");
    res.json([{
        name: 'Test Book'
    }]);
};