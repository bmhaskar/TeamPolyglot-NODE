'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * @swagger
 * definition:
 *   NewUser:
 *     type: object
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *       admin:
 *         type: boolean
 *         default: false
 *   User:
 *     allOf:
 *       - $ref: '#/definitions/NewUser'
 *       - type: object
 *         required:
 *         - _id
 *         properties:
 *           _id:
 *             type: string
 */
const userSchema = new Schema({
	username: String,
	password: String,
	admin: Boolean
});

module.exports = mongoose.model('User',userSchema);