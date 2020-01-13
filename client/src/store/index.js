import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import player from './modules/player';
import guest from './modules/guest';
import queue from './modules/queue';

import spotifyApiPlugin from '@/api/spotify/plugin';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    player,
    guest,
    queue,
  },
  plugins: [spotifyApiPlugin]
})