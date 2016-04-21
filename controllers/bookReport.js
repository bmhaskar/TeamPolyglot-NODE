'use strict';
const bookSearch = require('../search/book');
const sendResponse = require('../utils/sendResponse');
/**
 * @swagger
 * /book/reports/recently-added:
 *   get:
 *     operationId: getRecentlyAddedBook
 *     description: Returns recently added book
 *     summary: Returns recently added book
 *     tags:
 *      - Book Reports
 *     responses:
 *       200:
 *        description: Recently added book details
 *        schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *                status:
 *                  default: true
 *                data:
 *                  type: object
 *                  $ref: '#/definitions/Book'
 *       404:
 *        description: 'Requested book not found'
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
exports.getRecentlyAddedBook = function (req, res) {
    
};

/**
 * @swagger
 * /book/reports/most-read:
 *   get:
 *     operationId: getMostReadBook
 *     parameters:
 *       -  name: limit
 *          in: query
 *          required: false
 *          description: 'Number of books to be retrieved per page'
 *          type: integer
 *       -  name: numberOfBooks
 *          in: query
 *          required: false
 *          description: 'Total number of books to be retrieved'
 *          type: integer
 *       -  name: page
 *          in: query
 *          required: false
 *          description: 'Page number from where we want to start fetching books.'
 *          type: integer
 *       -  name: 'Authorization'
 *          in: header
 *          type: string
 *          required: true
 *          description: 'Token which needs to be sent as "Authorization: Bearer XXXXXX" '
 *     description: Returns most read book
 *     summary: Returns most read book
 *     tags:
 *      - Book Reports
 *     responses:
 *       200:
 *        description:  Most read book details
 *        schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *                status:
 *                  default: true
 *                data:
 *                  type: object
 *                  $ref: '#/definitions/Book'
 *       404:
 *        description: 'Requested book not found'
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
exports.getMostReadBook = function (req, res) {

  const numOfBooks = req.query.numberOfBooks || 10;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  bookSearch.mostReadBooks(numOfBooks, page, limit).then(function(data) {
    sendResponse(res, {message: 'Found books.', data: data, status: true}, 200);
  }).catch(function(error){
      let message  = {message: error.message, status: false};
      if(!error.code  || error.code == 500) {
        message.error = error;
      }
      sendResponse(res, message, error.code || 500 );
  });
};





