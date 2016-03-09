'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const config = require('./config/config');
const routes = require('./routes/routes');
const logger = require('./logger/logger');

const user = require('./models/user');
mongoose.connect(config.database.mongoose);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(logger.genericLogger);

app.use('/api', routes);
app.use('/api/static', express.static(config.publicDir));

app.use(function(req, res) {
	res.status(404).send({'message': 'Sorry, we cannot find that!', status: false}); 
});

app.use(logger.errorLogger);

app.use(function(err, req, res, next) {
	res.status(500).send({'message': 'Internal server error.', status: false}); 
});

app.listen(config.port, function() {
	console.log('Book sharing application started on port '+ config.port)
});