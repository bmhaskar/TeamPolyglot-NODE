/**
 * Created by PankajK1 on 3/31/2016.
 */

'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const assert = require('assert');

const testUtils = require('../../utils/testUtils');
const databaseUtils = require('../../utils/database');


describe('Book Request api', function () {
    let app = {};
    let savedBook = {};
    let token;
    let currentUser = {};
    let bookState;
    let updatedBookState = {};
    const requestBook = function (app, cb, savedBook, token, status) {
        status = status || 200;
        request(app)
            .put('/api/book/request/' + savedBook._id)
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(status)
            .end(cb)
    }
    before(function (done) {
        testUtils.cleanDatabases(function () {
            require('../../index').start().then(function (server) {
                app = server;

                testUtils.getToken(app, function (userToken) {
                    token = userToken;

                    testUtils.createBook(app, function (err, result) {
                        if (err) throw  err;
                        savedBook = result.body.data;
                        currentUser = testUtils.currentUser;
                        done();
                    }, testUtils.book, token);

                });
            });
        });
    });


    after(function (done) {
        app.close(function () {
            databaseUtils.disconnectDatabase();
           app = {};
            done();
        });
    });


    it('fetches book state', function (done) {
        request(app)
            .get('/api/book/status/' + savedBook._id)
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, result) {
                if (err) throw  err;
                testUtils.assertBasicSucessMessage(result.body);
                assert.deepStrictEqual(result.body.data.book, savedBook,
                    'Asserting book state has correct book');

                bookState = result.body.data;
                done();
            })
    });

    it('request a book', function (done) {

        updatedBookState = Object.assign({}, bookState);
        updatedBookState.book = savedBook;
        updatedBookState.requestedBy.push(currentUser);
        requestBook(app, function (err, result) {
            if (err) throw  err;
            testUtils.assertBasicSucessMessage(result.body);

            assert.equal(result.body.data.requestedBy[0]._id, updatedBookState.requestedBy[0]._id,
                'Asserting request is created for current logged in user');

            assert.deepStrictEqual(result.body.data.book, updatedBookState.book,
                'Asserting book state has correct book');
            done();
        }, savedBook, token, 200);
    });

    it('should not send duplicate request', function (done) {
        requestBook(app, function (err, result) {
            if (err) throw  err;
            done();
        }, savedBook, token, 400);
    });

});