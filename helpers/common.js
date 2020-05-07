var ObjectId = require('mongoose').Types.ObjectId;

exports.validObjectId = function (id) {
	return ObjectId.isValid(id);
}