import api from "@/api";

const state = {
  id: "",
}

const getters = {
  getQueueID: state => state.id,
}

const mutations = {
  SET_QUEUE_ID(state, id) {
    state.id = id;
  }
}

const actions = {
  createQueue: async function ({ commit, rootGetters, dispatch }) {
    try {
      var response = await api.queue.createQueue();
  
      if (response.data) {
        console.log(response.data.id);
        commit("SET_QUEUE_ID", response.data.id);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

const module = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

export default module;