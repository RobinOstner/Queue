<template>
  <div class="home">
    <div class="header">
      <h1 class="title left">QUEUE</h1>
      <h1 class="title right">CONTACT</h1>
    </div>
    <div class="login">
      <div class="button" @click="login">
        <h2>HOST</h2>
      </div>
      <div class="button" @click="login">
        <h2>GUEST</h2>
      </div>
    </div>
    <!---input type="text" v-model="message" /--->
  </div>
</template>

<script>
  import api from "@/api";
  import { mapMutations } from "vuex";

  export default {
    name: "Home",
    data: function() {
      return {
        message: ""
      };
    },
    methods: {
      ...mapMutations({
        setQueueID: "queue/SET_QUEUE_ID",
        setAccessToken: "auth/SET_ACCESS_TOKEN"
      }),
      login: function() {
        this.$store.dispatch("auth/loginHost");
      },
      join: async function() {
        var queueID = this.message;

        api.queue.joinQueue(this.message).then(res => {
          var token = res.data.token;
          var accessToken = res.data.accessToken;

          if (token && accessToken) {
            this.setQueueID(queueID);
            this.setAccessToken(accessToken);
            this.$router.push({ path: "/guest" });
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  .home {
    background-image: url("/Images/HomeBackground.jpg");
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .header {
    overflow: hidden;
    padding: 50px;

    .title {
      margin: 0;
      color: white;
      font-family: "Rationale", sans-serif;
      font-size: 4.5em;
    }

    .left {
      float: left;
    }

    .right {
      float: right;
    }
  }

  .login {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  .button {
    width: 400px;
    height: 111px;
    display: flex;
    justify-content: center;
    border-style: solid;
    border-width: 2px;
    border-color: white;
    transition: background-color 0.5s;

    h2 {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      margin: 0;
      color: white;
      font-family: "Rationale";
      font-size: 2.25em;
      transition: color 0.5s;
    }

    &:hover {
      cursor: pointer;
      background-color: white;

      h2 {
        color: black;
      }
    }
  }
</style>

<style lang="scss">
  body,
  html {
    margin: 0;
    height: 100%;
  }
</style>
