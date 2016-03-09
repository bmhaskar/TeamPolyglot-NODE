'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
	name: String,
	password: String,
	admin: Boolean
});

module.exports = user;