'use strict';

/**
 * @swagger
 * /book/search/by-tags:
 *   get:
 *     operationId: searchByTags
 *     description: Returns list of books having the requested tag{s}
 *     summary: Returns list of books having the requested tag{s}
 *     tags:
 *      - Book Search
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         description: 'Number of books to be retrieved'
 *         type: integer
 *       - name: page
 *         in: query
 *         required: false
 *         description: 'Page number from where we want to start fetching books'
 *         type: integer
 *       - name: tags
 *         in: query
 *         required: true
 *         type: array
 *         items:
 *          type: string
 *         description: 'List of tags by which books can be searched'
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
 *                  type: object
 *                  $ref: '#/definitions/Book'
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Searched books not found'
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
exports.searchByTags = function (req, res) {

};


/**
 * @swagger
 * /book/search/by-author:
 *   get:
 *     operationId: searchByAuthor
 *     description: Returns list of books written by the requested author{s}
 *     summary: Returns list of books written by the requested author{s}
 *     tags:
 *      - Book Search
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         description: 'Number of books to be retrieved'
 *         type: integer
 *       - name: page
 *         in: query
 *         required: false
 *         description: 'Page number from where we want to start fetching books'
 *         type: integer
 *       - name: author
 *         in: query
 *         required: true
 *         type: array
 *         items:
 *          type: string
 *         description: 'Name of the author by which books can be searched'
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
 *                  type: object
 *                  $ref: '#/definitions/Book'
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Searched books not found'
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
exports.searchByAuthor = function (req, res) {

};



/**
 * @swagger
 * /book/search/like-name/{name}:
 *   get:
 *     operationId: searchLikeName
 *     description: Returns list of books which have similar requested name
 *     summary: Returns list of books which have similar requested name
 *     tags:
 *      - Book Search
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         description: 'Number of books to be retrieved'
 *         type: integer
 *       - name: page
 *         in: query
 *         required: false
 *         description: 'Page number from where we want to start fetching books'
 *         type: integer
 *       - name: name
 *         in: path
 *         required: true
 *         type: string
 *         description: 'Name of the book by which books can be searched'
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
 *                  type: object
 *                  $ref: '#/definitions/Book'
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Searched books not found'
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
exports.searchLikeName = function (req, res) {

};
