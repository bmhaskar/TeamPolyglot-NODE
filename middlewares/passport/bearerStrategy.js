'use strict';

const passport = require('passport');
const jwt = require('jsonwebtoken');
const bearerStrategy = require('passport-http-bearer').Strategy;
const userRepo = require('../../repositories/user');
const config = require('../../config/config');

passport.use(new bearerStrategy(
    function (token, done) {
        const accessDeniedErrorMessage = 'Forbidden: access is denied';
        if (token) {

            jwt.verify(token, config.token.secret, function (err, decoded) {

                if(err && err.name == 'TokenExpiredError') {
                    return done(null, false, {message: accessDeniedErrorMessage + ' Token expired' , statusCode: 401})
                } else if(err && err.name == 'JsonWebTokenError') {
                    return done(null, false, {message: accessDeniedErrorMessage + ' Token expired' , statusCode: 401})
                } else if(err) {
                    return done(null, false, {message: accessDeniedErrorMessage + ' Token verification error' , statusCode: 401})
                }
                
                userRepo.findById(decoded.userId).then(function (user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: accessDeniedErrorMessage + ' Could not find user for specified token.'
                        , statusCode: 401
                        })
                    }
                }, function (err) {
                    return done(err);
                });
            });


        } else {
            return done(null, false, {
                message: accessDeniedErrorMessage + ' Token is missing in request',
                statusCode: 403
            });
        }
    }
));
module.exports = passport;
