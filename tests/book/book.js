'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const assert = require('assert');

const testUtils = require('../../utils/testUtils');
let app = {};

describe('Book api', function () {

    let book = {
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
    const findBookById = function (cb, book, status) {
        request(app)
            .get('/api/book/' + book._id)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(status)
            .end(cb)
    };
    before(function (done) {
        testUtils.cleanDatabases(function () {
            app = require('../../index');
            done();
        })
    });
    after(function (done) {
        testUtils.cleanDatabases(function () {
            done();
        });
    });

    it('Responses with not found', function (done) {
        request(app)
            .get('/api/books')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404, done);
    });

    it('Saves a book', function (done) {
        request(app)
            .post('/api/book')
            .send(book)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, result) {
                if (err) throw  err;
                testUtils.assertBasicSucessMessage(result.body);
                assertProperBook(result.body.data, book);
                savedBook = result.body.data;
                done();
            })
    });

    it('Responses with list of books', function (done) {
        request(app)
            .get('/api/books')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, result) {
                if (err) throw  err;
                testUtils.assertBasicSucessMessage(result.body);

                assert(result.body.data.hasOwnProperty('docs'), 'Asserting response has docs');
                assert(Array.isArray(result.body.data.docs), 'Asserting response has docs as array');
                assert(result.body.data.docs.length, 'Asserting response has docs as filled array');

                assertProperBook(result.body.data.docs[0], book);
                done();
            })
    });

    it('Responses with correct book for id', function (done) {
        findBookById(function (err, result) {
            if (err) throw  err;

            testUtils.assertBasicSucessMessage(result.body);
            assert(result.body.data._id, book._id);
            assertProperBook(result.body.data, savedBook);

            done();

        }, savedBook, 200)
    });

    it('Updates book with correct details', function (done) {
        updatedBook = Object.assign({}, savedBook);
        updatedBook.name = updatedBook.name + ' New';
        updatedBook.authors.push({name: 'Test Author'});
        updatedBook.authors.push({name: 'Test Next Author'});
        updatedBook.authors.shift();

        request(app)
            .put('/api/book/' + savedBook._id)
            .send(updatedBook)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, result) {
                if (err) throw  err;

                testUtils.assertBasicSucessMessage(result.body);
                assertProperBook(result.body.data, updatedBook);

                assert(result.body.data.authors.length, 2);
                assert(result.body.data.authors[1].name,updatedBook.authors[1].name);

                done();
            })
    });

    it('Deletes book by id', function (done) {
        request(app)
            .delete('/api/book/' + savedBook._id)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, result) {
                if (err) throw err;

                testUtils.assertBasicSucessMessage(result.body);
                assert(result.body.data._id, book._id);

                findBookById(function (err, result) {
                    if (err) throw  err;
                    done();
                }, savedBook, 404)
            });
    });

});
