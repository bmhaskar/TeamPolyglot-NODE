'use strict';
const sendResponse = require('../utils/sendResponse');
const abstractSearch = require('../search/abstractSearch');

const searchUtil = require('../utils/search');

/**
 * @swagger
 * /search:
 *   get:
 *     operationId: search
 *     description: Returns list of entities matching the searched query string
 *     summary: Returns list of entities matching the searched query string
 *     tags:
 *      - Search
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         description: 'Number of searched records to be retrieved'
 *         type: integer
 *       - name: page
 *         in: query
 *         required: false
 *         description: 'Page number from where we want to start fetching searched  records'
 *         type: integer
 *       - name: q
 *         in: query
 *         required: true
 *         type: string
 *         description: Search string
 *     responses:
 *       200:
 *        description: List of books, filtered by tags
 *        schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *                status:
 *                  default: true
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: No data found
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
exports.search = function (req, res) {
    const queryString = req.query.q;
    const from = req.query.page || 0;
    const size = req.query.limit || 10;
    abstractSearch(queryString, from, size).catch(function () {
            throw {message: 'Internal server error. Could not perform search opeartion', code: 500};
        })
        .then(searchUtil.parseSearchResult)
        .then(
            function (result) {
                const  pages = parseInt(result.total/size);
                const data = {total: result.total, page: from || 1,
                    pages: pages || 1 , docs: result.hits };
                sendResponse(res, {message: 'Found records for query string '+ queryString, data: data, status: true}, 200);
            }
        ).catch(function (err) {
            sendResponse(res, {message: err, status: false}, 500);
        });
};
