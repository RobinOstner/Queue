const jwt = require('jsonwebtoken');
const tokenHandler = require('../../util/token/tokenHandler');
const tokenChecker = require('../../util/token/tokenChecker');
const express = require("express");

const router = express.Router();

router.post('/refreshToken', (req, res) => {
	const postData = req.body;

	if (!((postData.refreshToken) && (tokenHandler.tokenExist(postData.refreshToken)))) {
		res.status(404).send('Invalid request')
	}

	let token = tokenHandler.tokenRefresh(postData.refreshToken);
	const response = {
		"token": token,
	};

	res.status(200).json(response);
});

//ToDo remove debug function
router.get('/isAuthenticated', tokenChecker, (req, res) => {
	res.json({"message": "Welcome"});
});

//ToDo remove debug function
router.get('/customHeader', (req, res) => {
	console.log(req.headers);

	let isHost = req.headers['x-is-host-flag'];
	console.log(isHost);

	res.json({"message": "Welcome"});
});

module.exports = router;