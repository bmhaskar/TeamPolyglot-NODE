'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
    name: {type: String, trim: true},
    email: {type: String}
}, {timestamp: true});

/**
 * @swagger
 * definition:
 *   NewAuthor:
 *     type: object
 *     required:
 *       - name
 *       - email
 *     properties:
 *       name:
 *         type: string
 *         example: New Author
 *       email:
 *         type: sting
 *         example: newauthor@mailinator.com
 *   Author:
 *     allOf:
 *       - $ref: '#/definitions/NewAuthor'
 *       - type: object
 *         required:
 *         - _id
 *         properties:
 *           _id:
 *             type: string
 *           createdAt:
 *              type: dateTime
 *           updatedAt:
 *              type: dateTime
 */

module.exports = mongoose.model('Author', authorSchema);