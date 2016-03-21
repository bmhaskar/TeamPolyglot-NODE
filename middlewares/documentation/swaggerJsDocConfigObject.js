'use strict';

const swaggerJsDoc = require('swagger-jsdoc');
const config = require('../../config/config');

const options = {
	swaggerDefinition: {
		info: {
			title:  config.api.title,
			version: config.api.version,
			description: config.api.description
		},
		tags: config.swagger.tags,
		basePath: '/api'
	},
	apis: config.swagger.apis
}

module.exports = swaggerJsDoc(options)