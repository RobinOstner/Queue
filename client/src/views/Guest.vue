<template>
  <div class="guest">
    <div class="header">
      <h1 class="title left">{{ title }}</h1>
      <h1 class="title right">{{currentTrack.title}} - {{currentTrack.artist}}</h1>
    </div>
  </div>
  <!--div>
    <h1 class="title">GUEST</h1>
    <h2>{{ currentTrack.title }}</h2>
    <h3>{{ currentTrack.artist }}</h3>
    <div class="layout">
      <search class="column" />
      <queue class="column" />
    </div>
  </div-->
</template>

<script>
  import Search from "@/components/Search";
  import Queue from "@/components/Queue";

  import api from "@/api";
  import { mapGetters } from "vuex";

  export default {
    name: "Guest",
    components: {
      // Search,
      // Queue
    },
    data: function() {
      return {
        timer: null,
        currentTrack: {
          id: "",
          title: "",
          artist: ""
        }
      };
    },
    created: function() {
      this.timer = setInterval(this.timerCallback, this.$store.getters["queue/getRefreshTime"]);

      window.addEventListener("beforeunload", this.clearTimer);
    },
    computed: {
      title: function() {
        return "Queue - " + this.queueID();
      }
    },
    methods: {
      ...mapGetters("queue", {
        queueID: "getQueueID"
      }),
      timerCallback: async function() {
        var res = await api.queue.getCurrentTrack();

        if (res) {
          this.currentTrack = res.data.track;
        }
      },
      clearTimer: () => {
        clearInterval(this.timer);
      }
    },
    beforeDestroy: function() {
      clearInterval(this.timer);
    }
  };
</script>

<style lang="scss" scoped>
  .guest {
    background-image: radial-gradient(farthest-side at 65% 35%, #0e1e31, #060c14);
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .header {
    position: relative;
    overflow: hidden;
    padding: 50px 50px 0;
    z-index: 1;

    .title {
      margin: 0;
      color: white;
      font-family: "Rationale", sans-serif;
      font-size: 4.5em;
      font-weight: normal;
      text-transform: uppercase;
    }

    .hamburger {
      width: 100px;
      height: 100px;
      transform: translateY(-10px);
    }

    .left {
      float: left;
    }

    .right {
      float: right;
    }
  }

  .center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
