<template>
  <div class="scroll">
    <div class="spacer" />
    <transition-group name="fade" appear mode="out-in">
      <mobile-preview
        class="mobile-preview"
        v-for="(result, index) in results"
        :key="result.id"
        :id="result.id"
        :title="result.title"
        :artist="result.artist"
        :duration="result.duration"
        :coverURL="result.coverURL"
        :spacer="showSpacer(index)"
      ></mobile-preview>
    </transition-group>
    <div class="spacer" />
    <div class="spacer" />
  </div>
</template>

<script>
  import api from "@/api";
  import lodash from "lodash";
  import MobilePreview from "./MobilePreview";

  export default {
    name: "mobile-search",
    props: ["searchInput"],
    data: function() {
      return {
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
      showSpacer: function(index) {
        return index != this.results.length - 1;
      },
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
  .spacer {
    height: 6.5em;
  }

  .scroll {
    overflow: auto;
    height: 100%;
    width: 100%;
  }

  .scroll::-webkit-scrollbar {
    width: 0px;
  }

  .mobile-preview {
    transition: all 0.5s;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
