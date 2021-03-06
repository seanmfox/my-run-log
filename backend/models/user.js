const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema(
	{
		name: String,
		distance: Number,
		date: Date,
		duration: Number,
		_id: Number
	}
)

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
		stravaAthleteId: Number,
		activities: [ActivitySchema]
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
// module.exports = mongoose.model('Activity', ActivitySchema);