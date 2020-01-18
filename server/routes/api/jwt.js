const jwt = require('jsonwebtoken');
const fs = require('fs')
const express = require("express");

var env = process.env.NODE_ENV || 'development';
const credentials = require('../../config/credentials')[env]

const router = express.Router();

//ToDo shouldnt be an endpoint move to authentication
router.get('/getToken', (req, res) => {
	let privateKey = fs.readFileSync('./server/config/keys/key.pem', 'utf8');
	let token = jwt.sign({ "body": "stuff" }, privateKey, { algorithm: 'HS256'});
	res.send(token);
});

//ToDo remove debug function
router.get('/isAuthenticated', isAuthenticated, (req, res) => {
	res.json({ "message" : "Welcome" })
});

function isAuthenticated(req, res, next) {
	if (typeof req.headers.authorization !== "undefined") {
		let token = req.headers.authorization.split(" ")[1];
		let privateKey = fs.readFileSync('./server/config/keys/key.pem', 'utf8');
		jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {

			if (err) {
				res.status(500).json({ error: "Not Authorized" });
				throw new Error("Not Authorized");
			}
			return next();
		});
	} else {
		res.status(500).json({ error: "Not Authorized" });
		throw new Error("Not Authorized");
	}
}

module.exports = router;