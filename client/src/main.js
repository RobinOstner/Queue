import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';

import router from "@/router";
import store from "@/store";
import api from "@/api";

import httpInterceptors from "./api/helper/jwtInterceptors";

var VueCookie = require('vue-cookie');

Vue.use(VueCookie);

Vue.config.productionTip = false;

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
    }
  }
}).$mount('#app')