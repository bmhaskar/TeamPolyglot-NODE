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
 *       email:
 *         type: sting
 *   Author:
 *     allOf:
 *       - $ref: '#/definitions/NewAuthor'
 *       - type: object
 *         required:
 *         - _id
 *         properties:
 *           _id:
 *             type: string
 */

module.exports = mongoose.model('Author', authorSchema);