const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('./models').User;
const userRoutes = require('./routes/users');
const axios = require('axios');

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


router.post('/usersignin/', (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		// we should throw an error. we can do this check on the front end
		return res.json({
			success: false,
			error: 'You must provide a email and password'
		});
	}
	User.findOne({ email: email.toLowerCase() }, (err, doc) => {
		if (!doc)
			return res.json({
				success: false,
				error: 'The email or password do not match.  Please try again.'
			});
		return bcrypt.compare(password, doc.password).then(response => {
			if (!response)
				return res.json({
					success: false,
					error: 'The email or password do not match.  Please try again.'
				});
			return res.json({
				token: jwt.sign(
					{
						userId: doc._id,
					},
					process.env.SECRET_KEY
				),
				success: true,
				user: {
					userId: doc._id,
					fname: doc.fname,
					lname: doc.lname,
					email: doc.email,
				}
			});
		});
	});
});

//Authenticate user if already signed in
router.get('/authuser', (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
		User.findById(decoded.userId, (err, user) => {
			if (err) return res.json({ success: false, error: err });
			return res.json({
				success: true,
				user: {
					userId: user._id,
					fname: user.fname,
					lname: user.lname,
					email: user.email,
					stravaEnabled: user.stravaEnabled,
					stravaRefreshToken: user.stravaRefreshToken,
					stravaAccessToken: user.stravaAccessToken,
					stravaExpiresAt: user.stravaExpiresAt,
					stravaExpiresIn: user.stravaExpiresIn,
					stravaAthleteData: user.stravaAthleteData
				}
			});
		});
	});
});

router.post('/strava/callback', (req, res) => {

	axios.post(`https://www.strava.com/oauth/token`, {client_id: 26482, client_secret: process.env.STRAVA_SECRET, code: req.body.code, grant_type: 'authorization_code'})
	.then((response) => {
		User.findById(req.body.userId, (error, user) => {
			user.stravaEnabled = true;
			user.stravaRefreshToken = response.data.refresh_token;
			user.stravaAccessToken = response.data.access_token;
			user.stravaExpiresAt = response.data.expires_at;
			user.stravaExpiresIn = response.data.expires_in;
			user.stravaAthleteData = JSON.stringify(response.data.athlete);
			user.save(err => {
				if (err) return res.json({ success: false, error: err });
				return res.json({ success: true });
			})
		})
	})
	.catch(error => {
		console.log(error.response.data.errors)
		return res.json({success: false})
	})
})

router.post('/strava/refresh', (req, res) => {
	console.log('requesting refresh token')
	console.log(req.body)
	axios.post(`https://www.strava.com/oauth/token`, {client_id: 26482, client_secret: process.env.STRAVA_SECRET, refresh_token: req.body.refreshToken, grant_type: 'refresh_token'})
	.then((response) => {
		User.findById(req.body.userId, (error, user) => {
			user.stravaEnabled = true;
			user.stravaRefreshToken = response.data.refresh_token;
			user.stravaAccessToken = response.data.access_token;
			user.stravaExpiresAt = response.data.expires_at;
			user.stravaExpiresIn = response.data.expires_in;
			user.stravaAthleteData = JSON.stringify(response.data.athlete);
			user.save(err => {
				if (err) return res.json({ success: false, error: err });
				return res.json({ success: true, data: {
					stravaRefreshToken: response.data.refresh_token,
					stravaAccessToken: response.data.access_token,
					stravaExpiresAt: response.data.expires_at,
					stravaExpiresIn: response.data.expires_in
				} });
			})
		})
	})
	.catch(error => {
		console.log(error)
		console.log(error.response.data.errors)
		return res.json({success: false})
	})
})

// router.get('/strava/webhook', (req, res) => {


// 	axios.post(`https://www.strava.com/api/v3/push_subscriptions`, {'hub.challenge': req.body.challenge})
// 	.then((response) => {
// 		return res.json({success: true})
// 	})
// })

router.post('/strava/webhook', (req, res) => {

  console.log("webhook event received!", req.query, req.body);
  res.status(200).send('EVENT_RECEIVED');
})

app.use('/api', router);
app.use('/api/users', userRoutes);

if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(`${__dirname}/../frontend/build`));

	app.get('/api/strava/webhook', (req, res) => {
		let mode = req.query['hub.mode'];
		let challenge = req.query['hub.challenge'];
		if (mode === 'subscribe') {     
			console.log('WEBHOOK_VERIFIED');
			res.json({"hub.challenge":challenge});  
		}
	})

	// Handle React routing, return all requests to React app
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
	});
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));