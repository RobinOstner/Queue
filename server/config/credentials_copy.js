//copy and rename file to credentials and fill out
var credentials = {
    development: {
        //mongodb connection settings
        database: {
            url: ''
        },
        jwt: {
			"hostAccessTokenSecret": "",
			"hostRefreshTokenSecret": "",
			"clientAccessTokenSecret": "",
			"clientRefreshTokenSecret": "",
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
			"hostAccessTokenSecret": "",
			"hostRefreshTokenSecret": "",
			"clientAccessTokenSecret": "",
			"clientRefreshTokenSecret": "",
			"tokenLife": 3600,
			"refreshTokenLife": 86400
		}
    }
};

module.exports = credentials;