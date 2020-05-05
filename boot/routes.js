const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const error = require('../middleware/error');

const home = require('../routes/home');
const user = require('../routes/user');
const auth = require('../routes/auth');
const course = require('../routes/course');

module.exports = function (app) {
	app.use(helmet());
	app.use(express.json());
	app.use(compression()); // send compressed response to the client.

	app.use('/api/users', user);
	app.use('/api/auth', auth);
	app.use('/api/courses', course);
	app.use('/', home);

	app.use(express.static('public'));
	app.use(error);
}