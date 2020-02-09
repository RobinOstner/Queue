<template>
  <div>
    <input type="text" class="searchInput" v-model="inputText" />
    <p class="loadingPlaceholder" v-if="searching">Loading...</p>
    <preview v-for="result in results" :key="result.id" :id="result.id" :title="result.title" :artist="result.artist" :duration="result.duration" :coverURL="result.coverURL"></preview>
  </div>
</template>

<script>
  import api from "@/api";
  import lodash from "lodash";
  import Preview from "./Preview";

  export default {
    name: "search",

    components: {
      preview: Preview
    },
    data: function() {
      return {
        inputText: "",
        searching: false,
        results: []
      };
    },
    watch: {
      inputText: function(searchInput) {
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
        this.searching = false;
        if (this.inputText.length > 0) {
          var result = await api.spotify.search.search(this.inputText, 0, 20);

          if (result) {
            result.data.tracks.items.forEach(track => {
              this.results.push({
                id: track.id,
                title: track.name,
                artist: track.artists[0].name,
                duration: track.duration_ms,
                coverURL: track.album.images[1].url,
              });
            });
          }
        }
      }
    }
  };
</script>

<style lang="sass" scoped></style>
