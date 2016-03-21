'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
    name: {type: String, trim: true},
    email: {type: String}
}, {timestamp: true}).index({email: 1, name: 1}, {unique: true});

/**
 * @swagger
 * definition:
 *   NewAuthor:
 *     type: object
 *     required:
 *       - name
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
 *              type: string
 *              format: date-time
 *           updatedAt:
 *              type: string
 *              format: date-time
 */

module.exports = mongoose.model('Author', authorSchema);