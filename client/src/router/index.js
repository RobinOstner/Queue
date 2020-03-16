import Vue from "vue";
import Router from "vue-router";

import Home from '@/views/Home/HomeMain';
import Host from '@/views/Host';
import Guest from '@/views/Guest';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/host",
      name: "Host",
      component: Host,
    },
    {
      path: "/guest",
      name: "Guest",
      component: Guest
    },
    {
      path: "*"
    }
  ]
});



export default router;