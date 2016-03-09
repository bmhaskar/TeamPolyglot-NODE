'use strict';

const express = require('express');
const routes = express.Router();

const bookController = require('../controllers/book');

routes.all('*', function(req, res, next) {
	res.type('json'); 
	if(!req.accepts('application/json')) {
		res.status(406).send({'message':'Not Acceptable request.', status: false});
	} else {
		next();
	}
});

routes.get('/books', bookController.get);

module.exports = routes;