'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const assert = require('assert');

const testUtils = require('../../utils/testUtils');
const databaseUtils = require('../../utils/database');
let app = {};

describe('Book api', function () {
    let token = "";


    let savedBook = {}, updatedBook = {};
    const assertProperBook = function (actual, expected) {
        assert(actual.hasOwnProperty('_id'), 'Asserting response object has book id');
        assert.equal(actual.name, expected.name);

        assert.equal(actual.authors[0].name, expected.authors[0].name,
            'Asserting response object has correct author name');

        assert.equal(actual.isbn13, expected.isbn13,
            'Asserting response object has correct isbn13');

        assert.equal(actual.publishedOn, expected.publishedOn,
            'Asserting response object has correct published on date');

        assert.equal(actual.publisher.name, expected.publisher.name,
            'Asserting response object has correct publisher name');

        assert.deepStrictEqual(actual.publisher.address, expected.publisher.address,
            'Asserting response object has correct publisher address');
    };
    const findBookById = function (cb, book, token, status) {

         status = status || 200;
         request(app)
            .get('/api/book/' + book._id)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(status)
            .end(cb)
    };
    before(function (done) {        
        testUtils.cleanDatabases(function () {
            require('../../index').start().then(function (server) {
                app = server;
                testUtils.getToken(app, function (userToken) {
                    token = userToken;
                    done();
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
        // testUtils.cleanDatabases(function () {
        //     done();
        // });
    });

    it('Responses with not authorised', function (done) {
        request(app)
            .get('/api/books')
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done);
    });

    it('Responses with not found', function (done) {
        request(app)
            .get('/api/books')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(404, done);
    });

    it('Saves a book', function (done) {
           testUtils.createBook(app, function(err, result) {
                if (err) throw  err;
                testUtils.assertBasicSucessMessage(result.body);
                assertProperBook(result.body.data, testUtils.book);
                savedBook = result.body.data;
                done();
            }, testUtils.book, token);
    });

    it('Responses with list of books', function (done) {
        request(app)
            .get('/api/books')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, result) {
                if (err) throw  err;
                testUtils.assertBasicSucessMessage(result.body);

                assert(result.body.data.hasOwnProperty('docs'), 'Asserting response has docs');
                assert(Array.isArray(result.body.data.docs), 'Asserting response has docs as array');
                assert(result.body.data.docs.length, 'Asserting response has docs as filled array');

                assertProperBook(result.body.data.docs[0], savedBook);
                done();
            })
    });

    it('Responses with correct book for id', function (done) {
        findBookById(function (err, result) {
            if (err) throw  err;

            testUtils.assertBasicSucessMessage(result.body);
            assert(result.body.data._id, savedBook._id);
            assertProperBook(result.body.data, savedBook);

            done();

        }, savedBook, token, 200)
    });

    it('Updates book with correct details', function (done) {
        updatedBook = Object.assign({}, savedBook);
        updatedBook.name = updatedBook.name + ' New';
        updatedBook.authors.push({name: 'Test Author'});
        updatedBook.authors.push({name: 'Test Author Test'});
        updatedBook.authors.shift();
        updatedBook.isbn13 = '';
        request(app)
            .put('/api/book/' + savedBook._id)
            .send(updatedBook)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, result) {
                if (err) throw  err;

                testUtils.assertBasicSucessMessage(result.body);
                assertProperBook(result.body.data, updatedBook);
                assert(result.body.data.authors.length, 2);
                assert.equal(result.body.data.isbn13, '', 'Asserting isbn13 is set to blank');
                assert(result.body.data.authors[1].name, updatedBook.authors[1].name);
                updatedBook = result.body.data;
                done();
            })
    });

    it('Updates only book name', function (done) {
        const updatedBookCopy = {name: updatedBook.name + 'updated'};
        request(app)
            .put('/api/book/' + savedBook._id)
            .send(updatedBook)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, result) {
                if (err) throw  err;

                testUtils.assertBasicSucessMessage(result.body);
                assert(result.body.data.name, updatedBookCopy);
                assert.deepStrictEqual(result.body.data.authors, updatedBook.authors);
                done();
            })
    });
    it('Deletes book by id', function (done) {
        request(app)
            .delete('/api/book/' + savedBook._id)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, result) {
                if (err) throw err;
                testUtils.assertBasicSucessMessage(result.body);
                assert(result.body.data._id, savedBook._id);
                findBookById(function (err, result) {
                    if (err) throw  err;
                    done();
                }, savedBook, token, 404)
            });
    });

});
