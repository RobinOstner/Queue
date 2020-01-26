<template>
  <div class="container">
    <h2 class="current-playback">Currently Playing:</h2>
    <div class="track" v-if="this.currentTrack">
      <h2 class="title">{{ currentTrack.title }}</h2>
      <h3 class="artist">{{ currentTrack.artist }}</h3>
      <p>{{toMinutes(progress) + " / " + toMinutes(duration)}}</p>
      <button @click="togglePlayback">{{ currentTrack.isPlaying ? "Pause" : "Play" }}</button>
      <button @click="nextTrack">Skip</button>
    </div>
    <p v-else>Nothing is currently playing!</p>
  </div>
</template>

<script>
  import api from "@/api";

  export default {
    name: "playback",
    data: function() {
      return {
        interval: null,
        progress: 0,
        duration: 1,
      };
    },
    created: function() {
      clearInterval(this.interval);
      this.interval = setInterval(this.checkTime, 1000);
    },
    computed: {
      currentTrack: function() {
        var currentPlayback = this.$store.getters["player/getPlayback"];

        if (currentPlayback.item) {
          var track = {
            id: currentPlayback.item.id,
            title: currentPlayback.item.name,
            artist: currentPlayback.item.artists[0].name,
            isPlaying: currentPlayback.is_playing
          };

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
        var player = this.$store.getters["player/getPlayer"];

        if (player) {
          var state = await player.getCurrentState();

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
          console.log("Play Next Track!");
          api.spotify.player.play(["spotify:track:" + result.data.track.id]);
        } else {
          console.log("Probably no tracks in Queue!");
        }

        this.$store.commit("queue/SET_NEXT_TRACK_WILL_PLAY", false);
      },
      togglePlayback: async function() {
        var player = this.$store.getters["player/getPlayer"];

        if (player) {
          player.togglePlay();
        }
      },
      toMinutes: function(time) {
        var minutes = Math.floor(time / 60);
        var seconds = Math.floor(time % 60);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
      }
    }
  };
</script>

<style lang="scss" scoped>
  h2 {
    margin: 0;
  }
  h3 {
    margin: 0;
  }

  .container {
    margin: 1em;
  }
</style>