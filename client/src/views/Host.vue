<template>
  <div class="container">
    <h1 class="title">HOST</h1>
    <h2 class="id">{{ queueID() }}</h2>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from "vuex";
  import axios from "axios";

  export default {
    name: "Host",
    methods: {
      ...mapGetters("queue", {
        queueID: "getQueueID",
      }),
      ...mapActions("auth", ["setAccessToken", "setRefreshToken", "setExpiryTime"])
    },
    mounted() {
      let spotifyPlayerScript = document.createElement("script");
      spotifyPlayerScript.setAttribute("src", "https://sdk.scdn.co/spotify-player.js");
      document.body.appendChild(spotifyPlayerScript);
    },
    created() {
      const { access_token, refresh_token, expires_in, error } = this.$route.query;

      if (error) {
        console.error(error);
      } else if (access_token && refresh_token && expires_in) {
        this.setAccessToken(access_token);
        this.setRefreshToken(refresh_token);
        this.setExpiryTime(expires_in);
        this.$router.push("/host");
        this.$store.dispatch("player/init", null, { root: true });
        this.$store.dispatch("queue/createQueue", null, {root: true});
      }
    }
  };
</script>

<style scoped lang="scss">
  .container {
    h1 {
    }
  }
</style>
