'use strict';
const requestTypeValidation = function(req, res, next) {
	if(!req.accepts('application/json')) {
		res.status(406).send({'message':'Not Acceptable request.', status: false});
	} else {
		next();
	}
};

module.exports = requestTypeValidation;