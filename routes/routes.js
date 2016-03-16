'use strict';

const express = require('express');
const routes = express.Router();


const bookController = require('../controllers/book');
const userController = require('../controllers/user');

const findUserById = require('../middlewares/findUser/findUserById');
const findUserByName = require('../middlewares/findUser/findUserByName');

routes.route('/books').get(bookController.getBooks);
routes.route('/book').post(bookController.post);

routes.route('/users').get(userController.getUsers);
routes.route('/user').post(userController.post);
routes.route('/user/:id([a-zA-Z0-9]{24})')
    .all(findUserById)
    .get(userController.getUser)
    .put(userController.putForId)
    .delete(userController.deleteById);
routes.route('/user/:username')
    .all(findUserByName)
    .get(userController.getUserByName)
    .put(userController.putForName)
    .delete(userController.deleteByName);

module.exports = routes;
