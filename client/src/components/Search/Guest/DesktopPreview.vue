<template>
  <div class="preview">
    <img :src="coverURL" />
    <h2 class="title">{{ title }} - {{ artist }}</h2>
    <h2 class="duration">{{ durationReadable }}</h2>
    <div class="button" @click="add">
      <h3>
        {{ this.voted ? "UNVOTE" : "ADD" }}
      </h3>
    </div>
  </div>
</template>

<script>
  import Vue from "vue";
  import api from "@/api";
  import { mapGetters, mapMutations } from "vuex";

  export default Vue.component("desktopPreview", {
    props: ["id", "title", "artist", "duration", "coverURL"],
    computed: {
      ...mapGetters({
        votedTracks: "queue/getVotedTracks"
      }),
      voted: function() {
        return this.votedTracks.includes(this.id);
      },
      durationReadable: function() {
        var minutes = Math.floor(this.duration / 60000);
        var seconds = Math.floor((this.duration / 1000) % 60);

        return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
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
            coverURL: this.coverURL
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
    margin-top: 1.5em;
    margin-right: 0;
    display: -webkit-box;
    height: 3.75em;
    width: 100%;
  }

  h2 {
    font-size: 2em;
    font-weight: normal;
  }
  
  h3 {
    font-size: 1.5em;
    font-weight: normal;
  }

  img {
    height: 100%;
    border-radius: 50%;
    border-style: solid;
    border-width: 1px;
  }

  .title {
    margin: auto 25px;
    flex-grow: 1;
  }

  .duration {
    margin: auto 25px;
  }

  .button {
    width: 7em;
    height: 100%;
    margin: auto 0 auto auto;
    right: 0;
    display: flex;
    flex-grow: 0;
    padding: 0 25px;
    justify-content: center;
    border-style: solid;
    border-width: 2px;
    border-color: white;
    transition: background-color 0.5s;

    h3 {
      position: relative;
      margin: auto 0;
      transition: color 0.5s;
      font-size: 1.5em;
      font-weight: normal;
      text-align: center;
    }

    &:hover {
      cursor: pointer;
      background-color: white;

      h3 {
        color: black;
      }
    }
  }
</style>
