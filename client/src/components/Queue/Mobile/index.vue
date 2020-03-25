<template>
    <div class="scroll">
      <div class="spacer" />
      <transition-group name="tracks fade">
        <preview
          v-for="(track, index) in tracks"
          :key="track.id"
          :id="track.id"
          :title="track.title"
          :artist="track.artist"
          :votes="track.votes"
          :duration="track.duration"
          :coverURL="track.coverURL"
          :spacer="showSpacer(index)"
        />
      </transition-group>
      <div class="spacer" />
      <div class="spacer" />
    </div>
</template>

<script>
  import api from "@/api";

  import Preview from "./Preview";
  import { RetryError } from "@/exception/retryError";
  import { mapGetters } from "vuex";
  import { mapMutations } from "vuex";

  export default {
    name: "mobile-queue",
    components: {
      Preview
    },
    data: function() {
      return {
        tracks: [],
        refreshTimer: ""
      };
    },
    computed: {
      ...mapGetters({
        refreshTime: "queue/getRefreshTime",
        queueID: "queue/getQueueID",
        votedTracks: "queue/getVotedTracks"
      })
    },
    created() {
      this.refresh();
      this.refreshTimer = setInterval(this.refresh, this.refreshTime);
    },
    methods: {
      ...mapMutations({
        setTracks: "queue/SET_TRACKS",
        removeVotedTrack: "queue/REMOVE_VOTED_TRACK"
      }),
      showSpacer: function(index) {
        return index != this.tracks.length - 1;
      },
      refresh: async function() {
        if (!this.queueID) {
          return;
        }

        api.queue
          .getTracks(this.$store, 0, 20)
          .then(res => {
            if (res.data.tracks) {
              this.setTracks(res.data.tracks);
              this.tracks = res.data.tracks;
              this.cleanVotedTracks();
            }
          })
          .catch(err => {
            if (err instanceof RetryError) {
              api.queue.getTracks(this.$store, 0, 20).then(res => {
                if (res.data.tracks) {
                  this.tracks = res.data.tracks;
                }
              });
            }
          });
      },
      cleanVotedTracks: function() {
        var voted = this.votedTracks;

        this.votedTracks.forEach(votedTrack => {
          var included = false;

          for (var i = 0; i < this.tracks.length; i++) {
            if (this.tracks[i].id == votedTrack) {
              included = true;
              break;
            }
          }

          if (!included) {
            this.removeVotedTrack(votedTrack);
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
  .spacer {
    height: 5.5em;
  }

  .tracks-move {
    transition: transform 1s;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .scroll {
    overflow: auto;
    height: 100%;
  }

  .scroll::-webkit-scrollbar {
    width: 0px;
  }
</style>
