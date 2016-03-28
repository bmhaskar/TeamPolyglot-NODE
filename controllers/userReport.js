'use strict';


/**
 * @swagger
 * /user/reports/requested-books:
 *   get:
 *     operationId: getRequestedBooksByUser
 *     description: Returns list of books requested by the user
 *     summary: Returns list of books requested by the current logged-in user
 *     tags:
 *      - User Reports
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         description: 'Number of books to be retrieved'
 *         type: integer
 *       - name: page
 *         in: query
 *         required: false
 *         description: 'Page number from where we want to start fetching books.'
 *         type: integer
 *
 *     responses:
 *       200:
 *        description: List of books requested by the user
 *        schema:
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
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Requested books not found'
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
exports.getRequestedBooksByUser = function (req, res) {

};

/**
 * @swagger
 * /user/reports/borrowed-books:
 *   get:
 *     operationId: getBorrowedBooksByUser
 *     description: Returns list of books borrowed by the user
 *     summary: Returns list of books borrowed by the current logged-in user or list of books user is currently reading
 *     tags:
 *      - User Reports
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         description: 'Number of books to be retrieved'
 *         type: integer
 *       - name: page
 *         in: query
 *         required: false
 *         description: 'Page number from where we want to start fetching books.'
 *         type: integer
 *     responses:
 *       200:
 *        description: List of books borrowed by the user
 *        schema:
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
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Requested books not found'
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
exports.getBorrowedBooksByUser = function (req, res) {

};


/**
 * @swagger
 * /user/reports/lent-books:
 *   get:
 *     operationId: getLentBooksByUser
 *     description: Returns list of books lent by the user
 *     summary: Returns list of books lent by the current logged-in user.
 *     tags:
 *      - User Reports
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         description: 'Number of books to be retrieved'
 *         type: integer
 *       - name: page
 *         in: query
 *         required: false
 *         description: 'Page number from where we want to start fetching books.'
 *         type: integer
 *     responses:
 *       200:
 *        description: List of books lent by the user
 *        schema:
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
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Requested books not found'
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
exports.getLentBooksByUser = function (req, res) {

};



/**
 * @swagger
 * /user/reports/lost-books:
 *   get:
 *     operationId: getLostBooksByUser
 *     description: Returns list of books lost by the user
 *     summary: Returns list of books lost by the current logged-in user
 *     tags:
 *      - User Reports
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         description: 'Number of books to be retrieved'
 *         type: integer
 *       - name: page
 *         in: query
 *         required: false
 *         description: 'Page number from where we want to start fetching books.'
 *         type: integer
 *     responses:
 *       200:
 *        description: List of books lost by the user
 *        schema:
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
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Requested books not found'
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
exports.getLostBooksByUser = function (req, res) {

};



/**
 * @swagger
 * /user/reports/returned-books:
 *   get:
 *     operationId: getReturnedBooksByUser
 *     description: Returns list of books read by the user
 *     summary: Returns list of books read by the current logged-in user
 *     tags:
 *      - User Reports
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         description: 'Number of books to be retrieved'
 *         type: integer
 *       - name: page
 *         in: query
 *         required: false
 *         description: 'Page number from where we want to start fetching books.'
 *         type: integer
 *     responses:
 *       200:
 *        description: List of books read by the user
 *        schema:
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
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Requested books not found'
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
exports.getReturnedBooksByUser = function (req, res) {

};