<script setup>
import { ref, getCurrentInstance } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const links = ref([
  {
    hrefName: 'connect',
    title: 'Connect'
  }, 
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
      <nav>
        <RouterLink
          v-for="link in links"
          :to="{ name: link.hrefName }"
          class="inline-block px-2 py-1 m-1 rounded"
        >{{ link.title }}</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
