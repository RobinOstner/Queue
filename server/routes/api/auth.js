var util = require("../../util/util");
var config = require("../../config");
var querystring = require("querystring");
var request = require("request");

const express = require("express");
const router = express.Router();

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
      client_id: config.client_id,
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
        Authorization: "Basic " + new Buffer(config.client_id + ":" + config.client_secret).toString("base64")
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const { access_token, refresh_token, expires_in } = body;

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

module.exports = router;
