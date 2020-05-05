const express = require('express');
const app = express();

const logger = require('./boot/logging');

// Handle exception for asynchronous call.
process.on('unhandledRejection', (error) => {
	throw error;
});

require('./boot/routes')(app);
require('./boot/db')();

const port = process.env.PORT || 3002;
app.listen(port, () => logger.info(`Listing on port ${port}`));