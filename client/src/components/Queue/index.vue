<template>
  <div>
    <button @click="refresh">Refresh Queue</button>
    <preview v-for="track in tracks" :key="track.id" :id="track.id" :title="track.title" :artist="track.artist" :votes="track.votes"/>
  </div>
</template>

<script>
import api from "@/api";

import Preview from "./Preview";
import { RetryError } from "./../../exception/retryError";


  export default {
    name: "queue",
    components: {
      Preview
    },
    data: function() {
      return {
        tracks: [],
        refreshTimer: ''
      }
    },
    created () {
      this.refresh();
      this.refreshTimer = setInterval(this.refresh, this.$store.getters["queue/getRefreshTime"]);
    },
    methods: {
      refresh: async function() {
        if (!this.$store.getters["queue/getQueueID"]){
          return;
        }

        api.queue.getTracks(this.$store, 0, 20).then( res => {
          if (res.data.tracks) {
            this.tracks = res.data.tracks;
          }
        }).catch( err => {
            if(err instanceof RetryError) {
              api.queue.getTracks(this.$store, 0, 20).then( res => {
                if (res.data.tracks) {
                  this.tracks = res.data.tracks;
                }
              })
            }
        });
      }
    },
    beforeDestroy() {
      clearInterval(this.refreshTimer);
    }
  };
</script>

<style lang="scss" scoped>
</style>
