'use strict';

const express = require('express');
const routes = express.Router();


const bookController = require('../controllers/book');
const userController = require('../controllers/user');

const findUserById = require('../middlewares/findUser/findUserById');
const findUserByName = require('../middlewares/findUser/findUserByName');
const findBookById = require('../middlewares/findBook/findBookById');

routes.route('/books').get(bookController.getBooks);
routes.route('/book').post(bookController.post);
routes.route('/book/:id')
    .all(findBookById)
    .get(bookController.getBookById)
    .put(bookController.put)
    .delete(bookController.delete);

routes.route('/users').get(userController.getUsers);
routes.route('/user').post(userController.post);
routes.route('/user/id/:id([a-zA-Z0-9]{24})')
    .all(findUserById)
    .get(userController.getUser)
    .put(userController.putForId)
    .delete(userController.deleteById);
routes.route('/user/username/:username')
    .all(findUserByName)
    .get(userController.getUserByName)
    .put(userController.putForName)
    .delete(userController.deleteByName);

module.exports = routes;
