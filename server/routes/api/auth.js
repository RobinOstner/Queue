var util = require("../../util/");
var config = require("../../config");
var querystring = require("querystring");
var request = require("request");

const Queue = require('../../model/Queue');
const jwtTokenGen = require("../../util/token/tokenHandler");
const jwtTokenCheck = require("../../util/token/tokenChecker");
const router = require("express").Router();

router.get("/login", (req, res) => {
	var state = util.generateRandomString(16);

	res.cookie(config.stateKey, state);

	// your application requests authorization
	var scope = "user-read-private user-read-email streaming user-read-playback-state";

	const url =
		config.spotifyAccountsAPI +
		"authorize?" +
		querystring.stringify({
			response_type: "code",
			client_id: process.env.CLIENT_ID,
			scope: scope,
			redirect_uri: config.redirect_uri,
			state: state
		});

	res.status(200).json(url);
});

router.get("/loginCallback", (req, res) => {
	var code = req.query.code || null;
	var state = req.query.state;

	if (state === null) {
		res.redirect(
			"/" +
			querystring.stringify({
				error: "state_mismatch"
			})
		);
	} else {
		var authOptions = {
			url: "https://accounts.spotify.com/api/token",
			form: {
				code: code,
				redirect_uri: config.redirect_uri,
				grant_type: "authorization_code"
			},
			headers: {
				Authorization: "Basic " + new Buffer(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64")
			},
			json: true
		};

		request.post(authOptions, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				const {access_token, refresh_token, expires_in} = body;

				res.redirect(
					config.clientURL +
					"host?" +
					querystring.stringify({
						access_token,
						refresh_token,
						expires_in
					})
				);
			} else {
				res.redirect(
					"/" +
					querystring.stringify({
						error: "invalid_token"
					})
				);
			}
		});
	}
});

router.post('/refreshTokenHost',jwtTokenCheck.hostRefresh, async (req, res) => {
	let queueId = parseInt(req.headers['x-queue-id']);

	if (!queueId) {
		res.status(404).send('Invalid apiRequest')
	}

	let queue = await Queue.findOne({ queueId : queueId});

	if(!queue) {
		res.status(404).send('Invalid apiRequest')
	}

	let refreshToken = jwtTokenGen.createRefreshTokenHost(queue.tokenSalt);

	res.cookie("refreshToken", refreshToken, {httpOnly: true, Secure: true});

    res.status(201).send( {
        queueId: savedQueue.queueId,
        tracks: savedQueue.tracks,
        token: jwtTokenGen.signHostData(queue.tokenSalt, {queueId: savedQueue.queueId})
    } );
});

router.post('/refreshTokenClient',jwtTokenCheck.clientRefresh, async (req, res) => {
	let queueId = parseInt(req.headers['x-queue-id']);

	if (!queueId) {
		res.status(404).send('Invalid apiRequest')
	}

	let queue = await Queue.findOne({ queueId : queueId});

	if(!queue) {
		res.status(404).send('Invalid apiRequest')
	}

	let refreshToken = jwtTokenGen.createRefreshTokenClient(queue.tokenSalt);

	res.cookie("refreshToken", refreshToken, {httpOnly: true, Secure: true});

    res.status(201).send( {
        queueId: savedQueue.queueId,
        tracks: savedQueue.tracks,
        token: jwtTokenGen.signClientData(queue.tokenSalt, {queueId: savedQueue.queueId})
    } );
});

module.exports = router;
