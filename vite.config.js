import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  plugins: [vue(), basicSsl(),VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'Shake TV',
      short_name: 'ShakeTV',
      description: 'Stream IPTV content with Video.js and AirPlay support',
      theme_color: '#121212',
      background_color: '#121212',
      display: 'standalone',
      icons: [
        {
          src: 'vite.svg',
          sizes: '144x144',
          type: 'image/svg',
          purpose: 'any'
        },
        {
          src: 'vite.svg',
          sizes: '512x512',
          type: 'image/svg',
          purpose: 'any maskable'
        }
      ]
    }
  })],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
});
