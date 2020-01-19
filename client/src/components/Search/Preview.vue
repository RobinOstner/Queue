<template>
  <div class="preview">
    <h2 class="title">{{ title }}</h2>
    <h3 class="artist">{{ artist }}</h3>
    <button @click="add">Add To Queue</button>
    <button @click="play">Play</button>
  </div>
</template>

<script>
  import Vue from "vue";
  import api from "@/api";

  export default Vue.component("preview", {
    props: ["id", "title", "artist"],
    computed: {
      voted: function() {
        var votedTracks = this.$store.getters["queue/getVotedTracks"];
        return votedTracks.includes(this.id);
      }
    },
    methods: {
      add: async function() {
        if (this.voted) {
          api.queue.unvoteTrack(this.$store, this.id);
          this.$store.commit("queue/REMOVE_VOTED_TRACK", this.id);
        } else {
          this.$store.commit("queue/ADD_VOTED_TRACK", this.id);

          var result = await api.queue.addTrack(this.$store, {
            id: this.id,
            title: this.title,
            artist: this.artist
          });
        }
      },
      play: function() {
        api.spotify.player.play(["spotify:track:" + this.id]);
      }
    }
  });
</script>

<style lang="scss" scoped>
  .preview {
    display: block;
    margin: 1em;
  }

  .title {
    margin: 0;
  }

  .artist {
    margin: 0;
  }
</style>
