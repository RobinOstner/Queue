const jwt = require('jsonwebtoken');
const tokenHandler = require('../../util/token/tokenHandler');
const tokenChecker = require('../../util/token/tokenChecker');
const express = require("express");
var cookieParser = require('cookie-parser')
const queueDB = require("./../../extern/mongo/queueDB");


var env = process.env.NODE_ENV || 'development';
const credential = require('./../../config/credentials')[env];

const router = express.Router();
router.use(cookieParser());

//ToDo blacklist old refreshTokens
router.post('/refreshToken', async (req, res) => {

	let refreshToken = req.cookies.refreshToken;
	let queueId = parseInt(req.headers['x-queue-id']);

	if (!refreshToken || !queueId) {
		res.status(404).send('Invalid apiRequest')
	}

	let salt = (await queueDB.queueExists(queueId)).queueTokenSalt;

	var error = false;
	jwt.verify(refreshToken, credential.jwt.hostRefreshTokenSecret + salt, function (err, decoded) {
		if (err) {
			error = true;
			console.log(err);
			if(err instanceof jwt.TokenExpiredError) {
				return res.status(401).json({"error": {
						"message" : "Error validating refresh token: Session expired",
						"type": "AuthException",
						"code": 1,
						"subcode": 3
					}})
			}

			return res.status(401).json({"error": {
					"message" : "Error validating refresh token: Unauthorized access",
					"type": "AuthException",
					"code": 1,
					"subcode": 4
				}})
		}
	});

	if(error) {
		return res.send();
	}

	let accessTokens = tokenHandler.createInitialTokenSet(salt);

	res.cookie("refreshToken", accessTokens.refreshToken,
		{
			expires: new Date(Date.now() + credential.jwt.refreshTokenLife),
			httpOnly: true,
			secure: true
		});

	const response = {
		"token": accessTokens.token
	};

	res.status(200).json(response).send();
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