import { createApp } from 'vue';
import App from './App.vue';
import './styles.css';

createApp(App).mount('#app');

// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('Service Worker Registered:', reg))
    .catch(err => console.error('Service Worker Registration Failed:', err));
}
