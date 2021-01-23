const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		fname: String,
		lname: String,
		email: { type: String, sparse: true, lowercase: true },
		password: { type: String },
		stravaEnabled: { type: Boolean, default: false},
		stravaRefreshToken: String,
		stravaAccessToken: String,
		stravaExpiresAt: Number,
		stravaExpiresIn: Number,
		stravaAthleteData: String
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);