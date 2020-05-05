const { CourseModel, validate } = require('../models/course');
const _ = require('lodash');

exports.getCourses = async function (req, res) {
	let courses = await CourseModel.find();
	res.json({ success: true, data: courses });
}

exports.createCourse = async (req, res) => {
	const { error } = validate(req);
	if (error) return res.status(400).json({
		success: false,
		message: error.details[0].message
	});

	const user = await UserModel.findById(req.body.authorId);
	if (!user) return res.send({ error: 'User not found.' }).status(400);

	const course = new CourseModel({
		title: req.body.title,
		description: req.body.description,
		author: {
			_id: user._id,
			first_name: user.first_name,
			last_name: user.last_name
		},
		price: req.body.price
	});
	const result = await course.save();

	res.send({
		success: true,
		message: "Course has created successfully.",
		data: result,
	});
};

exports.updateCourse = async (req, res) => {

}