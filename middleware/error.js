const logger = require('../boot/logging');

module.exports = function (err, req, res, next) {
	logger.error(err.message, err);
	res.status(500).send({ message: "Something went wrong!", error: err.message });
};