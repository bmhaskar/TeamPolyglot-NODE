'use strict';

const path = require('path');

const config = {
    port: process.env.PORT || 3000,
    publicDir: path.resolve(__dirname, '..', 'public'),
    uploadDir: path.resolve(__dirname, '..', 'uploads'),
    logDir: path.resolve(__dirname, '..', 'logs'),
    database: {
        mongoose: 'mongodb://localhost/booksharing'
    },
    api: {
        title: 'Book Sharing API',
        version: '1.0.0',
        description: 'This is a backend for distributed library application'
    },
    swagger: {
        version: '2.1.4',
        location: path.resolve(__dirname,'..', 'node_modules', 'swagger-ui'),
        apis: [
            path.resolve(__dirname,'..', 'models', 'author.js'),
            path.resolve(__dirname,'..', 'models', 'user.js'),
            path.resolve(__dirname,'..', 'models', 'book.js'),
            path.resolve(__dirname,'..', 'controllers', 'book.js'),
            path.resolve(__dirname,'..', 'controllers', 'user.js')
        ],
        tags: [
            {
                name: 'Book',
                description: 'CRUD Operations for Book'
            },
            {
                name: 'User',
                description: 'CRUD Operations for User'
            }
        ]
    },
    host: process.env.HOST || 'localhost'
};

module.exports = config;
