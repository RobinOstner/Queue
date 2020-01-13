<template>
  <div class="home">
    <h1 class="title">QUEUE</h1>
    <button class="host" @click="login">Start New Queue</button>
    <button class="client" @click="join">Join Queue</button>
  </div>
</template>

<script>

  export default {
    name: "Home",
    methods: {
      login: function() {
        this.$store.dispatch("auth/loginHost");
      },
      join: function() {
        this.$store.dispatch("guest/login");
        this.$router.push("/guest");
      }
    }
  };
</script>

<style scoped lang="scss">
button {
  display: block;
  margin-top: 1em;
}
</style>
