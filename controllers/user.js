const bcrypt = require('bcrypt');
const _ = require('lodash');
const { UserModel, validateUser, validateUpdateUser } = require('../models/user');

exports.getUsers = async (req, res) => {
	let users = await UserModel.find();
	users = users.map(user => _.pick(user, ['_id', 'first_name', 'last_name', 'email', 'phone']))
	res.json({ success: true, data: users });
};

exports.createUser = async (req, res) => {
	const { error } = validateUser(req);
	if (error) return res.status(400).json({
		success: false,
		message: error.details[0].message
	});

	let user = await UserModel.findOne({ email: req.body.email });
	if (user) return res.status(400).send({
		success: false,
		message: "User is already registered, please try different email address."
	});
	user = new UserModel(_.pick(req.body, ['first_name', 'last_name', 'email', 'password', 'phone', 'designation', 'exp_in_month', 'exp_in_year']));

	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	const token = user.generateUserToken();

	let result = await user.save();
	result = _.omit(user.toObject(), '_id', 'password', 'resetPasswordExpires', 'resetPasswordToken');

	res.header('x-auth-header', token)
		.send({
			success: true,
			message: "User has created successfully.",
			data: result
		});
};


exports.updateUser = async (req, res) => {
	const { error } = validateUpdateUser(req);
	if (error) return res.status(400).json({
		success: false,
		message: error.details[0].message
	});

	const user = await UserModel.findByIdAndUpdate(req.user._id, {
		$set: {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			phone: req.body.phone,
		}
	}, { new: true });

	res.send({
		success: true,
		message: "User has updated successfully.",
		data: _.pick(user, ['_id', 'first_name', 'last_name', 'email', 'phone'])
	});
}