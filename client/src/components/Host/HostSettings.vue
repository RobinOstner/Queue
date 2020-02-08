<template>
  <div class="settings blur"></div>
</template>

<script>
  export default {
    name: "host-settings"
  };
</script>

<style lang="scss" scoped>
  .settings {
    width: 100%;
    height: 100%;
    background-color: #3E3E3E16;
    transition: backdrop-filter 1s;
  }

  .blur {
    backdrop-filter: blur(20px);
  }
</style>
