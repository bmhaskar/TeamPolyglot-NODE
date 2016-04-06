'use strict';

const winston = require('winston');
const expressWinston = require('express-winston');
const path = require('path');
const winstonDailyRotate =  require('winston-daily-rotate-file');

const config = require('../../config/config');

const consoleTransport = new winston.transports.Console({
      	json: true,
    	colorize: true
    });

const errorFileTransport = new (winstonDailyRotate)({
			name: 'error-file',      		
      		level: 'error',
			datePattern: '.yyyy-MM-ddTMM-HH.log',
      		handleExceptions: true,
            json: true,
            colorize: false,
  			filename: path.join(config.logDir , "error")
	});
const accessLogFileTransport = new (winstonDailyRotate)({
			name: 'access-log-file',      		
      		level: 'info',
      		handleExceptions: true,
            json: true,
            colorize: false,
			datePattern: '.yyyy-MM-ddTMM-HH.log',
  			filename: path.join(config.logDir , "access")
	});




//@todo: Find a better approach to separate logger's based on env
let genericLogger = {}, errorLogger = {};
if(config.env != 'test') {
	genericLogger = new (winston.Logger)({
		transports: [
			consoleTransport,
			accessLogFileTransport
		],
		exitOnError: false
	});

	errorLogger = new (winston.Logger)({
		transports: [
			consoleTransport,
			errorFileTransport
		],
		exitOnError: false
	});
} else {
	genericLogger = new (winston.Logger)({
		transports: [
			accessLogFileTransport
		],
		exitOnError: false
	});

	errorLogger = new (winston.Logger)({
		transports: [
			errorFileTransport
		],
		exitOnError: false
	});
}
  
exports.genericLogger = expressWinston.logger({
		winstonInstance: genericLogger,      
		msg: "HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}",
		expressFormat: true, 
		colorStatus: true		
  	});


exports.errorLogger = expressWinston.errorLogger({
		winstonInstance: errorLogger,     
		dumpExceptions: true,
		showStack: true
	});

