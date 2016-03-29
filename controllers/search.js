'use strict';
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
 *         description: 'Number of books to be retrieved'
 *         type: integer
 *       - name: page
 *         in: query
 *         required: false
 *         description: 'Page number from where we want to start fetching books'
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
    
};
