import request from "./../apiRequest";
import querystring from "querystring";

let endpoint = "queue";

export default {
  //ToDo adapt origin
  createQueue: async function(accessToken) {
    return request.post(
      endpoint + "/createQueue",
      {
        accessToken
      },
      {
        withCredentials: true,
        origin: "http://localhost:8080"
      }
    );
  },

  closeQueue: async function(queueID) {
    return request.delete(
      endpoint +
        "/closeQueue?" +
        querystring.stringify({
          id: queueID
        })
    );
  },

  addTrack: async function(store, track) {
    return request({
      url: endpoint + "/addTrack",
      method: "post",
      data: {
        queueID: store.getters["queue/getQueueID"],
        track
      }
    });
  },

  getTracks: async function(store, offset, limit) {
    return request({
      url: endpoint + "/getTracks",
      method: "get",
      params: {
        queueID: store.getters["queue/getQueueID"],
        offset,
        limit
      }
    });
  },

  nextTrack: async function(store) {
    return request({
      url: endpoint + "/nextTrack",
      method: "get",
      params: {
        queueID: store.getters["queue/getQueueID"]
      }
    });
  },

  voteTrack: async function(store, trackID) {
    return request({
      url: endpoint + "/voteTrack",
      method: "post",
      params: {
        queueID: store.getters["queue/getQueueID"],
        trackID
      }
    });
  },

  unvoteTrack: async function(store, trackID) {
    return request({
      url: endpoint + "/unvoteTrack",
      method: "post",
      params: {
        queueID: store.getters["queue/getQueueID"],
        trackID
      }
    });
  },

  joinQueue: async function(queueID) {
    return request({
      url: endpoint + "/joinQueue",
      method: "post",
      data: {
        queueID: queueID
      }
    });
  },

  setCurrentTrack: async function (track) {
    return request({
      url: endpoint + "/currentTrack",
      method: "post",
      data: {
        track
      }
    })
  },

  getCurrentTrack: async function () {
    return request.get(endpoint + "/currentTrack");
  }
};
