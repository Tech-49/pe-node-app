// require('express-async-errors');
const winston = require('winston');

const logger = winston.createLogger({
	format: winston.format.json(),
	transports: [
		new winston.transports.File({
			filename: 'error.log',
			handleExceptions: true,
			level: 'error'
		}),
		new winston.transports.Console({
			level: 'info',
			handleExceptions: true,
		})
	],
	exitOnError: true
});

module.exports = logger;