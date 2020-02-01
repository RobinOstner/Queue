const jwt = require('jsonwebtoken');
const Queue = require('../../model/Queue');
const cookieParser = require('cookie-parser')

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

	let salt = (await Queue.findOne({queueID: queueID})).tokenSalt;

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
		} else {
			req.decoded = decoded;
			next();
		}
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

	let salt = (await Queue.findOne({queueID: queueID})).tokenSalt;

	var isValiedRequest = false;
	jwt.verify(token, process.env.CLIENT_ACCESS_TOKEN_SECRET + salt, function (err, decoded) {
		if (err) {
			if(err instanceof jwt.TokenExpiredError) {
				isValiedRequest = true;
				next();
			}
		} else {
			isValiedRequest = true;
			next();
		}
		req.decoded = decoded;
	});

	if(isValiedRequest) {
		return;
	}

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

	let salt = (await Queue.findOne({queueID: queueID})).tokenSalt;

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
		} else {
			req.decoded = decoded;
			next();
		}
	});
};

tokenChecker.hostRefresh = async (req, res, next) => {
	if(!req.headers.cookie) {
		return res.status(403).send({
			"error": true,
			"message": 'No cookie provided.'
		});
	}

	let token = req.cookies.refreshToken;
	let queueID = parseInt(req.headers['x-queue-id']);

	if(!token || !token.startsWith('Bearer ') || !queueID) {
		return res.status(403).send({
			"error": true,
			"message": 'No token provided.'
		});
	}

	token = token.slice(7, token.length).trimLeft();

	let salt = (await Queue.findOne({queueID: queueID})).tokenSalt;

	var validRequest = false;
	jwt.verify(token, process.env.HOST_REFRESH_TOKEN_SECRET + salt, function (err, decoded) {
		if (err) {
			if(err instanceof jwt.TokenExpiredError) {
				return res.status(401).json({"error": {
					"message" : "Error validating refresh token: Session expired",
						"type": "AuthException",
						"code": 1,
						"subcode": 3
					}})
			}
		} else {
			//token valid up to refresh
			validRequest = true;
			next();
		}

		req.decoded = decoded;
	});

	if(validRequest) {
		return;
	}

	return res.status(401).json({"error": {
		"message" : "Error validating access token: Unauthorized access",
		"type": "AuthException",
		"code": 1,
		"subcode": 2
	}}).send();
};

tokenChecker.hostAndClientAccess = async (req, res, next) => {
	let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
	let queueID = parseInt(req.headers['x-queue-id']);

	if(!token || !token.startsWith('Bearer ') || !queueID) {
		return res.status(403).send({
			"error": true,
			"message": 'No token provided.'
		});
	}

	token = token.slice(7, token.length).trimLeft();

	let salt = (await Queue.findOne({queueID: queueID})).tokenSalt;

	var checkPassed = false;
	jwt.verify(token, process.env.CLIENT_ACCESS_TOKEN_SECRET + salt, function (err, decoded) {
		if (err) {
			if(err instanceof jwt.TokenExpiredError) {
				return res.status(401).json({"error": {
					"message" : "Error validating access token: Session expired",
						"type": "AuthException",
						"code": 1,
						"subcode": 1
					}});
			}

			console.log(err);
		} else {
			req.decoded = decoded;
			checkPassed = true;
			next();
		}
	});

	if(checkPassed) {
		return;
	}

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

			console.log(err);

		} else {
			checkPassed = true;
			req.decoded = decoded;
			next();
		}
	});

	if(checkPassed) {
		return;
	}

	return res.status(401).json({"error": {
		"message" : "Error validating access token: Unauthorized access",
		"type": "AuthException",
		"code": 1,
		"subcode": 2
	}}).send();
}

module.exports = tokenChecker;
