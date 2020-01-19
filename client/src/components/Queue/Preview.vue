<template>
  <div class="preview">
    <h2 class="title">{{ title }}</h2>
    <h3 class="artist">{{ artist }}</h3>
    <p class="votes">Votes: {{ votes }}</p>
    <button @click="voteClicked">{{this.voted ? "Unvote" : "Vote"}}</button>
  </div>
</template>

<script>
  import Vue from "vue";
  import api from "@/api";

  export default Vue.component("preview", {
    props: ["id", "title", "artist", "votes"],
    computed: {
      voted: function () {
        var votedTracks = this.$store.getters["queue/getVotedTracks"];
        return votedTracks.includes(this.id);
      }
    },
    methods: {
      voteClicked: async function() {
        if (this.voted) {
          api.queue.unvoteTrack(this.$store, this.id);
          this.$store.commit("queue/REMOVE_VOTED_TRACK", this.id);
        } else {
          api.queue.voteTrack(this.$store, this.id);
          this.$store.commit("queue/ADD_VOTED_TRACK", this.id);
        }
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

  .votes {
    margin: 0;
  }
</style>
