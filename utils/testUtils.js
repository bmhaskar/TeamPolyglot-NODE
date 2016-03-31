'use strict';
const mongoose = require('mongoose');
const assert = require('assert');
const request = require('supertest');

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
testUtils.user = {
    "username": "bmhaskar1",
    "password": "xyz",
    "email": "bmhaskar1@mailinator.com",
    "roles": [
        {
            "name": "admin"
        }
    ]
};

testUtils.book = {
    "name": "Mastering NodeJS",
    "authors": [
        {
            "name": "Sandro Pasquali"
        }
    ],
    "publisher": {
        "name": "Packt Publishing Ltd.",
        "address": {
            "street1": "Livery Place",
            "street2": "35 Livery Street",
            "country": "UK",
            "city": "Birmingham",
            "zip": "B3 2PB"
        }
    },
    "isbn13": "978-1-78216-632-0",
    "publishedOn": "2016-03-21T11:11:37.820Z"
};


testUtils.createUser = function (app, cb, user, status) {
    status = status || 200;
    request(app)
        .post('/api/user')
        .send(user)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(status)
        .end(cb);
};

testUtils.createBook = function (app, cb, book, token, status) {
    status = status || 200;
    request(app)
        .post('/api/book')
        .send(book)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(cb);
}

testUtils.loginUser = function (app, cb, user, status) {
    status = status || 200;
    request(app)
        .post('/api/authenticate/login')
        .send(user)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(status)
        .end(cb);
};

testUtils.logOutUser = function (app, cb, token, status ) {
    status = status || 200;
    request(app)
        .post('/api/authenticate/logout')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(status)
        .end(cb);
};

testUtils.getToken = function (app, cb) {
    testUtils.createUser(app, function(err, result) {
        
        if(err) throw err;

        testUtils.loginUser(app, function(loginError, loginResult) {

            if(loginError) throw loginError;

            testUtils.token = loginResult.body.data;
            cb(testUtils.token);

        },testUtils.user, 200);

    },testUtils.user, 200);
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
