'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
/**
 * @swagger
 * definition:
 *   NewComment:
 *     type: object
 *     properties:
 *       body:
 *         type: string
 *   Comment:
 *     allOf:
 *       - $ref: '#/definitions/NewComment'
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
 *           createdBy:
 *              $ref: '#/definitions/ResponseUser'
 */
const commentSchema = new Schema({
    body: {type: String, trim: true},
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'}
}, {timestamp: true});

/**
 * @swagger
 * definition:
 *   NewPublisher:
 *     type: object
 *     required:
 *      - name
 *     properties:
 *       name:
 *         type: string
 *         example: Dummy publisher
 *       url:
 *         type: array
 *         items:
 *           type: string
 *       address:
 *         type: object
 *         properties:
 *           street1:
 *             type: string
 *           street2:
 *             type: string
 *           country:
 *             type: string
 *           city:
 *             type: string
 *           state:
 *             type: string
 *           zip:
 *             type: string
 *   Publisher:
 *     allOf:
 *       - $ref: '#/definitions/NewPublisher'
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
 *
 */
const publisherSchema = new Schema({
    name: {type: String},
    address: {
        street1: String,
        street2: String,
        country: String,
        city: String,
        state: String,
        zip: String
    },
    urls: [{type: String}]
}, {timestamp: true});

/**
 * @swagger
 * definition:
 *   NewBook:
 *     type: object
 *     required:
 *       - name
 *       - authors
 *       - publisher
 *       - publishedOn
 *     properties:
 *       name:
 *         type: string
 *         example: My new book
 *       authors:
 *         type: array
 *         items:
 *           $ref: '#/definitions/NewAuthor'
 *       comments:
 *         type: array
 *         items:
 *           $ref: '#/definitions/NewComment'
 *       publisher:
 *         $ref: '#/definitions/NewPublisher'
 *       publishedOn:
 *         type: string
 *         format: date-time
 *       isbn13:
 *         type: string
 *       isbn10:
 *         type: string
 *       tags:
 *         type: array
 *         items:
 *          type: string
 *   Book:
 *     allOf:
 *       - $ref: '#/definitions/NewBook'
 *       - type: object
 *         required:
 *           - _id
 *         properties:
 *           _id:
 *             type: string
 *           createdAt:
 *              type: string
 *              format: date-time
 *           updatedAt:
 *              type: string
 *              format: date-time
 *           comments:
 *              type: array
 *              items:
 *                $ref: '#/definitions/Comment'
 *           authors:
 *              type: array
 *              items:
 *                $ref: '#/definitions/Author'
 *   DeletedBook:
 *     allOf:
 *       - $ref: '#/definitions/Book'
 *       - type: object
 *         properties:
 *           authors:
 *             type: array
 *             items:
 *               type: string
 */

const bookSchema = new Schema({
    name: {type: String, required: true, trim: true},
    authors: [{type: Schema.Types.ObjectId, ref: 'Author'}],
    comments: [commentSchema],
    publishedOn: {type: Date},
    publisher: publisherSchema,
    isbn13: String,
    isbn10: String,
    tags: [{type: String, trim: true}]
}, {timestamps: true});

bookSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Book', bookSchema);
