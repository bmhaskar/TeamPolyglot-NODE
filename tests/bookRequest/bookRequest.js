/**
 * Created by PankajK1 on 3/31/2016.
 */

'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const assert = require('assert');

const testUtils = require('../../utils/testUtils');
const databaseUtils = require('../../utils/database');
const bookStateUtil = require('../../utils/bookStateUtil');
const userRepo = require('../../repositories/user');

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
    };
    const approveBookRequest = function (app, cb, savedBook, user, token, status) {
        status = status || 200;
        request(app)
            .put('/api/book/request/approve/' + savedBook._id + '/' + user._id)
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(status)
            .end(cb)
    };
    const returnBook = function (app, cb, savedBook, user, token, status) {
        status = status || 200;
        request(app)
            .put('/api/book/return/' + savedBook._id + '/' + user._id)
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(status)
            .end(cb)
    };
    const rejectBook = function (app, cb, savedBook, user, token, status) {
        status = status || 200;
        request(app)
            .put('/api/book/request/reject/' + savedBook._id + '/' + user._id)
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(status)
            .end(cb)
    };
    const markBookAsLost = function (app, cb, savedBook, token, status, user) {
        status = status || 200;
        user = user || {_id: ''};
        const userId = user._id.toString() || '';
        request(app)
            .put('/api/book/lost/' + savedBook._id)
            .set('Authorization', 'Bearer ' + token)
            .query({userId:  userId })
            .expect('Content-Type', /json/)
            .expect(status)
            .end(cb)
    };


    before(function (done) {

        testUtils.cleanDatabases(function () {

            testUtils.cleanIndexes()
                .then(function () {
                    return require('../../index').start()
                })
                .then(function (server) {
                    app = server;

                    testUtils.getToken(app, function (userToken) {
                        token = userToken;
                        testUtils.createBook(app, function (err, result) {
                            if (err) throw  err;
                            savedBook = result.body.data;
                            currentUser = Object.assign({}, testUtils.currentUser);
                            done();
                        }, testUtils.book, token);

                    });
                })
                .catch(function (err) {
                    console.log(err);
                    done();
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

    it('Approve book request', function (done) {

        updatedBookState = Object.assign({}, bookState);
        updatedBookState.book = savedBook;
        updatedBookState.borrowedBy = currentUser;
        approveBookRequest(app, function (err, result) {

            if (err) throw  err;
            testUtils.assertBasicSucessMessage(result.body);

            assert.equal(result.body.data.borrowedBy._id, currentUser._id,
                'Asserting request is approved for a given user');

            assert.deepStrictEqual(result.body.data.currentStatus, 'Not available',
                'Asserting book state has correct book status');
            done();
        }, savedBook, currentUser, token, 200);
    });

    it('Does not allow requesting  un-available book', function (done) {

        updatedBookState = Object.assign({}, bookState);
        updatedBookState.book = savedBook;
        requestBook(app, function (err, result) {
            if (err) throw  err;
            done();
        }, savedBook, token, 400);
    });

    it('Returns book', function (done) {

        updatedBookState = Object.assign({}, bookState);
        updatedBookState.book = savedBook;
        returnBook(app, function (err, result) {
            if (err) throw  err;
            testUtils.assertBasicSucessMessage(result.body);
            assert.equal(result.body.data.borrowedBy, null,
                'Asserting book is no longer borrowed');
            assert.equal(result.body.data.returnedBy._id, currentUser._id,
                'Asserting book is returned by correct user');

            assert.deepStrictEqual(result.body.data.currentStatus, 'Available',
                'Asserting book state has correct book status');
            done();
        }, savedBook, currentUser, token, 200);
    });


    it('Can not reject request for not requested book', function (done) {
        updatedBookState = Object.assign({}, bookState);
        updatedBookState.book = savedBook;
        rejectBook(app, function (err, result) {
            if (err) throw  err;

            done();
        }, savedBook, currentUser, token, 400);
    });

    it('Rejects book request correctly', function (done) {

        updatedBookState = Object.assign({}, bookState);
        updatedBookState.book = savedBook;
        requestBook(app, function (err, result) {
            if (err) throw  err;
            rejectBook(app, function (err, result) {
                if (err) throw  err;
                testUtils.assertBasicSucessMessage(result.body);

                bookStateUtil.isRequestedByUser(result.body.data, currentUser)
                    .then(function () {
                        assert.equal(true, false, 'Asserting book is rejected by correct user');

                    }).catch(function () {
                    assert.equal(true, true, 'Asserting book is rejected by correct user');

                }).then(function () {
                    done();
                });

            }, savedBook, currentUser, token, 200);
        }, savedBook, token, 200);
    });

    it('Does not approve rejected book request', function (done) {

        updatedBookState = Object.assign({}, bookState);
        updatedBookState.book = savedBook;
        approveBookRequest(app, function (err, result) {
            if (err) throw  err;

            done();
        }, savedBook, currentUser, token, 400);
    });

    it('Marks book as lost', function (done) {
        updatedBookState = Object.assign({}, bookState);
        updatedBookState.book = savedBook;
        requestBook(app, function (err, result) {
            if (err) throw  err;

            approveBookRequest(app, function (err, result) {
                if (err) throw  err;

                markBookAsLost(app, function (err, result) {
                    if (err) throw  err;
                    testUtils.assertBasicSucessMessage(result.body);

                    assert.deepStrictEqual(result.body.data.lostBy._id, currentUser._id,
                        'Asserting book state has been marked as lost by correct user');

                    assert.deepStrictEqual(result.body.data.currentStatus, 'Lost',
                        'Asserting book state has correct book status');
                    done();
                }, savedBook, token, 200);

            }, savedBook, currentUser, token, 200);

        }, savedBook, token, 200);
    });

    it('Does not allow marking book as lost, if it was not borrowed by the same user', function (done) {

        userRepo.findByName('admin')
            .then(function (adminUser) {
                testUtils.createBook(app, function (err, result) {
                    if (err) throw  err;
                    savedBook = result.body.data;

                    updatedBookState = Object.assign({}, bookState);
                    updatedBookState.book = savedBook;
                    requestBook(app, function (err, result) {

                         if (err) throw  err;


                        approveBookRequest(app, function (err, result) {
                            if (err) throw  err;

                            markBookAsLost(app, function (err, result) {
                                if (err) throw  err;

                                done();
                            }, savedBook, token, 400, adminUser);

                        }, savedBook, currentUser,token, 200);

                    }, savedBook, token, 200);

                }, testUtils.book, token);

            })
    });
});