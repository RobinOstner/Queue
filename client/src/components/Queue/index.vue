<template>
  <div>
    <button @click="refresh">Refresh Queue</button>
    <preview v-for="track in tracks" :key="track.id" :id="track.id" :title="track.title" :artist="track.artist" :votes="track.votes"/>
  </div>
</template>

<script>
import api from "@/api";

import Preview from "./Preview";

  export default {
    name: "queue",
    components: {
      Preview
    },
    data: function() {
      return {
        tracks: [],
      }
    },
    methods: {
      refresh: async function() {
        var result = await api.queue.getTracks(this.$store, 0, 20);

        if (result.data.tracks) {
          this.tracks = result.data.tracks;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>
