<template>
  <div class="preview">
    <h2 class="title">{{ title }}</h2>
    <h3 class="artist">{{ artist }}</h3>
    <button @click="add">{{ this.voted ? "Unvote" : "Add To Queue" }}</button>
    <button @click="play">Play</button>
  </div>
</template>

<script>
  import Vue from "vue";
  import api from "@/api";
  import { mapGetters, mapMutations } from "vuex";

  export default Vue.component("preview", {
    props: ["id", "title", "artist", "duration", "coverURL"],
    computed: {
      ...mapGetters({
        votedTracks: "queue/getVotedTracks"
      }),
      voted: function() {
        return this.votedTracks.includes(this.id);
      }
    },
    methods: {
      ...mapMutations({
        addVotedTrack: "queue/ADD_VOTED_TRACK",
        removeVotedTrack: "queue/REMOVE_VOTED_TRACK"
      }),
      add: async function() {
        if (this.voted) {
          api.queue.unvoteTrack(this.$store, this.id);
          this.removeVotedTrack(this.id);
        } else {

          var result = await api.queue.addTrack(this.$store, {
            id: this.id,
            title: this.title,
            artist: this.artist,
            duration: this.duration,
            coverURL: this.coverURL,
          });
          
          this.addVotedTrack(this.id);
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
