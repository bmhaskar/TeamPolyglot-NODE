'use strict';

const User = require('../models/user');

const userRepo = {};

userRepo.findById = function(userId) {
    return User.findById(userId,'-password').exec();
};

userRepo.findByName = function (username) {
    return User.findOne({username: username}).exec();
};

userRepo.findByNameWithPassword = function (username) {
    return User.findOne({username: username}).select('username +password').exec();
};
userRepo.updateUser = function (updatedUser, existingUser) {
    const fields = ['username', 'email', 'roles', 'password'];
    fields.forEach(function (field, index) {
        if (field in updatedUser) {
            existingUser[field] = updatedUser[field];
        }
    });
    return existingUser.save();
};

userRepo.createUser = function (newUser) {
    var user = new User({
        username: newUser.username,
        password: newUser.password,
        email: newUser.email
    });

    if (newUser.roles) {
        user.roles = newUser.roles;
    }
    return user.save();
};

userRepo.findUsers = function(limit, page)  {
    return  User.paginate({}, {select: '-password', page: page, limit: Number(limit)});
};

userRepo.deleteUser = function(userId) {
    return User.findByIdAndRemove(userId).exec();
};

module.exports = userRepo;
