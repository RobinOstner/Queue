<template>
  <div class="home">
    <h1 class="title">QUEUE</h1>
    <button class="host" @click="login">Start New Queue</button>
    <button class="client" @click="join">Join Queue</button>
    <input type="text" v-model="message" />
  </div>
</template>

<script>
  import api from "@/api";
  import { mapMutations} from "vuex";

  export default {
    name: "Home",
    data: function() {
      return {
        message: ""
      };
    },
    methods: {
      ...mapMutations({
        setQueueID: "queue/SET_QUEUE_ID",
        setAccessToken: "auth/SET_ACCESS_TOKEN",
      }),
      login: function() {
        this.$store.dispatch("auth/loginHost");
      },
      join: async function() {
        console.log(this.message);
        var queueID = this.message;

        api.queue.joinQueue(this.message).then(res => {
          var token = res.data.token;
          var accessToken = res.data.accessToken;

          if (token && accessToken){
            this.setQueueID(queueID);
            this.setAccessToken(accessToken);
            this.$router.push({ path: '/guest' })
          }
        });

        // 
      }
    }
  };
</script>

<style scoped lang="scss">
  button {
    display: block;
    margin-top: 1em;
  }
</style>
