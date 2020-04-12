<template>
  <div class="home" @click="closeQueueInput">
    <div class="header">
      <h1 class="title left">QUEUE</h1>
      <h1 class="title right">CONTACT</h1>
    </div>
    <div class="login">
      <div class="button host" @click="loginClicked" ref="hostButton">
        <h2>HOST</h2>
      </div>
      <div class="button guest" @click.stop="openQueueInput" ref="guestButton">
        <h2 v-if="!this.queueInputActive">GUEST</h2>
        <h2 v-if="this.queueInputActive">QUEUE:</h2>
        <input class="inputField" ref="guestInput" v-model="message" v-if="this.queueInputActive" type="text" maxlength="6" v-on:keyup.enter="joinClicked" v-on:keyup="queueInputChange" />

        <transition name="fade" mode="out-in">
          <div class="joinButton" v-if="this.queueInputActive && this.queueInputComplete && !this.hasPassword" @click="joinClicked">
            <svg class="arrow" viewBox="0 0 120 120">
              <g>
                <path class="line" d="M40,20L80,60L40,100" />
              </g>
            </svg>
          </div>
        </transition>
      </div>

      <transition name="fade" mode="out-in">
        <div class="password" @click.stop="openQueueInput" ref="passwordButton" v-if="this.hasPassword && this.queueInputActive">
          <h2>PASSWORD:</h2>
          <input class="inputField" ref="guestPasswordInput" v-model="password" type="password" v-on:keyup.enter="joinWithPasswordClicked" />

          <div class="joinButton" v-if="this.queueInputComplete" @click="joinWithPasswordClicked">
            <svg class="arrow" viewBox="0 0 120 120">
              <g>
                <path class="line" d="M40,20L80,60L40,100" />
              </g>
            </svg>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: "HomeDesktop",
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
      loginClicked() {
        this.$emit("login");
      },
      joinClicked() {
        this.$emit("join", this.message);
      },
      joinWithPasswordClicked() {
        this.$emit("joinWithPassword", this.message, this.password);
      },
      openQueueInput() {
        if (!this.queueInputActive) {
          this.queueInputActive = true;

          this.$refs.hostButton.style.pointerEvents = "none";

          this.$refs.guestButton.classList.remove("button");
          this.$refs.guestButton.classList.add("input");

          var rect = this.$refs.guestButton.getBoundingClientRect();

          var offset = rect.x - window.innerWidth / 2 + rect.width / 2;

          if (this.hasPassword) {
            offset += rect.width / 2 + rect.width / 6;

            this.$nextTick(function() {
              var passwordButton = this.$refs.passwordButton;

              var rect = passwordButton.getBoundingClientRect();

              var offset = window.innerWidth / 4 - rect.width / 6;

              this.$anime({
                targets: passwordButton,
                translateX: -offset,
                duration: 1000
              });
            });
          }

          this.$nextTick(function() {
            this.$refs.guestInput.select();
          });

          this.$anime({
            targets: ".guest",
            translateX: -offset,
            duration: 1000
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
      queueInputChange() {
        if (this.hasPassword) {
          this.hasPassword = false;

          var rect = this.$refs.guestButton.getBoundingClientRect();

          var offset = window.innerWidth / 4;

          this.$anime({
            targets: ".guest",
            translateX: -offset,
            duration: 1000
          });
        }
      },
      queueHasPassword() {
        this.hasPassword = true;

        var offset = window.innerWidth / 4 + this.$refs.guestButton.getBoundingClientRect().width / 2 + this.$refs.guestButton.getBoundingClientRect().width / 6;

        this.$anime({
          targets: ".guest",
          translateX: -offset,
          duration: 1000
        });

        this.$nextTick(function() {
          this.$refs.guestPasswordInput.select();

          var passwordButton = this.$refs.passwordButton;
          var rect = passwordButton.getBoundingClientRect();

          var offset = window.innerWidth / 4 - rect.width / 6;

          this.$anime({
            targets: passwordButton,
            translateX: -offset,
            duration: 1000
          });
        });
      },
    },
    created: function() {
      this.$parent.$on("hasPassword", this.queueHasPassword);
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
      font-size: 3.5em;
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

    .inputField {
      width: 200px;
    }

    .joinButton {
      position: absolute;
      width: 15%;
      height: 100%;
      right: 0;
      border-width: 2px;
      border-style: solid;
      border-color: white;
      transform: translate(115%, -2px);
      transition: background-color 0.5s;

      .arrow {
        position: relative;
        margin: auto;
        top: 50%;
        transform: translateY(-50%);

        .line {
          stroke: white;
          stroke-width: 12px;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: transparent;
          transition: stroke 0.5s;
        }
      }

      &:hover {
        cursor: pointer;
        background-color: white;

        .line {
          stroke: #333;
        }
      }
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 1s;
    }
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
  }

  .password {
    position: absolute;
    width: 400px;
    height: 111px;
    display: flex;
    color: white;
    border-style: solid;
    left: 75%;

    h2 {
      position: absolute;
      top: 50%;
      left: 25px;
      transform: translate(0, -50%);
      margin: 0;
      color: white;
      font-family: "Rationale";
      font-size: 2.25em;
      font-weight: normal;
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

    .joinButton {
      position: absolute;
      width: 15%;
      height: 100%;
      right: 0;
      border-width: 2px;
      border-style: solid;
      border-color: white;
      transform: translate(115%, -2px);
      transition: background-color 0.5s;

      .arrow {
        position: relative;
        margin: auto;
        top: 50%;
        transform: translateY(-50%);

        .line {
          stroke: white;
          stroke-width: 12px;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: transparent;
          transition: stroke 0.5s;
        }
      }

      &:hover {
        cursor: pointer;
        background-color: white;

        .line {
          stroke: #333;
        }
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
