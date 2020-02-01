import api from "@/api";

const state = {
  id: "",
  refreshTime: 2500,
  votedTracks: [],
  nextTrackWillPlay: false,
}

const getters = {
  getQueueID: state => state.id,
  getRefreshTime: state => state.refreshTime,
  getVotedTracks: state => state.votedTracks,
  getNextTrackWillPlay: state => state.nextTrackIsAboutToPlay,
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
  },

  SET_NEXT_TRACK_WILL_PLAY(state, value) {
    state.nextTrackIsAboutToPlay = value;
  }
}

const actions = {
  createQueue: async function ({ commit, rootGetters }) {
    try {
      var accessToken = rootGetters["auth/getAccessToken"];

      console.log(accessToken);

      var response = await api.queue.createQueue(accessToken);
  
      if (response.data) {
        commit("SET_QUEUE_ID", response.data.queueID);
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