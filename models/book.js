'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
/**
 * @swagger
 * definition:
 *   Comment:
 *     type: object
 *     properties:
 *       body:
 *         type: String
 *       createdBy:
 *          $ref: '#/definitions/ResponseUser'
 *       createdAt:
 *         type: dateTime
 *       updatedAt:
 *         type: dateTime
 */
const commentSchema = new Schema({
    body: {type: String, trim: true},
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
    _id: false
}, {timestamp: true});

const publisherSchema = new Schema({
    name: {type: String},
    address: {
        street1: String,
        street2: String,
        country: String,
        city: String,
        state: String,
        zip: String
    }
}, {timestamp: true});

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
 *       comments:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Comment'
 *       publishedOn:
 *         type: dateTime
 *       isbn13:
 *         type: String
 *       isbn10:
 *         type: String
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

const bookSchema = new Schema({
    name: {type: String, required: true, trim: true},
    authors: [{type: Schema.Types.ObjectId, ref: 'Author'}],
    comments: [commentSchema],
    publishedOn: {type: Date},
    publisher: publisherSchema,
    isbn13: String,
    isbn10: String
}, {timestamps: true});


module.exports = mongoose.model('Book', bookSchema);
