<template>
  <div class="guest">
    <div class="header">
      <h1 class="title left">{{ title }}</h1>
      <h1 class="title right">{{ currentTrack.title }} - {{ currentTrack.artist }}</h1>
    </div>
    <div class="content">
      <div class="columnLeft">
        <desktop-search />
      </div>

      <div class="columnRight">
        <div class="queueHeader">
          <h2 class="queueTitle">QUEUE</h2>

          <div class="seperator" />
        </div>

        <host-queue />
      </div>
    </div>
  </div>
</template>

<script>
  import DesktopSearch from "@/components/Search/Guest/Desktop";
  import HostQueue from "@/components/Queue"

  import api from "@/api";

  export default {
    name: "Guest",
    components: {
      DesktopSearch,
      HostQueue
    },
    props: {
      queueID: Number,
      currentTrack: Object
    },
    computed: {
      title: function() {
        return "Queue - " + this.queueID;
      }
    },
  };
</script>

<style lang="scss" scoped>
  .guest {
    background-image: radial-gradient(farthest-side at 65% 35%, #0e1e31, #060c14);
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    color: white;
  }

  .header {
    position: relative;
    overflow: hidden;
    padding: 50px 50px 0;
    z-index: 1;

    .title {
      margin: 0;
      color: white;
      font-family: "Rationale", sans-serif;
      font-size: 4.5em;
      font-weight: normal;
      text-transform: uppercase;
    }

    .hamburger {
      width: 100px;
      height: 100px;
      transform: translateY(-10px);
    }

    .left {
      float: left;
    }

    .right {
      float: right;
    }
  }

  .center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .content {
    position: absolute;
    top: 10.75em;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 0 0 50px;
    display: flex;
    flex-grow: 1;

    .columnLeft {
      flex: 60%;
      display: flex;
      flex-direction: column;
      padding-right: 50px;
    }

    .columnRight {
      display: flex;
      flex-direction: column;
      flex: 40%;
      overflow: hidden;
    }

    .queueHeader {
      flex: 0;

      .queueTitle {
        font-size: 4em;
        margin: 0;
        text-align: center;
        font-weight: normal;
      }

      .button {
        display: flex;
        width: 11.25em;
        justify-content: center;
        border-style: solid;
        border-width: 2px;
        border-color: white;
        transition: background-color 0.5s;

        h3 {
          position: relative;
          margin: auto;
          transition: color 0.5s;
          font-size: 2.25em;
          font-weight: normal;
          text-align: center;
        }

        &:hover {
          cursor: pointer;
          background-color: white;

          h3 {
            color: black;
          }
        }
      }
    }

    .seperator {
      height: 2px;
      margin-top: 10px;
      background-image: linear-gradient(to right, #ffffff00, #ffffffff);
      box-shadow: 0px 5px 10px #000000;
    }
  }
</style>
