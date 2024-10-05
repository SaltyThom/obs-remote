<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useServerStore } from '@/stores/server'

const serverStore = useServerStore()

const links = ref([ 
  {
    hrefName: 'scenes',
    title: 'Scenes'
  }, {
    hrefName: 'sources',
    title: 'Sources'
  }, {
    hrefName: 'audio',
    title: 'Audio'
  }, {
    hrefName: 'settings',
    title: 'Settings'
  }
])
</script>

<template>
  <header class="bg-slate-800 text-slate-300">
    <div>
      <nav class="flex flex-row">
        <div class="flex-1">
          <RouterLink
            v-if="serverStore.isConnected"
            v-for="link in links"
            :to="{ name: link.hrefName }"
            class="inline-block px-2 py-1 m-1 rounded"
          >{{ link.title }}</RouterLink>
        </div>
        <div>
          <div v-if="!serverStore.isConnected">
            <RouterLink
              :to="{ name: 'connect' }"
              class="inline-block m-1 rounded-md bg-blue-700 text-blue-300 py-1 px-3 hover:bg-blue-900 cursor-pointer"
            >Connect</RouterLink>
          </div>
        </div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
