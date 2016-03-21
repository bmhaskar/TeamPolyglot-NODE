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
 *    properties:
 *      book:
 *        $ref: '#/definition/Book'
 *      uploadedBy:
 *        $ref: '#/deffinition/ResponseUser'
 *      uploadedBy:
 *        $ref: '#/deffinition/ResponseUser'
 *      lentBy:
 *        $ref: '#/deffinition/ResponseUser'
 *      lostBy:
 *        $ref: '#/deffinition/ResponseUser'
 *      returnedBy:
 *        $ref: '#/deffinition/ResponseUser'
 *      requestedBy:
 *        type: array
 *        items:
 *          $ref: '#/deffinition/ResponseUser'
 *  BookState:
 *    allOf:
 *      - $ref: '#/definitions/NewBookState'
 *      - type: object
 *        required:
 *          _id:
 *           type: string
 *          createdAt:
 *             type: dateTime
 *          updatedAt:
 *             type: dateTime
 */
const bookStateSchema = new Schema({
    book: {type: Schema.Types.ObjectId, ref: 'Book'},
    uploadedBy: {type: Schema.Types.ObjectId, ref: 'User'},
    lentBy: {type: Schema.Types.ObjectId, ref: 'User'},
    returnedBy: {type: Schema.Types.ObjectId, ref: 'User'},
    requestedBy: [{type: Schema.Types.ObjectId, ref: 'User'}],
    lostBy: {type: Schema.Types.ObjectId, ref: 'User'}
}, {timestamp: true});


module.exports = mongoose.model('BookState', bookStateSchema);
