<template>
  <div class="preview">
    <h2 class="title">{{ title }}</h2>
    <h3 class="artist">{{ artist }}</h3>
    <p class="votes">Votes: {{ votes }}</p>
    <button @click="voteClicked">{{ this.voted ? "Unvote" : "Vote" }}</button>
  </div>
</template>

<script>
  import Vue from "vue";
  import api from "@/api";
  import { mapGetters, mapMutations } from "vuex";

  export default Vue.component("preview", {
    props: ["id", "title", "artist", "votes"],
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
      voteClicked: async function() {
        if (this.voted) {
          api.queue.unvoteTrack(this.$store, this.id);
          this.$store.commit("queue/REMOVE_VOTED_TRACK", this.id);
        } else {
          await api.queue.voteTrack(this.$store, this.id);
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
