<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "app"
  };
</script>

<style>
  #app {
    font-family: "Rationale", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: black;
    height: 100%;
  }
  
  h1, h2, h3 {
    font-weight: normal;
  }

  ::selection {
    background: white;
  }
</style>
