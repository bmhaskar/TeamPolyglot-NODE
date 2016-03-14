'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: {type: String, trim: true},
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
    _id: false
}, {timestamp: true});

const bookSchema = new Schema({
    name: {type: String, required: true, trim: true},
    author: [{type: Schema.Types.ObjectId, ref: 'Author'}],
    comments: [commentSchema]
}, {timestamps: true});

/**
 * @swagger
 * definition:
 *   NewBook:
 *     type: object
 *     required:
 *       - name
 *       - author
 *     properties:
 *       name:
 *         type: string
 *       author:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Author'
 *   Book:
 *     allOf:
 *       - $ref: '#/definitions/NewBook'
 *       - type: object
 *         required:
 *         - _id
 *         properties:
 *           _id:
 *             type: string
 */
module.exports = mongoose.model('Book', bookSchema);
