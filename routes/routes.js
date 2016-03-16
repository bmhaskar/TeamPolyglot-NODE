'use strict';

const express = require('express');
const routes = express.Router();


const bookController = require('../controllers/book');
const userController = require('../controllers/user');

routes.route('/books').get(bookController.getBooks);
routes.route('/book').post(bookController.post);

routes.route('/users').get(userController.getUsers);
routes.route('/user').post(userController.post);
routes.route('/user/:id([a-zA-Z0-9]{24})').get(userController.getUser);

module.exports = routes;
