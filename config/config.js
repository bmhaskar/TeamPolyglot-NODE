 const path = require('path');
 
 const config = {
 	port: process.env.PORT || 3000,
 	publicDir: path.resolve(__dirname, '..', 'public'),
 	uploadDir: path.resolve(__dirname, '..', 'uploads'),
 	logDir: path.resolve(__dirname, '..', 'logs'),
 	database: {
 		mongoose: 'mongodb://localhost/booksharing'
 	}
};

module.exports = config;