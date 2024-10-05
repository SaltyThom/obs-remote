import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ObsWebsocket from './websocket/ObsWebsocket'

const app = createApp(App)
const obsWebsocket = new ObsWebsocket()

// Only for debug
window.ObsWebsocket = obsWebsocket

app.provide('ObsWebsocket', obsWebsocket)

app.use(createPinia())
app.use(router)

app.mount('#app')
