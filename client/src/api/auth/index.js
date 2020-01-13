import request from "./request";

export default {
  getUserAuthURL: async function () {
    return request.get("auth/login");
  },

  refreshToken: function (refreshToken) {
    
  }
};