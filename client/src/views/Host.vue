<template>
  <div class="container">
    <h1 class="title">HOST</h1>
    <h2 class="id">{{ queueID() }}</h2>
    <playback />
    <div class="layout">
      <search class="column"/>
      <queue class="column"/>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from "vuex";
  import axios from "axios";

  import Search from "@/components/Search";
  import Queue from "@/components/Queue";
  import Playback from "@/components/Playback";

  export default {
    name: "Host",
    components: {
      Search,
      Queue,
      Playback
    },
    methods: {
      ...mapGetters("queue", {
        queueID: "getQueueID"
      }),
      ...mapActions("auth", ["setAccessToken", "setRefreshToken", "setExpiryTime"]),
      ...mapActions({
        initPlayer: "player/init",
        createQueue: "queue/createQueue",
      })
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

        this.initPlayer(null, { root: true });
        this.createQueue(null, { root: true });
      }
    }
  };
</script>

<style scoped lang="scss">
  .container {
    h1 {
    }
  }

  .layout {
    display: flex;

  }

  .column {
    flex: 50%;
  }
</style>
