<template>
  <div>
    <div class="preview">
      <img class="cover" :src="coverURL" />
      <div class="info">
        <h2 class="title">{{ title }}</h2>
        <h2 class="artist">{{ artist }}</h2>
        <div class="stats">
          <h2 class="duration">{{ durationReadable }}</h2>
        </div>
      </div>
      <div class="button" @click="add" v-bind:class="{ buttonSelected: this.voted }">
        <h3>{{ buttonText }}</h3>
      </div>
    </div>
    <div class="seperator" v-if="this.spacer" />
  </div>
</template>

<script>
  import Vue from "vue";
  import api from "@/api";
  import { mapGetters, mapMutations } from "vuex";

  export default Vue.component("mobilePreview", {
    props: ["id", "title", "artist", "duration", "coverURL", "votes", "spacer"],
    computed: {
      ...mapGetters({
        votedTracks: "queue/getVotedTracks"
      }),
      buttonText: function() {
        var tracks = this.tracks();

        if (this.votedTracks.includes(this.id)) {
          return "UNVOTE";
        }

        for (let i = 0; i < tracks.length; i++) {
          if (tracks[i].id == this.id) {
            return "VOTE";
          }
        }

        return "ADD";
      },
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
      ...mapGetters({
        tracks: "queue/getTracks"
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
      }
    }
  });
</script>

<style lang="scss" scoped>
  .preview {
    display: flex;
    margin: 0;
    margin-left: 25px;
    margin-right: 25px;
    margin-top: 10px;
    height: 5.5em;

    img {
      height: 60%;
      width: auto;
      margin: auto 0;
      border-radius: 50%;
      border-style: solid;
      border-width: 1px;
    }

    .info {
      flex-grow: 0;
      margin: 10px 10px;
      max-width: 55%;

      .title {
        margin: 0;
        font-size: 1.2em;
        font-weight: normal;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }

      .artist {
        margin: 0;
        font-size: 0.8em;
        font-weight: normal;
      }

      .stats {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 0.9em;

        .spacer {
          height: 1em;
          width: 1px;
          background-color: white;
          margin-left: 1em;
          margin-right: 1em;
        }

        .duration {
          font-size: 1em;
        }

        .votes {
          font-size: 1em;
          margin: 0;
        }
      }
    }

    .button {
      margin: auto 0 auto auto;
      display: flex;
      flex-grow: 0;
      padding: 10px 15px;
      justify-content: center;
      border-style: solid;
      border-width: 1px;
      border-color: white;
      transition: background-color 0.5s;

      h3 {
        position: relative;
        width: 3em;
        margin: auto;
        transition: color 0.5s;
        font-size: 0.8em;
        font-weight: normal;
        text-align: center;
      }
    }

    .buttonSelected {
      background-color: white;

      h3 {
        color: black;
      }
    }
  }

  .seperator {
    height: 1px;
    margin-top: 10px;
    background-image: linear-gradient(to right, #ffffff00, #ffffffff, #ffffff00);
  }
</style>
