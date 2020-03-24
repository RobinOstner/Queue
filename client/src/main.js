import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import VueAnime from "vue-animejs";

import router from "@/router";
import store from "@/store";
import api from "@/api";

import httpInterceptors from "./api/helper/jwtInterceptors";

var VueCookies = require('vue-cookies');

Vue.use(VueCookies);
Vue.use(VueAnime);

Vue.config.productionTip = false;
Vue.$cookies.config('7d');

const app = new Vue({
  render: h => h(App),
  router,
  store,
  created() {
    window.addEventListener('beforeunload', this.unload)
  },
  methods: {
    unload: function (event) {
      var queueID = this.$store.state.queue.id;

      if (queueID !== "") {
        api.queue.closeQueue(queueID);
      }
    },
  },
}).$mount('#app')