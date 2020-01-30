const config = {
    serverURL: 'http://localhost:5000/',
    clientURL: 'http://localhost:8080/',
  
    spotifyAPI: 'https://api.spotify.com/v1/',
    spotifyAccountsAPI: 'https://accounts.spotify.com/',
  
    redirect_uri: 'http://localhost:5000/api/auth/loginCallback',
    
    stateKey: 'spotify_auth_state',
    accessTokenKey: 'spotify_auth_token',
    refreshTokenKey: 'spotify_refresh_token',
  }
  
  module.exports = config;