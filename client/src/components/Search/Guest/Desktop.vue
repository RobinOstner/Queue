<template>
  <div class="search-content">
    <div class="inputField">
      <h3>Search:</h3>
      <input ref="guestInput" v-model="searchInput" type="text" />
    </div>

    <div class="scroll">
      <desktop-preview
        v-for="result in results"
        :key="result.id"
        :id="result.id"
        :title="result.title"
        :artist="result.artist"
        :duration="result.duration"
        :coverURL="result.coverURL"
      ></desktop-preview>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import lodash from "lodash";
  import DesktopPreview from "./DesktopPreview";

  export default {
    name: "desktop-search",
    data: function() {
      return {
        searchInput: "",
        searching: false,
        results: []
      };
    },
    watch: {
      searchInput: function(searchInput) {
        this.searching = true;
        this.results = [];
        this.debouncedSearch();
      }
    },
    created: function() {
      this.debouncedSearch = lodash.debounce(this.search, 500);
    },
    methods: {
      search: async function(event) {
        if (this.searchInput.length > 0) {
          var result = await api.spotify.search.search(this.searchInput, 0, 20);

          this.searching = false;
          if (result) {
            result.data.tracks.items.forEach(track => {
              this.results.push({
                id: track.id,
                title: track.name,
                artist: track.artists[0].name,
                duration: track.duration_ms,
                coverURL: track.album.images[1].url
              });
            });
          }
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .search-content {
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .inputField {
    display: flex;
    height: 6.25em;
    min-height: 6.25em;
    justify-content: space-between;
    border-style: solid;
    border-width: 2px;
    border-color: white;
      box-shadow: 0px 30px 100px -25px #000000;

    h3 {
      position: relative;
      margin: auto;
      margin-left: 25px;
      color: white;
      font-family: "Rationale", sans-serif;
      font-size: 2.25em;
      font-weight: normal;
      transition: color 0.5s;
    }

    input {
      margin: 0;
      margin-left: 25px;
      margin-right: 25px;
      flex-grow: 1;
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

  .scroll {
    overflow-y: scroll;
    flex-grow: 1;
  }
  
  .scroll::-webkit-scrollbar {
    width: 0px;
  }
</style>
