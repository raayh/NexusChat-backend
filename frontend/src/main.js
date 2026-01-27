if (typeof window !== 'undefined' && !window.global) window.global = window;

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { useChatStore } from './stores/chat'
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

const app = createApp(App);

app.use(createPinia())
app.use(router)

app.mount('#app')

const chatStore = useChatStore();
chatStore.init();

app.use(Toast, {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});
