'use strict';
const mongoose = require("mongoose");

const config = require('../config/config');
const testUtils = {};

testUtils.cleanDatabases = function (cb) {
    mongoose.connect(config.database.mongoose, function (err) {
        mongoose.connection.db.dropDatabase(function () {
            mongoose.connection.close(function () {
                cb();
            })
        });
    });
};

module.exports = testUtils;
