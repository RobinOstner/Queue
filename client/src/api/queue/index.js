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
  },

  addTrack: async function (store, track) {
    return request({
      url: "/addTrack",
      method: "post",
      data: {
        queueID: store.getters["queue/getQueueID"],
        track
      },
    })
  },

  getTracks: async function (store, offset, limit) {
    return request({
      url: "/getTracks",
      method: "get",
      params: {
        queueID: store.getters["queue/getQueueID"],
        offset,
        limit
      }
    })
  },

  voteTrack: async function (store, trackID) {
    return request({
      url: "/voteTrack",
      method: "put",
      params: {
        queueID: store.getters["queue/getQueueID"],
        trackID
      }
    })
  }
}