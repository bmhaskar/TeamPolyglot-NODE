'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const mongoosePaginate = require('mongoose-paginate');

/**
 * @swagger
 * definition:
 *   Role:
 *     type: object
 *     required:
 *       - name
 *     properties:
 *       name:
 *         type: string
 */
const role = new Schema({
    name: {type: String, trim: true}
}, {timestamp: true});

/**
 * @swagger
 * definition:
 *   ResponseUser:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *       email:
 *         type: string
 *       roles:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Role'
 *       createdAt:
 *         type: string
 *         format: date-time
 *       updatedAt:
 *         type: string
 *         format: date-time
 *   NewUser:
 *     type: object
 *     required:
 *       - username
 *       - password
 *       - email
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *       email:
 *         type: string
 *       roles:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Role'
 *   User:
 *     allOf:
 *       - $ref: '#/definitions/NewUser'
 *       - type: object
 *         required:
 *         - _id
 *         properties:
 *           _id:
 *              type: string
 *           createdAt:
 *              type: string
 *              format: date-time
 *           updatedAt:
 *              type: string
 *              format: date-time
 */
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    roles: [role]
}, {
    timestamps: true
});


// Execute before each user.save() call
userSchema.pre('save', function (callback) {
    var user = this;

    // Break out if the password hasn't changed
    if (!user.isModified('password')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function (err, salt) {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);