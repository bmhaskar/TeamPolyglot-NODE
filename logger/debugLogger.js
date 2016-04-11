'use strict';
const winston = require('winston');
const path = require('path');
const winstonDailyRotate =  require('winston-daily-rotate-file');

const config = require('../config/config');

const dubugLogFileTransport = new (winstonDailyRotate)({
    name: 'debug-log-file',
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: false,
    datePattern: '.yyyy-MM-ddTMM-HH.log',
    filename: path.join(config.logDir , "debug")
});

const infoLogFileTransport = new (winstonDailyRotate)({
    name: 'info-log-file',
    level: 'info',
    handleExceptions: true,
    json: true,
    colorize: false,
    datePattern: '.yyyy-MM-ddTMM-HH.log',
    filename: path.join(config.logDir , "info")
});

const errorLogFileTransport = new (winstonDailyRotate)({
    name: 'error-log-file',
    level: 'error',
    handleExceptions: true,
    json: true,
    colorize: false,
    datePattern: '.yyyy-MM-ddTMM-HH.log',
    filename: path.join(config.logDir , "error")
});

const makeLogger = function (){

    winston.addColors({
        debug: 'green',
        info: 'cyan',
        silly: 'purple',
        trace: 'magenta',
        verbose: 'magenta',
        warn: 'yellow',
        warning: 'yellow',
        error: 'red'
    });

    var logger = new winston.Logger({
        transports: [
            new(winston.transports.Console)({
                level: 'silly',
                handleExceptions: true,
                prettyPrint: true,
                silent: false,
                timestamp: true,
                colorize: true,
                json: false
            }),
            dubugLogFileTransport,
            infoLogFileTransport,
            errorLogFileTransport,

        ],
        exceptionHandlers: [
            new(winston.transports.Console)({
                level: 'warn',
                handleExceptions: true,
                prettyPrint: true,
                silent: false,
                timestamp: true,
                colorize: true,
                json: false
            }),
            errorLogFileTransport
        ],
        exitOnError: false
    });
    logger.setLevels({
        silly: 0,
        debug: 1,
        verbose: 2,
        trace : 2,
        info: 3,
        warn: 4,
        warning: 4,
        error: 5
    });

    return logger;
};

module.exports = makeLogger();


