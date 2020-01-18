const fs = require('fs');
const jwt = require('jsonwebtoken');

var env = process.env.NODE_ENV || 'development';
const credentials = require('./../config/credentials')[env];

const tokenKey = fs.readFileSync('./server/config/keys/jwt_key.pem', 'utf8');

module.exports = (req, res, next) => {
	let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;

	console.log(req);
	console.log(token);

	if(!token) {
		return res.status(403).send({
			"error": true,
			"message": 'No token provided.'
		});
	}

	token = token.slice(7, token.length).trimLeft();

	jwt.verify(token, tokenKey, function(err, decoded) {
		if (err) {
			console.log(err);
			return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
		}
		req.decoded = decoded;
		next();
	});
};
