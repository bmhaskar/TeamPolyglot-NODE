'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: {type: String, trim: true},
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
    _id: false
}, {timestamp: true});

const bookSchema = new Schema({
    name: {type: String, required: true, trim: true},
    authors: [{type: Schema.Types.ObjectId, ref: 'Author'}],
    comments: [commentSchema]
}, {timestamps: true});

/**
 * @swagger
 * definition:
 *   NewBook:
 *     type: object
 *     required:
 *       - name
 *       - authors
 *     properties:
 *       name:
 *         type: string
 *         example: My new book
 *       authors:
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
 *           createdAt:
 *              type: dateTime
 *           updatedAt:
 *              type: dateTime
 */
module.exports = mongoose.model('Book', bookSchema);
