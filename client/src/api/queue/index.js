import request from "./../apiRequest";
import querystring from "querystring";

let endpoint = "queue";

export default {
  //ToDo adapt origin
  createQueue: async function () {
    return request.post(endpoint + "/createQueue", {}, {
      withCredentials: true,
      origin: 'http://localhost:8080'
    });
  },

  closeQueue: async function (queueID) {
    return request.delete(endpoint + "/closeQueue?" + querystring.stringify({
      id: queueID,
    }));
  },

  addTrack: async function (store, track) {
    return request({
      url: endpoint + "/addTrack",
      method: "post",
      data: {
        queueID: store.getters["queue/getQueueID"],
        track
      },
    })
  },

  getTracks: async function (store, offset, limit) {
    return request({
      url: endpoint + "/getTracks",
      method: "get",
      params: {
        queueID: store.getters["queue/getQueueID"],
        offset,
        limit
      }
    })
  },

  nextTrack: async function (store) {
    return request({
      url: endpoint + "/nextTrack",
      method: "get",
      params: {
        queueID: store.getters["queue/getQueueID"],
      }
    })
  },

  voteTrack: async function (store, trackID) {
    return request({
      url: endpoint + "/voteTrack",
      method: "put",
      params: {
        queueID: store.getters["queue/getQueueID"],
        trackID
      }
    })
  },

  unvoteTrack: async function (store, trackID) {
    return request({
      url: "/unvoteTrack",
      method: "put",
      params: {
        queueID: store.getters["queue/getQueueID"],
        trackID
      }
    })
  }
}