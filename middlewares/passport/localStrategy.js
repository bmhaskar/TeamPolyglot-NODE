'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userRepo = require('../../repositories/user');

passport.use(new LocalStrategy(
    function (username, password, done) {
        userRepo.findByNameWithPassword(username).then(function (user) {

                // Make sure the username is correct
                if (!user) {
                    //User not found
                    return done(null, false, {message: 'User not found', statusCode: 404});
                }

                // Make sure the password is correct
                user.verifyPassword(password, function (err, isMatch) {
                    if (err) {
                        return done(err);
                    }

                    // Password did not match
                    if (!isMatch) {
                        return done(null, false, {message: 'Incorrect password', statusCode: 401});
                    }

                    // Success
                    return done(null, user);
                });
            },
            function (err) {
                return done(err);
            }
        );

    })
);

module.exports = passport;

