const config = {
  serverURL: 'http://localhost:5000/',
  clientURL: 'http://localhost:8080/',

  spotifyAPI: 'https://api.spotify.com/v1/',
  spotifyAccountsAPI: 'https://accounts.spotify.com/',

  client_id: 'a91c6093109e4ad7b08f8fd42db23f26',
  client_secret: '4f65fda3e02f4fdc87974ebb781ac630',
  redirect_uri: 'http://localhost:5000/api/auth/loginCallback',
  
  stateKey: 'spotify_auth_state',
  accessTokenKey: 'spotify_auth_token',
  refreshTokenKey: 'spotify_refresh_token',
}

module.exports = config;