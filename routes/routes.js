'use strict';

const express = require('express');
const routes = express.Router();


const bookController = require('../controllers/book');
const userController = require('../controllers/user');

const authenticationController = require('../controllers/authenticate');
const bookStateController = require('../controllers/bookState');
const searchController = require('../controllers/search');

const authenticateRequest = require('../middlewares/authenticate/authenticate');
const findUserById = require('../middlewares/findUser/findUserById');
const findUserByName = require('../middlewares/findUser/findUserByName');
const findBookById = require('../middlewares/findBook/findBookById');
const findBookStateByBookId = require('../middlewares/findBookState/findBookStateByBookId');

const bookWorkflow = require('./bookWorkflow');

routes.route('/authenticate/login').post(authenticationController.login);
routes.route('/authenticate/revoke-token/:token').post(authenticateRequest, authenticationController.revokeToken);
routes.route('/authenticate/logout').post(authenticateRequest, authenticationController.logout);
routes.route('/authenticate/forgot-password/:username').post(findUserByName, authenticationController.forgotPassword);
routes.route('/authenticate/reset-password/:token').get(authenticationController.resetPassword);


routes.route('/books').get(authenticateRequest, bookController.getBooks);
routes.route('/book').post(authenticateRequest, bookController.post);
routes.route('/book/:bookId')
    .all(findBookById, authenticateRequest)
    .get(bookController.getBookById)
    .put(bookController.put)
    .delete(bookController.delete);

routes.route('/book/status/:bookId').get(authenticateRequest, findBookStateByBookId, bookStateController.currentStateOfBook);
bookWorkflow(routes);


routes.route('/users').get(userController.getUsers);
routes.route('/user').post(userController.post);
routes.route('/user/id/:userId([a-zA-Z0-9]{24})')
    .all(authenticateRequest, findUserById)
    .get(userController.getUser)
    .put(userController.putForId)
    .delete(userController.deleteById);
routes.route('/user/username/:username')
    .all(authenticateRequest, findUserByName)
    .get(userController.getUserByName)
    .put(userController.putForName)
    .delete(userController.deleteByName);

routes.route('/search').get(authenticateRequest, searchController.search);

module.exports = routes;
