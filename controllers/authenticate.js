'use strict';
const jwt = require('jsonwebtoken');
const localAuthenticationStrategy = require('../authenticationStrategies/localStrategy');
const config = require('../config/config');
const sendResponse = require('../utils/sendResponse');
const tokenBlackListRepo = require('../repositories/tokenBlackList');

const handleJwtVerificationError = function (err, res) {
    if(err && err.name == 'TokenExpiredError') {
        sendResponse(res, {message:  'Token expired' , status: false}, 400);
    } else if(err && err.name == 'JsonWebTokenError') {
        sendResponse(res, {message:  'Invalid expired' , status: false}, 400);
    } else if(err) {
        sendResponse(res, {message:  'Token verification error' , status: false}, 500);
    }
};

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
exports.login = function (req, res, next) {

    localAuthenticationStrategy.authenticate('local', function(err, user, info) {

        if (err) {
            sendResponse(res, {message: 'Internal server error',  status: false}, 500);
        }

        if (!user) {
            sendResponse(res, {message: info.message,  status: false}, info.statusCode);
        }
        //user has authenticated correctly thus we create a JWT token
        jwt.sign({ userId: user._id}, config.token.secret, {
            issuer: config.host,
            expiresIn: config.token.expiresIn
        }, function (token) {
            sendResponse(res, {message: 'Login successful', data: token, status: true}, 200);
        });

    })(req, res, next);
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
 *     parameters:
 *      -  name: 'Authorization'
 *         in: header
 *         type: string
 *         required: true
 *         description: 'Token which needs to be sent as "Authorization: Bearer XXXXXX" '
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
    const token = req.bookSharing.authenticatedUserToken;

    tokenBlackListRepo.backlistToken(token, true).then(function (token) {
        sendResponse(res, {message:  'Successfully logged out' , status: true}, 200);
    }, function (err) {
        sendResponse(res, {message:  'Internal server error. Could not logout.' , status: false}, 500);
    });
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
 *       -  name: 'Authorization'
 *          in: header
 *          type: string
 *          required: true
 *          description: 'Token which needs to be sent as "Authorization: Bearer XXXXXX" '
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
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
 *       403:
 *         description: 'Forbidden: access is denied'
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
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
    const token = req.params.token;
    jwt.verify(token, config.token.secret, function (err, decoded) {
        if(err) handleJwtVerificationError(err, res);

        tokenBlackListRepo.backlistToken(token).then(function (token) {
            sendResponse(res, {message:  'Successfully revoked token' , status: true}, 200);
        }, function (err) {
            sendResponse(res, {message:  'Internal server error. Could not revoke token.' , status: false}, 500);
        });
    });
};

/**
 * @swagger
 * /authenticate/forgot-password/{username}:
 *    get:
 *      operationId: forgotPassword
 *      tags:
 *        - Authenticate
 *      parameters:
 *       -  name: username
 *          in: path
 *          type: string
 *          required: true
 *          description: Name of the user
 *      summary: Sends an email with the link to reset password
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
 *         description: 'Requested user was not found'
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
exports.forgotPassword = function (req, res) {

};

/**
 * @swagger
 * /authenticate/reset-password/{token}:
 *    get:
 *      operationId: resetPassword
 *      tags:
 *        - Authenticate
 *      parameters:
 *       -  name: token
 *          in: path
 *          type: string
 *          required: true
 *          description: Token to identify the user
 *      summary: Randomely generates the password and sets the password for user identified by token
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
 *       401:
 *         description: Token expired.
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               error:
 *                 example: 'Reset password link expired, please regenerate link via forgot-password API'
 *       404:
 *         description: 'Requested user was not found'
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
exports.resetPassword = function (req, res) {

};
