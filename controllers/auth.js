const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const config = require('config');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.get('SENDGRID_API_KEY'));
const { UserModel, validate } = require('../models/user');

exports.loginUser = async (req, res) => {

	const { error } = validate(req.body);
	if (error) {
		return res.status(400).json({
			success: false,
			message: error.details[0].message
		});
	}

	let user = await UserModel.findOne({ email: req.body.email });
	if (!user) {
		return res.status(400).json({
			success: false,
			message: "Invalid email address or password."
		});
	}

	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) {
		return res.status(400).json({
			success: false,
			message: "Invalid email address or password."
		});
	}

	const token = user.generateUserToken();
	res.json({ access_token: token });
};

exports.recoverPassword = async (req, res) => {

	const schema = Joi.object({
		email: Joi.string().min(5).max(255).required().email()
	});

	const { error } = schema.validate(req.body);

	if (error) return res.status(400).json({
		success: false,
		message: error.details[0].message
	});

	let user = await UserModel.findOne({ email: req.body.email });
	if (!user) return res.status(401).json({ success: false, message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.' });

	//Generate and set password reset token
	user.generatePasswordReset();
	user = await user.save();
	let link = `http://${req.headers.host}/api/auth/reset/${user.resetPasswordToken}`;
	console.log("exports.recoverPassword -> link", link);
	const message = {
		to: user.email,
		from: "noreply@hardikraval.in",
		subject: "Password change request",
		text: `Hi ${user.first_name} \n
		Please click on the following link ${link} to reset your password. \n\n
		If you did not request this, please ignore this email and your password will remain unchanged.\n`,
	};

	sgMail
		.send(message)
		.then(() => {
			res.json({ success: true, message: 'A reset email has been sent to ' + user.email + '.' });
		}, error => {
			return res.status(500).json({ message: error.message });
		});
};

exports.resetPassword = async (req, res) => {
	let user = await UserModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
	if (!user) return res.status(401).json({ success: false, message: 'Password reset token is invalid or has expired.' });

	const schema = Joi.object({
		password: Joi.string().min(6).max(255).required(),
	});
	
	const {error} = schema.validate(req.body);
	
	if(error) return res.status(400).json({
		success:false,
		message:error.details[0].message
	});

	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(req.body.password, salt);
	user.resetPasswordToken = undefined;
	user.resetPasswordExpires = undefined;

	user.save((err) => {
		if (err) return res.status(500).json({ message: err.message });

		// send email
		const message = {
			to: user.email,
			from: "alert@hardikraval.in",
			subject: "Your password has been changed",
			text: `Hi ${user.first_name} \n 
			This is a confirmation that the password for your account ${user.email} has just been changed.\n`
		};
		sgMail
		.send(message)
		.then(() => {
			res.status(200).json({ success: true, message: 'Your password has been updated.' });
		}, error => {
			return res.status(500).json({ message: error.message });
		});
		
	});
};