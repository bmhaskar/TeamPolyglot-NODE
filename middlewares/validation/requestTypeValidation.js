'use strict';

const sendResponse = require('../../utils/sendResponse');

const requestTypeValidation = function(req, res, next) {
	if(!req.accepts('application/json')) {
		sendResponse(res, {'message':'Not Acceptable request.', status: false}, 406);
	} else {
		next();
	}
};

module.exports = requestTypeValidation;