const fs = require('fs')
const jwt = require('jsonwebtoken');

var env = process.env.NODE_ENV || 'development';
const credentials = require('./../../config/credentials')[env];

const queueDB = require("./../../extern/mongo/queueDB");

const tokenKey = credentials.jwt.hostAccessTokenSecret;
const refreshKey = credentials.jwt.hostRefreshTokenSecret;

module.exports = {
	createInitialTokenSet: function (salt) {
		let tokenSet = {
			"token": createToken(tokenKey + salt, credentials.jwt.tokenLife),
			"refreshToken": createToken(refreshKey + salt, credentials.jwt.refreshTokenLife)
		};

		return tokenSet;
	},
	tokenRefresh: function (refreshToken, salt) {
		let newToken = createToken(tokenKey + salt, credentials.jwt.tokenLife);

		return newToken;
	},
};

function createToken(key, expTime) {
	let token = jwt.sign({exp: Math.floor(Date.now() / 1000) + expTime},
		key, {algorithm: 'HS256'});

	return token;
}