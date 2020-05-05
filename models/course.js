const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const courseSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
		trim: true
	},
	description: {
		type: String,
		required: true,
		minlength: 10,
		maxlength: 255,
		trim: true
	},
	author: {
		type: new mongoose.Schema({
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
		}),
		required: true
	},
	price: {
		type: Number,
		required: true,
	}
}, { timestamps: true });

const CourseModel = mongoose.model('Course', courseSchema);

function validateCourse(req) {
	const schema = Joi.object({
		title: Joi.string().min(3).max(50).required(),
		description: Joi.string().min(10).max(255).required(),
		authorId: Joi.objectId().required(),
		price: Joi.number().required()
	});
	return schema.validate(req.body);
}

exports.CourseModel = CourseModel;
exports.validate = validateCourse;