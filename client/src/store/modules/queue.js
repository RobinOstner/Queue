import api from "@/api";

const state = {
  id: "",
  refreshTime: 2500,
  tracks: [],
  votedTracks: [],
  nextTrackWillPlay: false,
}

const getters = {
  getQueueID: state => state.id,
  getRefreshTime: state => state.refreshTime,
  getTracks: state => state.tracks,
  getVotedTracks: state => state.votedTracks,
  getNextTrackWillPlay: state => state.nextTrackIsAboutToPlay,
}

const mutations = {
  SET_QUEUE_ID(state, id) {
    state.id = id;
  },

  SET_TRACKS(state, tracks) {
    state.tracks = tracks;
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

      var response = await api.queue.createQueue(accessToken);
  
      if (response.data) {
        commit("SET_QUEUE_ID", response.data.queueID);
        commit("auth/SET_IS_HOST", null, {root: true});
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