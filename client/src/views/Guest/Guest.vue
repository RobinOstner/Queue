<template>
  <div class="guest">
    <guest-desktop v-if="!isMobile()" v-bind:current-track="this.currentTrack" v-bind:queueID="this.queueID()"></guest-desktop>
    <guest-mobile v-else v-bind:current-track="this.currentTrack" v-bind:queueID="this.queueID()"></guest-mobile>
  </div>
</template>

<script>
  import api from "@/api";
  import GuestDesktop from "./GuestDesktop";
  import GuestMobile from "./GuestMobile";

  import { mapGetters } from "vuex";

  export default {
    name: "Guest",
    components: {
      GuestDesktop,
      GuestMobile
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
    methods: {
      ...mapGetters("queue", {
        queueID: "getQueueID"
      }),
      isMobile() {
        return this.$isMobile();
      },
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
    },
    created: function() {
      this.timer = setInterval(this.timerCallback, this.$store.getters["queue/getRefreshTime"]);

      window.addEventListener("beforeunload", this.clearTimer);
    }
  };
</script>

<style lang="scss" scoped>
  .guest {
    height: 100%;
    width: 100%;
  }
</style>
