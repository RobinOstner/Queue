import request from "./request";
import querystring from "querystring";

export default {
  createQueue: async function () {
    return request.post("/createQueue");
  },

  closeQueue: async function (queueID) {
    return request.delete("/closeQueue?" + querystring.stringify({
      id: queueID,
    }));
  }
}