<template>
  <div class="guest">
    <div class="header">
      <h1 class="title left">Queue</h1>
      <h1 class="title right">{{ queueID }}</h1>
      <transition name="fade" mode="out-in">
        <div class="trackInfo" v-if="currentTrack && currentTrack.title && currentTrack.artist">
          <h1 class="trackTitle">{{ currentTrack.title }}</h1>
          <div class="separator"></div>
          <h1 class="trackArtist">{{ currentTrack.artist }}</h1>
        </div>
      </transition>
    </div>
    <div class="content">
      <transition name="fade" mode="out-in">
        <mobile-queue v-if="searchEmpty" />
        <mobile-search v-else :search-input="searchInput" />
      </transition>

      <div class="searchBar">
        <div class="searchButton" @click.stop="openSearchBar" v-if="!searchActive">
          <div class="searchPlaceholder">
            <img src="/Icons/SearchIcon.png" alt="Search Icon" class="icon" />
            <h2 class="search">SEARCH</h2>
          </div>
        </div>
        <div class="searchContainer" v-else>
          <div class="searchInputContainer">
            <div class="searchInput">
              <img src="/Icons/SearchIcon.png" alt="Search Icon" class="icon" />
              <input class="inputField" ref="searchInput" v-model="searchInput" type="text" />
            </div>
          </div>

          <div class="returnButton" @click="closeSearchBar">
            <h2>QUEUE</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import MobileQueue from "@/components/Queue/Mobile";
  import MobileSearch from "@/components/Search/Guest/Mobile/Mobile";

  export default {
    name: "Guest",
    components: {
      MobileQueue,
      MobileSearch
    },
    computed: {
      searchEmpty: function() {
        return this.searchInput == "";
      }
    },
    data: function() {
      return {
        searchActive: false,
        searchInput: ""
      };
    },
    props: {
      queueID: String,
      currentTrack: Object
    },
    methods: {
      openSearchBar: function() {
        this.searchActive = true;

        this.$nextTick(() => {
          this.$refs.searchInput.select();
        });
      },
      closeSearchBar: function() {
        this.searchActive = false;
        this.searchInput = "";
      }
    }
  };
</script>

<style lang="scss" scoped>
  .guest {
    background-image: linear-gradient(35deg, #060c14 30%, #1a3c5c 90%);
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    color: white;
  }

  .header {
    position: relative;
    overflow: hidden;
    padding: 5px 5px 10px;
    z-index: 1;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.25);
    background-color: rgba(8, 65, 83, 0.15);
    backdrop-filter: blur(20px);

    .title {
      margin: 0;
      color: white;
      font-family: "Rationale", sans-serif;
      font-size: 1.2em;
      font-weight: normal;
      text-transform: uppercase;
      z-index: 2;
    }

    .left {
      float: left;
    }

    .right {
      float: right;
    }

    .trackInfo {
      width: 100%;
      text-align: center;
      margin: 0;
      margin-top: 15px;
      align-content: center;
      z-index: 2;

      .trackTitle {
        margin: 0;
        font-size: 1.5em;
      }

      .separator {
        height: 1px;
        width: 75%;
        background-color: white;
        margin: 5px auto;
      }

      .trackArtist {
        margin: 0;
        font-size: 1.2em;
      }
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
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 0 0 0;
    flex-grow: 1;

    host-queue {
      width: 100%;
    }

    mobile-search {
      width: 100%;
    }

    .searchBar {
      position: absolute;
      bottom: 0;
      background-image: linear-gradient(0deg, #060c14 25%, #060c1400);
      height: 35%;
      width: 100%;
      pointer-events: none;

      .searchButton {
        position: absolute;
        bottom: 10%;
        left: 0;
        right: 0;
        margin: auto;
        width: 90%;
        height: 2.5em;
        border-style: solid;
        border-width: 1px;
        border-color: white;
        text-align: center;
        display: flex;
        pointer-events: all;

        .searchPlaceholder {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;

          .icon {
            height: 40%;
            width: auto;
          }

          h2 {
            margin: 5px;
            font-weight: normal;
            font-size: 1em;
          }
        }
      }

      .searchContainer {
        position: absolute;
        bottom: 10%;
        left: 0;
        right: 0;
        margin: auto;
        width: 90%;
        height: 2.5em;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .searchInputContainer {
          position: relative;
          border-style: solid;
          border-width: 1px;
          border-color: white;
          text-align: center;
          display: flex;
          pointer-events: all;
          height: 2.5em;
          width: 70%;

          .searchInput {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: left;
            overflow: hidden;

            .icon {
              height: 40%;
              width: auto;
              margin: 10px;
            }

            .inputField {
              flex-grow: 0;
              height: 80%;
              width: 90%;
              color: white;
              background-color: transparent;
              border: none;
              outline: none;
              text-align: left;
              font-family: "Rationale";
              font-weight: normal;
              font-size: 1em;
            }
          }
        }

        .returnButton {
          border-style: solid;
          border-width: 1px;
          border-color: white;
          background-color: white;
          color: black;
          text-align: center;
          display: flex;
          pointer-events: all;
          height: 2.5em;
          width: 25%;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: all;

          h2 {
            margin: 5px;
            font-weight: normal;
            font-size: 1em;
          }
        }
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
