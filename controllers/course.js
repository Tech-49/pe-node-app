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

	const course = new CourseModel(_.pick(req.body, ['title', 'description', 'author', 'price']));
	const result = await course.save();

	res.send({
		success: true,
		message: "User has created successfully.",
		data: result
	});
};