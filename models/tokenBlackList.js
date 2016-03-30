'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const tokenBlacklistSchema = new Schema({
    token: {type: String},
    logout: {type: Boolean, default: false}
}, {timestamp: true});

module.exports = mongoose.model('TokenBlackList', tokenBlacklistSchema);