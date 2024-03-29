<template>
    <div class="host">
        <div class="header">
            <transition name="fade" mode="out-in">
                <h1 class="title left" v-bind:key="this.settingsOpen">{{ title }}</h1>
            </transition>
            <hamburger class="hamburger right" @click.native="toggleSettings" ref="settingsButton"/>
        </div>
        <current-song class="center"/>

    <transition name="blur">
      <host-settings class="settings" v-if="this.settingsOpen" ref="settings" />
    </transition>
  </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import axios from "axios";

    import CurrentSong from "@/components/Host/CurrentSong";
    import Hamburger from "@/components/Buttons/Hamburger";
    import HostSettings from "@/components/Host/HostSettings";
    import api from "@/api"

    export default {
        name: "Host",
        components: {
            CurrentSong,
            Hamburger,
            HostSettings
        },
        data: function () {
            return {
                settingsOpen: false,
                spotifyAccessTokenRefresh: ""
            };
        },
        computed: {
            title: function () {
                if (this.settingsOpen) {
                    return "Settings";
                } else {
                    return "Queue - " + this.queueID();
                }
            }
        },
        methods: {
            ...mapGetters("queue", {
                queueID: "getQueueID"
            }),
            ...mapActions("auth", ["setAccessToken", "setRefreshToken", "setExpiryTime"]),
            ...mapActions({
                initPlayer: "player/init",
                createQueue: "queue/createQueue"
            }),
            toggleSettings: function () {
                this.settingsOpen = !this.settingsOpen;
                this.$refs.settingsButton.toggle();
            },
            refreshSpotifyToken: function () {
                api.auth.refreshToken(this.$cookies.get('spotifyRefresh'), this.queueID()).then( res => {
                    this.setAccessToken(res.data.access_token);
                });
            },
        },
        mounted() {
            let spotifyPlayerScript = document.createElement("script");
            spotifyPlayerScript.setAttribute("src", "https://sdk.scdn.co/spotify-player.js");
            document.body.appendChild(spotifyPlayerScript);
        },
        created() {
            const {access_token, refresh_token, expires_in, error} = this.$route.query;

            if (error) {
                console.error(error);
            } else if (access_token && refresh_token && expires_in) {
                this.setAccessToken(access_token);
                this.setRefreshToken(refresh_token);
                this.setExpiryTime(expires_in);

                this.$cookies.set('spotifyRefresh', refresh_token, 1000 * 3600 * 24 * 7);
                this.$router.replace("/host");

                this.initPlayer(null, {root: true});
                this.createQueue(null, {root: true});
                this.spotifyAccessTokenRefresh = setInterval(this.refreshSpotifyToken, 20 * 1000);
            }
        }
    };
</script>

<style scoped lang="scss">
    .host {
        background-image: radial-gradient(farthest-side at 65% 35%, #0e1e31, #060c14);
        height: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
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
            font-size: 3.5em;
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

    .settings {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

    .blur-enter-active,
    .blur-leave-active {
        transition: backdrop-filter .5s, background-color .5s, opacity 1s;
    }

    .blur-enter,
    .blur-leave-to {
        backdrop-filter: none;
        background-color: #3E3E3E00;
        opacity: 0;
    }
</style>
