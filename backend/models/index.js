const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DB_URI, { useUnifiedTopology: true, useNewUrlParser: true});

mongoose.Promise = Promise;

module.exports.User = require('./user');