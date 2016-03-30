'use strict';

const TokenBlackList = require('../models/tokenBlackList');

const tokenBlackListRepo = {};

tokenBlackListRepo.findByToken = function (token) {
    return TokenBlackList.findOne({token: token}).exec();
};

tokenBlackListRepo.backlistToken = function (token, logout) {
    const blackListedToken = new TokenBlackList({
       token: token,
       logout: logout || false
    });

    return blackListedToken.save();
};

module.exports = tokenBlackListRepo;

