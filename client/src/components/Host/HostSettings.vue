<template>
  <div class="container blur">
    <div class="headerSpacer" />
    <div class="settings">
      <div class="columnLeft">
        <div class="inputField">
          <h3>PASSWORD:</h3>
          <input ref="guestInput" v-model="password" type="text" v-on:keyup.enter="setPassword"/>
        </div>
      </div>

      <div class="columnRight">
        <div class="queueHeader">
          <div class="header">
            <h2 class="queueTitle">QUEUE</h2>

            <div class="button" @click="togglePlayback">
              <h3>{{ currentTrack.isPlaying ? "PAUSE" : "PLAY" }}</h3>
            </div>

            <div class="button" @click="nextTrack">
              <h3>SKIP</h3>
            </div>
          </div>

          <div class="seperator" />
        </div>

        <host-queue/>
      </div>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapGetters } from "vuex";

  import HostQueue from "@/components/Host/Queue";

  export default {
    name: "host-settings",
    components: {
      HostQueue
    },
    data: function() {
      return {
        password: ""
      };
    },
    computed: {
      ...mapGetters({
        currentPlayback: "player/getPlayback",
        player: "player/getPlayer",
        queueID: "queue/getQueueID",
      }),
      currentTrack: function() {
        if (this.currentPlayback.item) {
          var track = {
            id: this.currentPlayback.item.id,
            title: this.currentPlayback.item.name,
            artist: this.currentPlayback.item.artists[0].name,
            duration: this.currentPlayback.item.duration_ms,
            coverURL: this.currentPlayback.item.album.images[1].url,
            isPlaying: this.currentPlayback.is_playing
          };

          api.queue.setCurrentTrack(track);

          return track;
        } else {
          return null;
        }
      }
    },
    methods: {
      nextTrack: async function() {
        var result = await api.queue.nextTrack(this.$store);

        if (result.data) {
          api.spotify.player.play(["spotify:track:" + result.data.track.id]);
        } else {
          console.log("Probably no tracks in Queue!");
        }
      },
      togglePlayback: async function() {
        if (this.player) {
          this.player.togglePlay();
        }
      },
      setPassword: async function() {
       api.queue.setPassword(this.queueID, this.password).then((res) => {
         console.log(res);
       });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #3e3e3e16;
    color: white;

    .headerSpacer {
      width: 100%;
      height: 10.75em;
      min-height: 10.75em;
      width: 100%;
      flex: 0;
    }

    .settings {
      padding: 0 0 0 50px;
      display: flex;
      flex-grow: 1;
      height: 50%;

      .columnLeft {
        flex: 50%;
      }

      .columnRight {
        display: flex;
        flex-direction: column;
        flex: 50%;
        overflow:hidden;
      }

      .queueHeader {
        flex: 0;

        .header {
          display: flex;
          margin: 0;
          margin-right: 50px;
          justify-content: space-between;

          .queueTitle {
            font-size: 4em;
            margin: 0;
            margin-right: 25%;
            font-weight: normal;
          }

          .button {
            display: flex;
            width: 11.25em;
            justify-content: center;
            border-style: solid;
            border-width: 2px;
            border-color: white;
            transition: background-color 0.5s;

            h3 {
              position: relative;
              margin: auto;
              transition: color 0.5s;
              font-size: 2.25em;
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
      }

      .seperator {
        height: 2px;
        margin-top: 10px;
        background-image: linear-gradient(to right, #ffffff00, #ffffffff);
        box-shadow: 0px 5px 10px #000000;
      }

      .inputField {
        display: flex;
        width: 34em;
        height: 6.25em;
        justify-content: space-between;
        border-style: solid;
        border-width: 2px;
        border-color: white;
        padding: 0 25px;

        h3 {
          position: relative;
          margin: auto;
          color: white;
          font-family: "Rationale", sans-serif;
          font-size: 2.25em;
          font-weight: normal;
          transition: color 0.5s;
        }

        input {
          margin: 0;
          margin-left: 25px;
          flex-grow: 1;
          color: white;
          background-color: transparent;
          border: none;
          outline: none;
          text-align: right;
          font-family: "Rationale";
          font-weight: normal;
          font-size: 2.25em;
          transition: color 0.5s;
        }

        input::placeholder {
          color: white;
        }
      }
    }
  }

  .blur {
    backdrop-filter: blur(20px);
  }
</style>
