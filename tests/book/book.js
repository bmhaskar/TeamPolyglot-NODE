'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
const assert = require('assert');

const testUtils = require('../../utils/testUtils');
let app = {};

describe('Book api', function () {
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
});
