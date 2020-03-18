<template>
  <div class="home">
    <home-desktop v-if="!isMobile()" @login="login" @join="join" @joinWithPassword="joinWithPassword"/>
    <home-mobile v-else />
  </div>
</template>

<script>
  import api from "@/api";
  import HomeDesktop from "./HomeDesktop";
  import HomeMobile from "./HomeMobile";

  import { mapMutations } from "vuex";

  export default {
    name: "Home",
    components: {
      HomeDesktop,
      HomeMobile
    },
    methods: {
      ...mapMutations({
        setQueueID: "queue/SET_QUEUE_ID",
        setAccessToken: "auth/SET_ACCESS_TOKEN"
      }),
      isMobile() {
        return this.$isMobile();
      },
      login: function() {
        this.$store.dispatch("auth/loginHost");
      },
      join: async function(queueID) {
        api.queue
          .hasPassword(queueID)
          .then(res => {
            if (!res.data.hasPassword) {
              api.queue
                .joinQueue(queueID)
                .then(res => {
                  var token = res.data.token;
                  var accessToken = res.data.accessToken;
                  if (token && accessToken) {
                    this.setQueueID(queueID);
                    this.setAccessToken(accessToken);
                    this.$router.push({ path: "/guest" });
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            } else {
              this.$emit("hasPassword");
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      joinWithPassword: function(queueID, password) {
        api.queue
          .joinQueue(queueID, password)
          .then(res => {
            var token = res.data.token;
            var accessToken = res.data.accessToken;
            if (token && accessToken) {
              this.setQueueID(queueID);
              this.setAccessToken(accessToken);
              this.$router.push({ path: "/guest" });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .home {
    width: 100%;
    height: 100%;
  }
</style>
