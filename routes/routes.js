'use strict';

const express = require('express');
const routes = express.Router();


const bookController = require('../controllers/book');




routes.get('/books', bookController.get);
module.exports = routes;