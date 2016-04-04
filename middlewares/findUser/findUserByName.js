'use strict';


const sendResponse = require('../../utils/sendResponse');
const userRepo = require('../../repositories/user');


module.exports = function (req, res, next) {

    const userName = req.params.username;


    if (!userName) {
        return sendResponse(res, {message: 'Invalid input username', status: false}, 400);
    }

    userRepo.findByName(userName)
        .then(null, function (err) {
            throw {message: 'Internal server error Could not fetch user', code: 500};
        })
        .then(function (foundUser) {
            if (!foundUser) {
                throw {message: 'Could not find user with username: ' + userName, code: 404};
            }
            req.bookSharing = req.bookSharing || {};
            req.bookSharing.user = foundUser;
            next();

        }).catch(function (err) {
        sendResponse(res, {message: err.message, status: false, error: err}, err.code);
    });

};