const jwt = require('jsonwebtoken');
const config = require('config');
const roles = require('../roles')

// Verify the token.
exports.verifyToken = function (req, res, next) {
	const token = req.header('x-auth-token');
	if (!token) return res.status(401).json({
		success: false,
		message: 'Access denied. No token provided.'
	});

	try {
		const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
		req.user = decoded;
		next();
	} catch (error) {
		res.status(400).json({ success: false, message: "Invalid token." })
	}
}

// Check user permission.
exports.grantAccess = function (action, resource) {
	return async (req, res, next) => {
		try {
			const permission = roles.can(req.user.role)[action](resource);
			if (!permission.granted) {
				return res.status(401).json({
					error: "You don't have enough permission to perform this action."
				});
			}
			next();
		}
		catch (error) {
			next(error)
		}
	}
};