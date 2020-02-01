import api from "@/api";
import Vue from 'vue'

const state = {
  accessToken: "",
  refreshToken: "",
  expiryTime: ""
}

const getters = {
  getAccessToken: (state) => state.accessToken,
  getRefreshToken: (state) => state.refreshToken,
  getExpiryTime: (state) => state.expiryTime
}

const mutations = {
  SET_ACCESS_TOKEN(state, token) {
    state.accessToken = token;
  },

  SET_REFRESH_TOKEN(state, token) {
    state.refreshToken = token;
  },

  SET_EXPIRY_TIME(state, time) {
    state.expiryTime = time;
  }
}

const actions = {
  loginHost: async function () {
    try {
      const response = await api.auth.getUserAuthURL();
      console.log(response);
      if (response.data) {
        window.location.assign(response.data);
      }
    } catch (e) {
      console.log(e);
    }
  },

  refreshToken: async function ({ commit, state, dispatch }) {
    try {
      if (state.refreshToken) {
        const response = await api.refreshToken(state.refreshToken);
        commit("SET_ACCESS_TOKEN", response.data.accessToken);

        const accessToken = response.data.accessToken;

        dispatch("setAccessToken", accessToken);
        return response;
      }
    } catch (e) {
      console.log(e);
    }
  },

  setAccessToken({ commit }, token) {
    commit("SET_ACCESS_TOKEN", token);
  },

  setRefreshToken({ commit }, token) {
    commit("SET_REFRESH_TOKEN", token);
  },

  setExpiryTime({ commit }, time) {
    commit("SET_EXPIRY_TIME", time);
  }
}

const module = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default module;