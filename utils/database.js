'use strict';

const mongoose = require('mongoose');

const config = require('../config/config');


exports.connectDatabase = function () {
    return new Promise(function(resolve, reject) {
        mongoose.connect(config.database.mongoose,  function (err) {
            if(err) {
                console.log(err);
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
                return reject(err);
            }
            return resolve(true);
        })

    });
};

