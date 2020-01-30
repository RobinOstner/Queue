//copy and rename file to credentials and fill out
var credentials = {
	development: {
		//mongodb connection settings
		database: {
			url: 'mongodb+srv://sprangf:8UrEp4PTyUDM7Sb2@queue-xdyvz.mongodb.net/test'
		},
		jwt: {
			"hostAccessTokenSecret": "MySuperDooperHostAccessSecret",
			"hostRefreshTokenSecret": "MySuperDooperHostRefreshSecret",
			"clientAccessTokenSecret": "MySuperDooperClientAccessSecret",
			"clientRefreshTokenSecret": "MySuperDooperClientRefreshSecret",
			"tokenLife": 3600,
			"refreshTokenLife": 86400
		}
	},
	production: {
		//mongodb connection settings
		database: {
			url: ''
		},
		jwt: {
			"hostAccessTokenSecret": "MySuperDooperHostAccessSecret",
			"hostRefreshTokenSecret": "MySuperDooperHostRefreshSecret",
			"clientAccessTokenSecret": "MySuperDooperClientAccessSecret",
			"clientRefreshTokenSecret": "MySuperDooperClientRefreshSecret",
			"tokenLife": 3600,
			"refreshTokenLife": 86400
		}
	}
};
module.exports = credentials;