'use strict';

const env = process.env.NODE_ENV || 'dev';
const baseConfig = require('./baseConfig');

//@todo: Add some defensive coding by checking for existence of environment specific config file.
const overridingConfig = require('./'+env+'Config');

let config = {};

Object.assign(config, baseConfig, overridingConfig);

config.env = env;

module.exports = config;