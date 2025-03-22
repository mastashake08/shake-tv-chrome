<template>
    <div>
      <video
        ref="videoPlayer"
        class="video-js vjs-default-skin"
        controls
        preload="auto"
        width="600"
        height="400"
      ></video>
    </div>
  </template>
  
  <script setup>
  import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
  import videojs from 'video.js';
  import playlistPlugin from 'videojs-playlist';
  import airplay from '@silvermine/videojs-airplay';
  import 'video.js/dist/video-js.css';
  
  const props = defineProps({
    playlist: Array
  });
  
  const videoPlayer = ref(null);
  let player = null;
  
  onMounted(() => {
    player = videojs(videoPlayer.value, { autoplay: true, controls: true });
    player.playlist(playlistPlugin);
    player.registerPlugin('airplay', airplay);
    updatePlaylist();
  });
  
  watch(() => props.playlist, updatePlaylist);
  
  function updatePlaylist() {
    if (player && props.playlist && props.playlist.length > 0) {
      player.playlist(props.playlist);
      player.playlist.autoadvance(0);
      player.playlist.currentItem(0);
    }
  }
  
  onBeforeUnmount(() => {
    if (player) player.dispose();
  });
  </script>
  
  <style>
  .video-js {
    margin: 30px auto;
    max-width: 80%;
    border-radius: 10px;
    overflow: hidden;
  }
  </style>
  