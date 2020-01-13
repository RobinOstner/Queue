import Vue from 'vue';
import App from './App.vue';

import router from "@/router";
import store from "@/store";

var VueCookie = require('vue-cookie');

Vue.use(VueCookie);

Vue.config.productionTip = false

const app = new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
