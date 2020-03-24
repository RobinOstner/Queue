<template>
  <div class="container" v-if="this.currentTrack != null">
    <h1 class="title">{{ currentTrack.title }}</h1>
    <div class="divider"></div>
    <h2 class="artist">{{ currentTrack.artist }}</h2>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapGetters } from "vuex";

  export default {
    name: "current-song",
    data: function() {
      return {
        interval: null,
        progress: 0,
        duration: 0
      };
    },
    created: function() {
      clearInterval(this.interval);
      this.interval = setInterval(this.checkTime, 1000);
    },
    computed: {
      ...mapGetters({
        currentPlayback: "player/getPlayback",
        player: "player/getPlayer"
      }),
      currentTrack: function() {
        if (this.currentPlayback.item) {
          var track = {
            id: this.currentPlayback.item.id,
            title: this.currentPlayback.item.name,
            artist: this.currentPlayback.item.artists[0].name,
            duration: this.currentPlayback.item.duration_ms,
            coverURL: this.currentPlayback.item.album.images[1].url,
            isPlaying: this.currentPlayback.is_playing
          };

          api.queue.setCurrentTrack(track);

          return track;
        } else {
          return null;
        }
      }
    },
    methods: {
      checkTime: async function() {
        var timeToEnd = await this.getTimeToEnd();

        if (timeToEnd < 1500) {
          clearInterval(this.interval);

          var result = await api.queue.nextTrack(this.$store);

          if (result.data) {
            await api.spotify.player.play(["spotify:track:" + result.data.track.id]);

            clearInterval(this.interval);
            this.interval = setInterval(this.checkTime, 1000);
          } else {
            console.log("Probably no tracks in Queue!");
            clearInterval(this.interval);
            this.interval = setInterval(this.checkTime, 1000);
          }
        }
      },
      getTimeToEnd: async function() {
        if (this.player) {
          var state = await this.player.getCurrentState();

          if (!state) {
            return 1000000;
          }

          this.duration = state.duration / 1000;
          this.progress = state.position / 1000;

          var timeToEnd = state.duration - state.position;

          return timeToEnd;
        } else {
          return 1000000;
        }
      },
      nextTrack: async function() {
        var result = await api.queue.nextTrack(this.$store);

        if (result.data) {
          api.spotify.player.play(["spotify:track:" + result.data.track.id]);
        } else {
          console.log("Probably no tracks in Queue!");
        }
      },
      toMinutes: function(time) {
        var minutes = Math.floor(time / 60);
        var seconds = Math.floor(time % 60);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
      },
      setCurrentTrack: async function() {
        api.queue.setCurrentTrack(this.currentTrack);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .container {
    color: white;
    font-family: "Rationale";
    text-align: center;
    margin: 0;
    width: 100%;
  }

  .title {
    font-size: 9em;
    font-weight: normal;
    margin: 0;
  }

  .artist {
    font-size: 4.5em;
    font-weight: normal;
    margin: 0;
  }

  .divider {
    margin: 0;
    height: 2px;
    margin: 0 25%;
    background-color: white;
  }
</style>
