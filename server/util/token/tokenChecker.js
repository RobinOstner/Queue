const jwt = require('jsonwebtoken');
const Queue = require('../../model/Queue');

var tokenChecker = {};

tokenChecker.clientAccess = async (req, res, next) => {
	let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
	let queueID = parseInt(req.headers['x-queue-id']);

	if(!token || !token.startsWith('Bearer ') || !queueID) {
		return res.status(403).send({
			"error": true,
			"message": 'No token provided.'
		});
	}

	token = token.slice(7, token.length).trimLeft();

	let salt = (await Queue.findOne({queueId: queueID})).tokenSalt;

	jwt.verify(token, process.env.CLIENT_ACCESS_TOKEN_SECRET + salt, function (err, decoded) {
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

tokenChecker.clientRefresh = async (req, res, next) => {
	let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
	let queueID = parseInt(req.headers['x-queue-id']);

	if(!token || !token.startsWith('Bearer ') || !queueID) {
		return res.status(403).send({
			"error": true,
			"message": 'No token provided.'
		});
	}

	token = token.slice(7, token.length).trimLeft();

	let salt = (await Queue.findOne({queueId: queueID})).tokenSalt;

	jwt.verify(token, process.env.CLIENT_ACCESS_TOKEN_SECRET + salt, function (err, decoded) {
		if (err) {
			if(err instanceof jwt.TokenExpiredError) {
				next();
			}
		}
		req.decoded = decoded;
	});

	return res.status(401).json({"error": {
		"message" : "Error validating access token: Unauthorized access",
		"type": "AuthException",
		"code": 1,
		"subcode": 2
	}}).send();
};

tokenChecker.hostAccess = async (req, res, next) => {
	let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
	let queueID = parseInt(req.headers['x-queue-id']);

	if(!token || !token.startsWith('Bearer ') || !queueID) {
		return res.status(403).send({
			"error": true,
			"message": 'No token provided.'
		});
	}

	token = token.slice(7, token.length).trimLeft();

	let salt = (await Queue.findOne({queueId: queueID})).tokenSalt;

	jwt.verify(token, process.env.HOST_ACCESS_TOKEN_SECRET + salt, function (err, decoded) {
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

tokenChecker.hostRefresh = async (req, res, next) => {
	let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
	let queueID = parseInt(req.headers['x-queue-id']);

	if(!token || !token.startsWith('Bearer ') || !queueID) {
		return res.status(403).send({
			"error": true,
			"message": 'No token provided.'
		});
	}

	token = token.slice(7, token.length).trimLeft();

	let salt = (await Queue.findOne({queueId: queueID})).tokenSalt;

	jwt.verify(token, process.env.HOST_ACCESS_TOKEN_SECRET + salt, function (err, decoded) {
		if (err) {
			if(err instanceof jwt.TokenExpiredError) {
				next();
			}
		}
		req.decoded = decoded;
	});

	return res.status(401).json({"error": {
		"message" : "Error validating access token: Unauthorized access",
		"type": "AuthException",
		"code": 1,
		"subcode": 2
	}}).send();
};

module.exports = tokenChecker;
