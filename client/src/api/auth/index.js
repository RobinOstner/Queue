import request from "./../apiRequest";

export default {
  getUserAuthURL: async function () {
    return request.get("auth/login");
  },

  refreshToken: function refreshToken(refreshToken, queueID) {
    return request.post("auth/hostSpotifyRefresh", {
      refreshToken: refreshToken,
      queueID: queueID
    })
  },
};