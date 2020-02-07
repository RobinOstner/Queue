<template>
  <div class="home" @click="closeQueueInput">
    <div class="header">
      <h1 class="title left">QUEUE</h1>
      <h1 class="title right">CONTACT</h1>
    </div>
    <div class="login">
      <div class="button host" @click="login" ref="hostButton">
        <h2>HOST</h2>
      </div>
      <div class="button guest" @click.stop="openQueueInput" ref="guestButton">
        <h2 v-if="!this.queueInputActive">GUEST</h2>
        <h2 v-if="this.queueInputActive">QUEUE:</h2>
        <input ref="guestInput" v-model="message" v-if="this.queueInputActive" type="text" maxlength="6" v-on:keyup.enter="join"/>
      </div>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import vue from "vue";
  import { mapMutations } from "vuex";

  export default {
    name: "Home",
    data: function() {
      return {
        message: "",
        windowWidth: 0,
        queueInputActive: false
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
      openQueueInput() {
        if (!this.queueInputActive) {
          this.queueInputActive = true;

          this.$refs.hostButton.style.pointerEvents = "none";

          this.$refs.guestButton.classList.remove("button");
          this.$refs.guestButton.classList.add("input");

          var rect = this.$refs.guestButton.getBoundingClientRect();

          var offset = rect.x - window.innerWidth / 2 + rect.width / 2;

          this.$nextTick(function() {
            this.$refs.guestInput.select();
          })

          this.$anime({
            targets: ".guest",
            translateX: -offset,
            duration: 1000,
          });

          this.$anime({
            targets: ".host",
            opacity: 0,
            easing: "linear",
            duration: 100
          });
        }
      },
      closeQueueInput() {
        this.queueInputActive = false;

        this.$refs.hostButton.style.pointerEvents = "auto";

        this.$refs.guestButton.classList.add("button");
        this.$refs.guestButton.classList.remove("input");

        this.$anime({
          targets: ".guest",
          translateX: 0,
          duration: 1000
        });
        this.$anime({
          targets: ".host",
          opacity: 1,
          easing: "linear",
          duration: 100
        });
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
      font-weight: normal;
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
      font-weight: normal;
    }

    &:hover {
      cursor: pointer;
      background-color: white;

      h2 {
        color: black;
      }
    }
  }

  .input {
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
      left: 25px;
      transform: translate(0, -50%);
      margin: 0;
      color: white;
      font-family: "Rationale", sans-serif;
      font-size: 2.25em;
      font-weight: normal;
      transition: color 0.5s;
    }

    input {
      position: absolute;
      top: 50%;
      right: 25px;
      transform: translate(0, -50%);
      margin: 0;
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
</style>

<style lang="scss">
  body,
  html {
    margin: 0;
    height: 100%;
  }
</style>
