const mongoose = require('mongoose');
const logger = require('./logging');
const config = require('config');

const db = config.get('db');

module.exports = function () {
	mongoose.connect(db, { useMongoClient: true }).then(() => {
		logger.info(`Connected to ${db}...`);
	});
}