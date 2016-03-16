'use strict';

const User = require('../models/user');
const sendResponse = require('../utils/sendResponse');

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
 *       405:
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

        const data = Object.assign({},{username: user.username, roles: user.roles,createdAt: user.createdAt, updatedAt: user.updatedAt});
        sendResponse(res, {'message': 'User created', status: true, data: data}, 201);
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
 *       405:
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

    if(isNaN(page) || isNaN(limit)) {
        sendResponse(res, {message: 'Invalid input.' , status: false}, 405);
    }

    User.paginate({}, {select: '-password', page: page, limit: Number(limit)}).then(function (result) {
        if(!result.docs.length) {
            sendResponse(res, {messgae: 'Could not find users', status: false}, 404);
        }
        sendResponse(res, {data: result, status: true}, 200);
    }).catch(function (error) {
        sendResponse(res, {messgae: 'Could not fetch users', status: false, error: error}, 500);
    });
};
/**
 * @swagger
 * /user/{Id}:
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
 *       405:
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
exports.getUser = function(req, res) {
    const userId  = req.params.id;

    if(!userId) {
        sendResponse(res, {messgae: 'Invalid id.', status: false}, 405);
    }

    User.findById(userId,'-password',function(err, doc) {
        if(err) {
            sendResponse(res, {messgae: 'Could not fetch error', status: false, error: err}, 500);
        }
        if(!doc) {
            sendResponse(res, {messgae: 'Could not find user with id: '+ userId, status: false}, 404);
        }
        sendResponse(res, {'message': 'Found User', status: true, data: doc}, 200);
    });
};