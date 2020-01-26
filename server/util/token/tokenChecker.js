const fs = require('fs');
const jwt = require('jsonwebtoken');

var env = process.env.NODE_ENV || 'development';
const credentials = require('./../../config/credentials')[env];

const queueDB = require("./../../extern/mongo/queueDB");

const tokenKey = credentials.jwt.hostAccessTokenSecret;

module.exports = async (req, res, next) => {
	let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
	let queueID = parseInt(req.headers['x-queue-id']);

	if(!token || !token.startsWith('Bearer ') || !queueID) {
		return res.status(403).send({
			"error": true,
			"message": 'No token provided.'
		});
	}

	token = token.slice(7, token.length).trimLeft();

	let salt = (await queueDB.queueExists(queueID)).queueTokenSalt;

	jwt.verify(token, tokenKey + salt, function (err, decoded) {
		if (err) {
			if(err instanceof jwt.TokenExpiredError) {
				return res.status(401).json({"error": {
					"message" : "Error validating access token: Session expired",
						"type": "AuthException",
						"code": 1,
						"subcode": 1
					}})
			}

			return res.status(401).json({"error": {
					"message" : "Error validating access token: Unauthorized access",
					"type": "AuthException",
					"code": 1,
					"subcode": 2
				}}).send();
		}
		req.decoded = decoded;
		next();
	});
};
