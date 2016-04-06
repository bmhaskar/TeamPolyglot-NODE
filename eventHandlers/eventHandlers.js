'use strict';

const config = require('../config/config');

const includeFiles = function(path) {
    require(path);
};

const addEventHandlers = function() {
  config.eventHandlers.map(includeFiles);
};

module.exports = addEventHandlers;