'use strict';

const mongoose = require('mongoose');

const config = require('../../config/config');
const sendResponse = require('../../utils/sendResponse');

const connectDatabase = function () {
    return new Promise(function(resolve, reject) {
        mongoose.connect(config.database.mongoose,  function (err) {
            if(err) {
                return reject(err);
            }
            return resolve(true);
        });
    });
};

const disconnectDatabase = function (cb) {
    mongoose.connection.close(cb);
};

module.exports = function (req, res, next) {
    connectDatabase().then(null, function (err) {
        console.log(err);
        sendResponse(res, {message: 'Internal server error. Could not connect to database', status: false}, 500);
    }).then(function () {
        res.on('finish', disconnectDatabase);
        res.on('end', disconnectDatabase);

        next();
    })

};
