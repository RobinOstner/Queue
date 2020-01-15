<template>
  <div>
    <input type="text" class="searchInput" v-model="inputText" />
    <p class="loadingPlaceholder" v-if="searching">Loading...</p>
    <preview 
    v-for="result in results" 
    :key="result.id" 
    v-bind:id="result.id"
    v-bind:title="result.title"
    v-bind:artist="result.artist"></preview>
  </div>
</template>

<script>
  import api from "@/api";
  import lodash from "lodash";
  import Preview from "./Preview";

  export default {
    name: "search",

    components: {
      "preview": Preview,
    },
    data: function() {
      return {
        inputText: "",
        searching: false,
        results: [
          {
            id: 1,
            title: "Birthright",
            artist: "Nora En Pure",
          },
          {
            id: 2,
            title: "Birthright",
            artist: "Nora En Pure",
          }
        ]
      };
    },
    watch: {
      inputText: function(searchInput) {
        this.searching = true;
        this.debouncedSearch();
      }
    },
    created: function() {
      this.debouncedSearch = lodash.debounce(this.search, 500);
    },
    methods: {
      search: function(event) {
        this.searching = false;
        console.log("Search: ", this.inputText);
      }
    },
  };
</script>

<style lang="sass" scoped></style>
