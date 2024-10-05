import { reactive, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'

export const useServerStore = defineStore('server', () => {
  const ObsWebsocket = inject('ObsWebsocket')
  const serverConfig = reactive({
    addr: undefined,
    port: 4455,
    password: undefined,
    isConnected: false
  })
  const isConnected = computed(() => serverConfig.isConnected)

  function connect(addr, port, password) {
    serverConfig.addr = addr
    serverConfig.port = port
    serverConfig.password = password
    serverConfig.isConnected = false

    localStorage.setItem('serverConfig', JSON.stringify(serverConfig))
    ObsWebsocket.connect(serverConfig, () => {
      serverConfig.isConnected = true
      router.push({ name: 'scenes' })
    })
  }

  return { isConnected, connect }
})
