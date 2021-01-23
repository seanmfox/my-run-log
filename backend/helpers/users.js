const User = require('../models').User;
const bcrypt = require('bcrypt');

exports.createUser = (req, res) => {
	const user = new User();
	const { fname, lname, email, password } = req.body;
	if (!fname || !lname || !email || !password) {
		return res.json({
			success: false,
			error: 'Not all fields have been completed'
		});
	}
	bcrypt.hash(password, 10).then(hash => {
		user.fname = fname;
		user.lname = lname;
		user.email = email;
		user.password = hash;
		user.save(err => {
			if (err) return res.json({ success: false, error: err });
			return res.json({ success: true });
		});
	});
};

module.exports = exports;