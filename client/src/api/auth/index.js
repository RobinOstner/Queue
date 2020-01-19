//import request from "./request";
import request from "./../apiRequest";

export default {
  getUserAuthURL: async function () {
    return request.get("auth/login");
  },

  refreshToken: function (refreshToken) {
    
  }
};