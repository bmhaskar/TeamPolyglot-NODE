'use strict';
const userRepo = require('../repositories/user');
const debugLogger = require('../logger/debugLogger');
const logger = require('../middlewares/logger/logger');
const databaseSetup = function () {
    return userRepo.findByName('admin')
        .then(function (adminUser) {
            if (!adminUser) {
                const newAdminUser = {
                    "username": "admin",
                    //@todo: Reset admin password once application is deployed
                    "password": "admin123",
                    "email": "admin.booksharing@mailinator.com",
                    "roles": [
                        {
                            "name": "admin"
                        }
                    ]

                };
                return userRepo.createUser(newAdminUser)
            }
        })
        .catch(function (err) {
            debugLogger.log('error','Error while initialising database', err);
            throw err;
        })
};

module.exports = databaseSetup;

