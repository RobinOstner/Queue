<template>
  <div>
    <button @click="refresh">Refresh Queue</button>
    <transition-group name="tracks">
      <preview v-for="track in tracks" :key="track.id" :id="track.id" :title="track.title" :artist="track.artist" :votes="track.votes" />
    </transition-group>
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
        refreshTimer: ""
      };
    },
    created() {
      this.refresh();
      this.refreshTimer = setInterval(this.refresh, this.$store.getters["queue/getRefreshTime"]);
    },
    methods: {
      refresh: async function() {
        if (!this.$store.getters["queue/getQueueID"]) {
          return;
        }

        var result = await api.queue.getTracks(this.$store, 0, 20);

        if (result.data.tracks) {
          this.tracks = result.data.tracks;
        }
      }
    },
    beforeDestroy() {
      clearInterval(this.refreshTimer);
    }
  };
</script>

<style lang="scss" scoped>
.tracks-move {
  transition: transform 1s;
}
</style>
