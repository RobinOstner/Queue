<template>
  <div class="preview">
    <h2 class="title">{{ title }}</h2>
    <h3 class="artist">{{ artist }}</h3>
    <button @click="vote">Vote</button>
  </div>
</template>

<script>
  import Vue from "vue";

  export default Vue.component("preview", {
    props: ["id", "title", "artist", "votes"],
    methods: {
      vote: async function() {
        
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
