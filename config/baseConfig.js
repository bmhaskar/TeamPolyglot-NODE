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
            path.resolve(__dirname,'..', 'models', 'bookState.js'),
            path.resolve(__dirname,'..', 'controllers', 'book.js'),
            path.resolve(__dirname,'..', 'controllers', 'user.js'),
            path.resolve(__dirname,'..', 'controllers', 'bookWorkflow.js'),
            path.resolve(__dirname,'..', 'controllers', 'bookReport.js'),
            path.resolve(__dirname,'..', 'controllers', 'userReport.js'),
            path.resolve(__dirname,'..', 'controllers', 'bookSearch.js'),
            path.resolve(__dirname,'..', 'controllers', 'authenticate.js'),
            path.resolve(__dirname,'..', 'controllers', 'search.js'),
            path.resolve(__dirname,'..', 'controllers', 'bookState.js')
        ],
        tags: [
            {
                name: 'Book',
                description: 'CRUD Operations for Book'
            },
            {
                name: 'Book Request',
                description: 'Book requesting operations'
            },
            {
                name: 'Book Status',
                description: 'Returns the current status of the book'
            },
            {
                name: 'Book Return and Lost Operations',
                description: 'API\'s for marking book lost or returned'
            },
            {
                name: 'Book Reports',
                description: 'Reporting for Books and reading statistics'
            },
            {
                name: 'Book Search',
                description: 'Search for Books'
            },
            {
                name: 'Search',
                description: 'Abstract search for all entities'
            },
            {
                name: 'User Reports',
                description: 'Reporting for users'
            },
            {
                name: 'User',
                description: 'CRUD Operations for User'
            },
            {
                name: 'Authenticate',
                description: 'Authenticates User'
            }
        ]
    },
    host: process.env.HOST || 'localhost',
    token: {
        secret: 'qwertyuiopasdfghjklzxcvbnm123456',
        expiresIn: '1d'
    },
    eventHandlers: [
      path.resolve(__dirname,'..', 'eventHandlers', 'book','book.js')
    ],
    mailgun: {
        apiKey: 'key-1b62c1396f746a7d58e409c3df7606e4',
        domain: 'sandbox872768a97ba449159c7a23fecd606b3b.mailgun.org'
    },
    fromEmail:"bharat.mhaskar@telentica.com",
    templates: {
        forgotPassword: path.resolve(__dirname,'..', 'emailTemplates', 'forgotPassword.html'),
        resetPassword: path.resolve(__dirname,'..', 'emailTemplates', 'resetPassword.html')
    }
};

module.exports = config;
