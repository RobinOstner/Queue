import api from "@/api";

const state = {
  id: "",
  refreshTime: 2500,
  votedTracks: [],
}

const getters = {
  getQueueID: state => state.id,
  getRefreshTime: state => state.refreshTime,
  getVotedTracks: state => state.votedTracks,
}

const mutations = {
  SET_QUEUE_ID(state, id) {
    state.id = id;
  },

  ADD_VOTED_TRACK(state, trackID) {
    state.votedTracks.push(trackID);
  },

  REMOVE_VOTED_TRACK(state, trackID) {
    state.votedTracks.splice(state.votedTracks.indexOf(trackID), 1);
  }
}

const actions = {
  createQueue: async function ({ commit }) {
    try {
      var response = await api.queue.createQueue();
  
      if (response.data) {
        commit("SET_QUEUE_ID", response.data.queueId);
      }
    } catch (e) {
      console.log(e);
    }
  },
}

const module = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

export default module;