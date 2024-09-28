import { reactive, inject } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'

export const useServerStore = defineStore('server', () => {
  const ObsWebsocket = inject('ObsWebsocket')
  const serverConfig = reactive({
    addr: undefined,
    port: 4455,
    password: undefined
  })

  function connect(addr, port, password) {
    serverConfig.addr = addr
    serverConfig.port = port
    serverConfig.password = password

    localStorage.setItem('serverConfig', JSON.stringify(serverConfig))
    ObsWebsocket.connect(serverConfig, () => {
      router.push({ name: 'scenes' })
    })
  }

  return { connect }
})
