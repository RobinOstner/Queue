import request from "./request";

export default {
  getUserAuthURL: async function () {
    return request.get("/login");
  },

  refreshToken: function (refreshToken) {
    
  }
};