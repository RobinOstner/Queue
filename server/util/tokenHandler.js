const fs = require('fs')
const jwt = require('jsonwebtoken');

var env = process.env.NODE_ENV || 'development';
const credentials = require('./../config/credentials')[env];

const tokenKey = fs.readFileSync('./server/config/keys/jwt_key.pem', 'utf8');
const refreshKey = fs.readFileSync('./server/config/keys/refresh_key.pem', 'utf8');

const tokenList = {};

module.exports = {
	createInitialTokenSet: function () {
		let tokenSet = {
			"token": createToken(tokenKey, credentials.jwt.tokenLife),
			"refreshToken": createToken(refreshKey, credentials.jwt.refreshTokenLife)
		};

		tokenList[tokenSet.refreshToken] = tokenSet;

		return tokenSet;
	},
	tokenExist: function (refreshToken) {
		return tokenList[refreshToken];
	},
	tokenRefresh: function (refreshToken) {
		let newToken = createToken(tokenKey, credentials.jwt.tokenLife);

		tokenList[refreshToken].token = newToken;

		return newToken;
	},
};

function createToken(key, expTime) {
	let token = jwt.sign({exp: Math.floor(Date.now() / 1000) + expTime},
		key, {algorithm: 'HS256'});

	return token;
}