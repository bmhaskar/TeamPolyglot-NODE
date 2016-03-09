'use strict';

const debugLogger = require('../logger/logger').debugLogger;

exports.get = function(req, res) {
	
	debugLogger.debug('Test debugLogger');
	res.json({
		name: 'Test Book'
	});
};