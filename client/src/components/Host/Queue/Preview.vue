<template>
  <div>
    <div class="preview">
      <img class="cover" :src="coverURL" />
      <div class="info">
        <h2 class="title">{{ title }}</h2>
        <h2 class="artist">{{ artist }}</h2>
        <div class="stats">
          <h2 class="duration">{{ durationReadable }}</h2>
          <div class="spacer" />
          <h2 class="votes">{{ votes }} Votes</h2>
        </div>
      </div>
      <div class="button" @click="removeClicked">
        <h3>REMOVE</h3>
      </div>
    </div>
    <div class="seperator" v-if="this.spacer" />
  </div>
</template>

<script>
  import Vue from "vue";
  import api from "@/api";
  import { mapGetters, mapMutations } from "vuex";

  export default Vue.component("preview", {
    props: ["id", "title", "artist", "duration", "coverURL", "votes", "spacer"],
    computed: {
      ...mapGetters({
        votedTracks: "queue/getVotedTracks"
      }),
      durationReadable: function() {
        var minutes = Math.floor(this.duration/60000);
        var seconds = Math.floor(this.duration / 1000 % 60);

        return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
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
      },
      removeClicked: async function() {
        console.log("Remove");
        api.queue.removeTrack(this.$store, this.id);
      }
    }
  });
</script>

<style lang="scss" scoped>
  .preview {
    display: flex;
    margin: 0;
    margin-left: 2em;
    margin-right: 2em;
    margin-top: 2em;
    height: 7.5em;

    img {
      height: 80%;
      width: auto;
      margin: 1em 0;
      border-radius: 50%;
      border-style: solid;
      border-width: 2px;
    }

    .info {
      flex-grow: 0;
      margin: 0 1em;
      max-width: 55%;

      .title {
        margin: 0;
        font-size: 2.5em;
        font-weight: normal;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        max-width: 100%;
      }

      .artist {
        margin: 0;
        font-size: 1.5em;
        font-weight: normal;
      }

      .stats {
        display: flex;
        flex-direction: row;
        align-items: center;

        .spacer {
          height: 1em;
          width: 2px;
          background-color: white;
          margin-left: 1em;
          margin-right: 1em;
        }

        .votes {
          margin: 0;
        }
      }
    }

    .button {
      margin: auto 0 auto auto;
      display: flex;
      flex-grow: 0;
      padding: 1em 25px;
      justify-content: center;
      border-style: solid;
      border-width: 2px;
      border-color: white;
      transition: background-color 0.5s;

      h3 {
        position: relative;
        margin: auto;
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
  }

  .seperator {
    height: 2px;
    margin-top: 2em;
    background-image: linear-gradient(to right, #ffffff00, #ffffffff, #ffffff00);
  }
</style>
