<template>
  <div class="preview">
    <h2 class="title">{{ title }}</h2>
    <h3 class="artist">{{ artist }}</h3>
    <p class="votes">Votes: {{ votes }}</p>
    <button @click="vote">Vote</button>
  </div>
</template>

<script>
  import Vue from "vue";
  import api from "@/api";

  export default Vue.component("preview", {
    props: ["id", "title", "artist", "votes"],
    methods: {
      vote: async function() {
        api.queue.voteTrack(this.$store, this.id);
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
