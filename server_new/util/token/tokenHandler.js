const jwt = require('jsonwebtoken');

module.exports = {
	createRefreshTokenClient: function (salt) {
		return createToken(process.env.CLIENT_REFRESH_TOKEN_SECRET + salt, process.env.REFRESH_TOKEN_LIFE)
	},
	createRefreshTokenHost: function (salt) {
		return createToken(process.env.HOST_REFRESH_TOKEN_SECRET + salt, process.env.REFRESH_TOKEN_LIFE)
	},
	signClientData: function(salt, data) {
		return signData(process.env.CLIENT_ACCESS_TOKEN_SECRET + salt, data);
	},
	signHostData: function(salt, data) {
		return signData(process.env.HOST_ACCESS_TOKEN_SECRET + salt, data);
	}
};

function createToken(key, expTime) {
	return jwt.sign({exp: Math.floor(Date.now() / 1000) + parseInt(expTime)}, key);
}

function signData(key, data) {
	return jwt.sign(data, key, {expiresIn: parseInt(process.env.TOKEN_LIFE)});
}