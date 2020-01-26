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
import { RetryError } from "./../../exception/retryError";


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

        api.queue.getTracks(this.$store, 0, 20).then( res => {
          if (res.data.tracks) {
            this.tracks = res.data.tracks;
            this.cleanVotedTracks();
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
      },
      cleanVotedTracks: function() {
        var votedTracks = this.$store.getters["queue/getVotedTracks"];

        votedTracks.forEach( (votedTrack) => {
          var included = false;

          for (var i=0; i<this.tracks.length; i++) {
            if (this.tracks[i].id == votedTrack) {
              included = true;
              break;
            }
          }

          if (!included) {
            this.$store.commit("queue/REMOVE_VOTED_TRACK", votedTrack);
          }
        })
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
