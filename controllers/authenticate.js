'use strict';
/**
 * @swagger
 * /authenticate/login:
 *   post:
 *     operationId: login
 *     description: Authenticates requested user, with valid credentials
 *     summary: Authenticates requested user, with valid credentials
 *     tags:
 *      - Authenticate
 *     parameters:
 *       -  name: body
 *          in: body
 *          required: true
 *          description: 'The user object with username and password, which needs to signed-in'
 *          schema:
 *            $ref: '#/definitions/RequestUser'
 *     responses:
 *       200:
 *        description: The logged in user's token which needs to be used in subsequent requests
 *        schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *                status:
 *                  default: true
 *                data:
 *                  type: string
 *       400:
 *         description: Invalid input
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       401:
 *         description: Unauthorized
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *       404:
 *        description: 'Requested user was not found'
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
exports.login = function (req, res) {
    
};
/**
 * @swagger
 * /authenticate/logout:
 *   post:
 *     operationId: logout
 *     description: Logout current logged-in user
 *     summary: Logout current logged-in user
 *     tags:
 *      - Authenticate
 *     responses:
 *       200:
 *        description: Nothing will be returned as data.
 *        schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *                status:
 *                  default: true
 *                data:
 *                  type: string
 *                  default: ''
 *       403:
 *         description: 'Forbidden: access is denied'
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
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
exports.logout = function (req, res) {

};

/**
 * @swagger
 * /authenticate/revoke-token/{token}:
 *    put:
 *      operationId: revokeToken
 *      parameters:
 *       -  name: token
 *          in: path
 *          required: true
 *          description: 'Token which needs to be revoked'
 *          type: string
 *      tags:
 *        - Authenticate
 *      summary: Revokes the requested token
 *      responses:
 *       200:
 *         description: Nothing will be returned as data.
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               status:
 *                 default: true
 *               data:
 *                 type: string
 *                 default: ''
 *       404:
 *         description: 'Requested token was not found'
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *       406:
 *         description: Not acceptable request.
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
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
 */
exports.revokeToken = function (req, res) {

};

