'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const config = require('../config/config');
const debugLogger = require('../logger/debugLogger');

exports.connectDatabase = function () {
    return new Promise(function(resolve, reject) {
        mongoose.connect(config.database.mongoose, config.database.options, function (err) {
            if(err) {
                debugLogger.log('error', 'Error while connecting database.', err);
                return reject(err);
            }
            return resolve(mongoose);
        });
    });
};

exports.disconnectDatabase = function () {
    return new Promise(function(resolve, reject) {
        mongoose.connection.close(function (err) {
            if(err) {
                debugLogger.log('error', 'Error while disconnecting database', err);
                return reject(err);
            }
            return resolve(true);
        })

    });
};

