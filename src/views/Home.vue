<template>
    <div>
      <h1>Shake TV 📺</h1>
      <button @click="loadPlaylist">Load Playlist</button>
  
      <div v-if="videoPlaylist.length > 0" class="playlist">
        <div v-for="(item, index) in videoPlaylist" :key="index" class="playlist-item">
          <img v-if="item.icon" :src="item.icon" alt="Icon" class="thumbnail" />
          <button @click="playStream(index)" class="playlist-button">
            {{ item.title || 'Unknown Channel' }}
          </button>
        </div>
      </div>
  
      <VideoPlayer v-if="currentPlaylist.length > 0" :playlist="currentPlaylist" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import VideoPlayer from '../components/VideoPlayer.vue';
  
  const videoPlaylist = ref([]);
  const currentPlaylist = ref([]);
  
  async function loadPlaylist() {
    const playlistUrl = 'https://iptv-org.github.io/iptv/categories/animation.m3u';
    const channelsUrl = 'https://iptv-org.github.io/api/channels.json';
    
    try {
      const [playlistResponse, channelsResponse] = await Promise.all([
        fetch(playlistUrl),
        fetch(channelsUrl)
      ]);
      
      const playlistText = await playlistResponse.text();
      const channelsData = await channelsResponse.json();
  
      // Extract URLs from .m3u file
      const urls = playlistText.match(/https?:\/\/[^\s]+/g) || [];
      
      // Filter only HTTPS URLs
      const httpsUrls = urls.filter(url => url.startsWith('https://'));
  
      // Validate URLs
      const validUrls = [];
      for (const url of httpsUrls) {
        try {
          const res = await fetch(url, { method: 'HEAD' });
          if (res.ok) validUrls.push(url);
        } catch (e) {
          console.warn(`Invalid URL: ${url}`);
        }
      }
  
      // Prepare playlist with icons and titles
      videoPlaylist.value = validUrls.map(url => {
        const channel = channelsData.find(chan => url.includes(chan.id));
        return {
          title: channel ? channel.name : 'Unknown Channel',
          icon: channel ? channel.logo : null,
          sources: [{ src: url, type: 'application/x-mpegURL' }]
        };
      });
  
      console.log("Valid Streams Loaded:", videoPlaylist.value);
    } catch (error) {
      console.error('Error fetching the playlist:', error);
    }
  }
  
  function playStream(index) {
    // Load the selected stream into the current playlist
    currentPlaylist.value = [videoPlaylist.value[index]];
  }
  </script>
  
  <style>
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #00b4d8;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #0077b6;
  }
  
  .playlist {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
  }
  
  .playlist-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #1e1e1e;
    padding: 10px;
    border-radius: 8px;
    transition: transform 0.3s;
  }
  
  .playlist-item:hover {
    transform: scale(1.05);
  }
  
  .thumbnail {
    width: 80px;
    height: 80px;
    border-radius: 5px;
    margin-bottom: 5px;
  }
  
  .playlist-button {
    background-color: #00b4d8;
    border: none;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s;
  }
  
  .playlist-button:hover {
    background-color: #0077b6;
  }
  </style>
  