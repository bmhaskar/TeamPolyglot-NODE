'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * @swagger
 * definition:
 *  NewBookState:
 *    type: object
 *    required:
 *     - book
 *     - uploadedBy
 *     - currentStatus
 *    properties:
 *      book:
 *        type: object
 *        $ref: '#/definitions/Book'
 *      currentStatus:
 *        type: string
 *      uploadedBy:
 *        type: object
 *        $ref: '#/definitions/ResponseUser'
 *      lentBy:
 *        type: object
 *        $ref: '#/definitions/ResponseUser'
 *      lostBy:
 *        type: object
 *        $ref: '#/definitions/ResponseUser'
 *      returnedBy:
 *        type: object
 *        $ref: '#/definitions/ResponseUser'
 *      requestedBy:
 *        type: array
 *        items:
 *          $ref: '#/definitions/ResponseUser'
 *  BookState:
 *    allOf:
 *      - $ref: '#/definitions/NewBookState'
 *      - type: object
 *        required:
 *          _id:
 *             type: string
 *          createdAt:
 *             type: dateTime
 *          updatedAt:
 *             type: dateTime
 */
const bookStateSchema = new Schema({
    book: {type: Schema.Types.ObjectId, ref: 'Book'},
    currentStatus: {type: String},
    uploadedBy: {type: Schema.Types.ObjectId, ref: 'User'},
    lentBy: {type: Schema.Types.ObjectId, ref: 'User'},
    returnedBy: {type: Schema.Types.ObjectId, ref: 'User'},
    requestedBy: [{type: Schema.Types.ObjectId, ref: 'User'}],
    lostBy: {type: Schema.Types.ObjectId, ref: 'User'}
}, {timestamp: true});


module.exports = mongoose.model('BookState', bookStateSchema);
