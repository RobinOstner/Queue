<template>
  <div class="home" @click="closeQueueInput">
    <div class="header">
      <h1 class="title left">QUEUE</h1>
    </div>

    <div class="login">
      <div class="guest input" ref="guestButton">
        <h2>QUEUE:</h2>
        <input class="inputField" ref="guestInput" v-model="message" type="text" maxlength="6" v-on:keyup.enter="joinClicked" v-on:keyup="queueInputChange" />
      </div>

      <transition name="fade" mode="out-in">
        <div class="password" @click.stop="openQueueInput" ref="passwordButton" v-show="this.hasPassword">
          <h2>PASSWORD:</h2>
          <input class="inputField" ref="guestPasswordInput" v-model="password" type="password" v-on:keyup.enter="joinWithPasswordClicked" />
        </div>
      </transition>
    </div>

    <transition name="fade" mode="in-out">
      <div class="joinButton" v-if="this.queueInputComplete" @click="joinClicked">
        <h2>JOIN</h2>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "HomeMobile",
    data: function() {
      return {
        message: "",
        password: "",
        windowWidth: 0,
        queueInputActive: false,
        hasPassword: false
      };
    },
    computed: {
      queueInputComplete: function() {
        return this.message.length == 6;
      }
    },
    methods: {
      joinClicked() {
        if (this.hasPassword) {
          this.$emit("joinWithPassword", this.message, this.password);
        } else {
          this.$emit("join", this.message);
        }
      },
      joinWithPasswordClicked() {
        this.$emit("joinWithPassword", this.message, this.password);
      },
      openQueueInput() {
        if (!this.queueInputActive) {
          this.queueInputActive = true;

          this.$refs.guestButton.classList.remove("button");
          this.$refs.guestButton.classList.add("input");

          this.$nextTick(function() {
            this.$refs.guestInput.select();
          });
        }
      },
      closeQueueInput() {
        this.queueInputActive = false;
      },
      queueInputChange() {
        if (this.hasPassword) {
          this.hasPassword = false;

          var guestButton = this.$refs.guestButton;
          var offset = guestButton.getBoundingClientRect().height * 1.5;

          this.$anime({
            targets: ".guest",
            translateY: 0,
            duration: 1000
          });
        }
      },
      queueHasPassword() {
        this.hasPassword = true;

        var guestButton = this.$refs.guestButton;

        var offset = guestButton.getBoundingClientRect().height * 1.5;

        this.$anime({
          targets: ".guest",
          translateY: -offset,
          duration: 1000
        });

        this.$nextTick(function() {
          this.$refs.guestPasswordInput.select();
        });
      }
    },
    created: function() {
      this.$parent.$on("hasPassword", this.queueHasPassword);
    }
  };
</script>

<style lang="scss" scoped>
  .home {
    background-image: url("/Images/HomeBackground.jpg");
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .header {
    overflow: hidden;
    padding: 20px;

    .title {
      margin: 0;
      color: white;
      font-family: "Rationale", sans-serif;
      font-size: 2.5em;
      font-weight: normal;
    }

    .left {
      float: left;
    }
  }

  .login {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    .input {
      position: absolute;
      width: 75%;
      max-width: 300px;
      min-width: 150px;
      display: flex;
      justify-content: center;
      border-style: solid;
      border-width: 2px;
      border-color: white;
      transition: background-color 0.5s;

      h2 {
        position: relative;
        color: white;
        font-family: "Rationale";
        margin: 0.5em;
        font-size: 1.25em;
        transition: color 0.5s;
        font-weight: normal;
      }

      input {
        position: relative;
        width: 75%;
        margin: 0;
        color: white;
        background-color: transparent;
        border: none;
        outline: none;
        text-align: right;
        font-family: "Rationale";
        font-weight: normal;
        font-size: 1.25em;
        transition: color 0.5s;
      }

      input::placeholder {
        color: white;
      }

      .inputField {
        width: 75%;
        right: 10px;
      }
    }

    .password {
      position: absolute;
      width: 75%;
      max-width: 300px;
      min-width: 150px;
      display: flex;
      justify-content: center;
      border-style: solid;
      border-width: 2px;
      border-color: white;

      h2 {
        position: relative;
        color: white;
        font-family: "Rationale";
        margin: 0.5em;
        font-size: 1.25em;
        transition: color 0.5s;
        font-weight: normal;
      }

      input {
        position: relative;
        width: 100%;
        right: 10px;
        color: white;
        background-color: transparent;
        border: none;
        outline: none;
        text-align: right;
        font-family: "Rationale";
        font-weight: normal;
        font-size: 1.25em;
      }
    }
  }

  .joinButton {
    position: absolute;
    margin: 0;
    bottom: 2em;
    left: 50%;
    transform: translate(-50%, 0);
    width: 50%;
    max-width: 200px;
    min-width: 150px;
    background-color: white;
    transition: background-color 0.5s;

    h2 {
      width: 100%;
      position: relative;
      font-family: "Rationale";
      margin: 10px 0;
      font-size: 1.25em;
      transition: color 0.5s;
      font-weight: normal;
      text-align: center;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 1s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
