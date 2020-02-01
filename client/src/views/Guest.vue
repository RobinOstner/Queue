<template>
  <div>
    <h1 class="title">GUEST</h1>
    <h2>{{ currentTrack.title }}</h2>
    <h3>{{ currentTrack.artist }}</h3>
    <div class="layout">
      <search class="column" />
      <queue class="column" />
    </div>
  </div>
</template>

<script>
  import Search from "@/components/Search";
  import Queue from "@/components/Queue";

  import api from "@/api";

  export default {
    name: "Guest",
    components: {
      Search,
      Queue
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
    methods: {
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
  h2 {
    margin: 0;
  }

  h3 {
    margin: 0;
  }

  .layout {
    display: flex;
  }

  .column {
    flex: 50%;
  }
</style>
