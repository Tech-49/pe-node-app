const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
	first_name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
		trim: true
	},
	last_name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
		trim: true
	},
	email: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50,
		trim: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		maxlength: 255,
		trim: true,
	},
	phone: {
		type: Number,
		required: true,
		minlength: 10,
		maxlength: 12,
		trim: true
	},
	resetPasswordToken: {
		type: String,
		required: false,
		default: ""
	},
	resetPasswordExpires: {
		type: Date,
		required: false,
		default: ""
	},
	role: {
		type: String,
		default: 'registered',
		enum: ['admin', 'registered']
	},
}, { timestamps: true });

userSchema.methods.generateUserToken = function () {
	return jwt.sign({
		_id: this.id,
		role: this.role,
		email: this.email
	}, config.get('jwtPrivateKey'),
		{ expiresIn: '1h' });
};

userSchema.methods.generatePasswordReset = function () {
	this.resetPasswordToken = crypto.randomBytes(30).toString('hex');
	this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

const UserModel = mongoose.model('User', userSchema);

function validateLogin(req) {
	const schema = Joi.object({
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(6).max(255).required(),
	});
	return schema.validate(req.body);
}

function validateUserRegistration(req) {
	const schema = Joi.object({
		first_name: Joi.string().min(3).max(50).required(),
		last_name: Joi.string().min(3).max(50).required(),
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(6).max(255).required(),
		phone: Joi.number().min(10).required()
	});
	return schema.validate(req.body);
}

function validateUpdateUser(req) {
	const schema = Joi.object({
		first_name: Joi.string().min(3).max(50).required(),
		last_name: Joi.string().min(3).max(50).required(),
		phone: Joi.number().min(10).required()
	});
	return schema.validate(req.body);
}

exports.UserModel = UserModel;
exports.validateUser = validateUserRegistration;
exports.validate = validateLogin;
exports.validateUpdateUser = validateUpdateUser;