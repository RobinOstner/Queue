<template>
  <div class="guest">
    <guest-desktop v-if="!isMobile()"></guest-desktop>
    <guest-mobile v-else></guest-mobile>
  </div>
</template>

<script>
  import api from "@/api";
  import GuestDesktop from "./GuestDesktop";
  import GuestMobile from "./GuestMobile";

  export default {
    name: "Guest",
    components: {
      GuestDesktop,
      GuestMobile
    },
    methods: {
      isMobile() {
        return this.$isMobile();
      },
    }
  };
</script>

<style lang="scss" scoped>
.guest {
  height: 100%;
  width: 100%;
}
</style>
