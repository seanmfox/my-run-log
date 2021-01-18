const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
const router = express.Router();

const PORT = process.env.PORT || 3001;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));

app.use(cookieParser());

let cookieOptions = {};

if (process.env.NODE_ENV === 'production') {
	cookieOptions = { httpOnly: true, secure: true };
} else {
	cookieOptions = { httpOnly: true };
}


if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(`${__dirname}/../frontend/build`));

	// Handle React routing, return all requests to React app
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
	});
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));