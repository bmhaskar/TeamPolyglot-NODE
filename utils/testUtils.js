'use strict';
const mongoose = require('mongoose');
const assert = require('assert');

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

testUtils.assrtBasicMessage = function (body) {
    assert(body.hasOwnProperty('message'), 'Asserting response object has message property');
    assert(body.hasOwnProperty('status'), 'Asserting response object has status property');
    assert(body.hasOwnProperty('data'), 'Asserting response object has data property');
};

testUtils.assertBasicSucessMessage = function (body) {
    testUtils.assrtBasicMessage(body)
    assert.equal(body.status, true, 'Asserting user save operation status is true');
};
module.exports = testUtils;
