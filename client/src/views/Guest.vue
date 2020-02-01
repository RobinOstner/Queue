<template>
  <div>
    <h1 class="title">GUEST</h1>
    <div class="layout">
      <search class="column" />
      <queue class="column" />
    </div>
  </div>
</template>

<script>
  import Search from "@/components/Search";
  import Queue from "@/components/Queue";

  export default {
    name: "Guest",
    components: {
      Search,
      Queue
    }
  };
</script>

<style lang="scss" scoped>
  .layout {
    display: flex;

  }

  .column {
    flex: 50%;
  }
</style>
