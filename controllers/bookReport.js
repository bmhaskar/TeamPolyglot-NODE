'use strict';

const bookRepo = require('../repositories/book');
const sendResponse = require('../utils/sendResponse');
const debugLogger = require('../logger/debugLogger');

/**
 * @swagger
 * /book/reports/recently-added:
 *   get:
 *     operationId: getRecentlyAddedBook
 *     parameters:
 *       -  name: limit
 *          in: query
 *          required: false
 *          description: 'Number of books to be retrieved'
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
 *       -  name: 'since'
 *          in: query
 *          type: string
 *          format: date
 *          required: false
 *          description: 'Date from when the books added are needed'
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
//  sendResponse(res, {'message': 'waah bhidu', status: true, data: "{correct : true}"}, 200);

  let page = req.query.page || 1;
  let limit = req.query.limit || 10;

  if (isNaN(page) || isNaN(limit)) {
    sendResponse(res, {message: 'Invalid input.', status: false}, 400);
  }

  let dateFrom = req.query.since;
  if(!dateFrom) {
    let today = new Date();
    // If no date is provided, we will fetch the books added in last 15 days
    let dateFifteenDaysBack = new Date().setDate(today.getDate()-15);
    dateFrom = new Date(dateFifteenDaysBack);
  }

  bookRepo.findByFromDate(limit, page, dateFrom)
    .then(
      function (result) {
        if (!result.docs.length) {
          throw {message: 'Could not find books', code: 404 };
        } else {
          sendResponse(res, {message: 'Found books', data: result, status: true}, 200);
        }
      }
    )
    .catch(
      function (error) {
        sendResponse(res, {message: 'Internal server error. ' +  error.message, status: false, error: error}, error.code || 500);
      }
    );
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
 *          description: 'Number of books to be retrieved'
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
 *       -  name: 'since'
 *          in: query
 *          type: string
 *          format: date-time
 *          required: false
 *          description: 'Date from when the books added are needed'
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

};





