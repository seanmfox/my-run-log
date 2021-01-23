const express = require('express');
const router = express.Router();
const userHelpers = require('../helpers/users');

router.route('/').post(userHelpers.createUser);

module.exports = router;