'use strict';

const sendResponse = require('../utils/sendResponse');

/**
 * @swagger
 * /book/status/{bookId}:
 *   get:
 *     operationId: currentStatusOfBook
 *     description: Returns current status of the book
 *     summary: Current status of the book
 *     tags:
 *      - Book Status
 *     parameters:
 *      - name: bookId
 *        in: path
 *        required: true
 *        description: The id of book which is requested.
 *        type: string
 *      - name: fields
 *        in: query
 *        required: false
 *        description: List of fields which you want as part of response instead of complete status
 *        type: array
 *        items:
 *         type: string
 *      - name: 'Authorization'
 *        in: header
 *        type: string
 *        required: true
 *        description: 'Token which needs to be sent as "Authorization: Bearer XXXXXX" '
 *     responses:
 *       200:
 *        description: 'Returns the complete status object as data by default. If "fields" query param is passed
 *        returns those fields of status e.g. to just know current status as "lent" you need to pass "fields" as status'
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
exports.currentStateOfBook = function (req, res) {
    sendResponse(res, {'message': 'Found Book Status', status: true, data: req.bookSharing.bookState}, 200);
};

