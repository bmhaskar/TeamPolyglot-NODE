'use strict';

const User = require('../models/user');
const sendResponse = require('../utils/sendResponse');

const maskPassword = function (user) {
    return Object.assign({},
        {
            username: user.username,
            email: user.email,
            roles: user.roles,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    );
};

const updateUser = function (req, res) {
    var existingUser = req.bookSharing.user;
    Object.assign(existingUser,
        {
            username: req.body.username || existingUser.username,
            email: req.body.email || existingUser.email,
            roles: req.body.roles || existingUser.roles
        }
    );

    existingUser.save(function (err, user) {
        if (err)
            sendResponse(res, {'message': 'Could not update user.', status: false, error: err}, 500);

        sendResponse(res, {'message': 'Updated User', status: true, data: maskPassword(user)}, 200);

    });
};

const deleteUser = function (req, res) {
    var existingUser = req.bookSharing.user;
    existingUser.remove(function (err, user) {
        if (err) {
            sendResponse(res, {'message': 'Could not delete user.', status: false, error: err}, 500);
        }
        sendResponse(res, {'message': 'Deleted User', status: true, data: maskPassword(user)}, 200);
    });
};
/**
 * @swagger
 * /user:
 *    post:
 *      operationId: addUser
 *      parameters:
 *       -  name: body
 *          in: body
 *          required: true
 *          description: 'User object which needs to be created.'
 *          schema:
 *            $ref: '#/definitions/NewUser'
 *      tags:
 *        - User
 *      summary: Creates an user
 *      responses:
 *       201:
 *          description: 'Added user.'
 *          schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               status:
 *                 default: true
 *               data:
 *                 type: object
 *                 $ref: '#/definitions/ResponseUser'
 *       400:
 *          description: Invalid input
 *
 */
exports.post = function (req, res) {
    var user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });

    if (req.body.roles) {
        user.roles = req.body.roles;
    }

    user.save(function (err) {
        if (err)
            sendResponse(res, {'message': 'Could not save user.', status: false, error: err}, 500);

        sendResponse(res, {'message': 'User created', status: true, data: maskPassword(user)}, 201);
    });
}
/**
 * @swagger
 * definition:
 *   Response:
 *     type: object
 *     properties:
 *       status:
 *         type: boolean
 *         default: false
 *       message:
 *         type: string
 */
/**
 * @swagger
 * /users:
 *    get:
 *      operationId: getUsers
 *      parameters:
 *       -  name: limit
 *          in: query
 *          required: false
 *          description: 'Number of users to be retrieved'
 *          type: integer
 *       -  name: page
 *          in: query
 *          required: false
 *          description: 'Page number from where we want to start fetching users.'
 *          type: integer
 *      tags:
 *        - User
 *      summary: Retrieves list of users
 *      responses:
 *       200:
 *         description: 'Added user.'
 *         schema:
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
 *                        $ref: '#/definitions/ResponseUser'
 *                    total:
 *                       type: integer
 *                    limit:
 *                       type: integer
 *                    page:
 *                       type: integer
 *                    pages:
 *                       type: integer
 *       404:
 *         description: 'Requested user not found'
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
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
 *       406:
 *         description: Not acceptable request.
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *
 *
 */
exports.getUsers = function (req, res) {
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;

    if (isNaN(page) || isNaN(limit)) {
        sendResponse(res, {message: 'Invalid input.', status: false}, 400);
    }

    User.paginate({}, {select: '-password', page: page, limit: Number(limit)}).then(function (result) {
        if (!result.docs.length) {
            sendResponse(res, {messgae: 'Could not find users', status: false}, 404);
        }
        sendResponse(res, {data: result, status: true}, 200);
    }).catch(function (error) {
        sendResponse(res, {messgae: 'Could not fetch users', status: false, error: error}, 500);
    });
};
/**
 * @swagger
 * /user/{id}:
 *    get:
 *      operationId: getUser
 *      parameters:
 *       -  name: id
 *          in: path
 *          required: true
 *          description: 'Id of user to be retrieved'
 *          type: string
 *      tags:
 *        - User
 *      summary: Retrieves user details
 *      responses:
 *       200:
 *         description: 'User object'
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               status:
 *                  default: true
 *               data:
 *                  $ref: '#/definitions/ResponseUser'
 *       404:
 *         description: 'Requested user not found'
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
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
exports.getUser = function (req, res) {
    sendResponse(res, {'message': 'Found User', status: true, data: req.bookSharing.user}, 200);
};

/**
 * @swagger
 * /user/{username}:
 *    get:
 *      operationId: getUserByName
 *      parameters:
 *       -  name: username
 *          in: path
 *          required: true
 *          description: 'Name of user to be retrieved'
 *          type: string
 *      tags:
 *        - User
 *      summary: Retrieves user details
 *      responses:
 *       200:
 *         description: 'User object'
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               status:
 *                  default: true
 *               data:
 *                  $ref: '#/definitions/ResponseUser'
 *       404:
 *         description: 'Requested user not found'
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
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
exports.getUserByName = function (req, res) {
    sendResponse(res, {'message': 'Found User', status: true, data: req.bookSharing.user}, 200);
};

/**
 * @swagger
 * /user/{username}:
 *    put:
 *      operationId: putForName
 *      parameters:
 *       -  name: username
 *          in: path
 *          required: true
 *          description: 'Name of user to be modified'
 *          type: string
 *       -  name: body
 *          in: body
 *          required: true
 *          description: 'User object details which needs to be updated'
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              username:
 *                type: string
 *              password:
 *                type: string
 *              roles:
 *                type: array
 *                items:
 *                  $ref: '#/definitions/Role'
 *      tags:
 *        - User
 *      summary: Updates user details
 *      responses:
 *       200:
 *         description: 'Updated user object'
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               status:
 *                  default: true
 *               data:
 *                  $ref: '#/definitions/ResponseUser'
 *       404:
 *         description: 'Requested user not found'
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
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
exports.putForName = function (req, res) {
    updateUser(req, res);
};


/**
 * @swagger
 * /user/{username}:
 *    delete:
 *      operationId: deleteByName
 *      parameters:
 *       -  name: username
 *          in: path
 *          required: true
 *          type: string
 *          description: 'Name of user to be deleted'
 *      tags:
 *        - User
 *      summary: Deletes the user which has supplied username
 *      responses:
 *       200:
 *         description: 'Deleted user'
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               status:
 *                  default: true
 *               data:
 *                  $ref: '#/definitions/ResponseUser'
 *       404:
 *         description: 'Requested user not found'
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
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
exports.deleteByName = function (req, res) {
    deleteUser(req, res);
};

/**
 * @swagger
 * /user/{id}:
 *    put:
 *      operationId: putForId
 *      parameters:
 *       -  name: id
 *          in: path
 *          required: true
 *          description: 'Id of user to be modified'
 *          type: string
 *       -  name: body
 *          in: body
 *          required: true
 *          description: 'User object details which needs to be updated'
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              username:
 *                type: string
 *              password:
 *                type: string
 *              roles:
 *                type: array
 *                items:
 *                  $ref: '#/definitions/Role'
 *      tags:
 *        - User
 *      summary: Updates user details
 *      responses:
 *       200:
 *         description: 'Updated user object'
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               status:
 *                  default: true
 *               data:
 *                  $ref: '#/definitions/ResponseUser'
 *       404:
 *         description: 'Requested user not found'
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
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
exports.putForId = function (req, res) {
    updateUser(req, res);
};

/**
 * @swagger
 * /user/{id}:
 *    delete:
 *      operationId: deleteById
 *      parameters:
 *       -  name: id
 *          in: path
 *          required: true
 *          type: string
 *          description: 'Id of user to be deleted'
 *      tags:
 *        - User
 *      summary: Deletes the user which has supplied id
 *      responses:
 *       200:
 *         description: 'Deleted user'
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/Response'
 *           - type: object
 *             properties:
 *               status:
 *                  default: true
 *               data:
 *                  $ref: '#/definitions/ResponseUser'
 *       404:
 *         description: 'Requested user not found'
 *         schema:
 *          allOf:
 *           - $ref: '#/definitions/Response'
 *       400:
 *          description: Invalid input
 *          schema:
 *            allOf:
 *            - $ref: '#/definitions/Response'
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
exports.deleteById = function (req, res) {
    deleteUser(req, res);
};