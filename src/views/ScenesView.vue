<script setup>
import { inject, computed, onMounted } from 'vue'
import { useScenesStore } from '@/stores/scenes'
import Card from '@/components/Card.vue'

const ObsWebsocket = inject('ObsWebsocket')
const scenesStore = useScenesStore()
const currentSceneName = computed(() => scenesStore.scenes.current)
const scenesList = computed(() => scenesStore.scenes.list)

onMounted(() => {
  ObsWebsocket.request('GetSceneList', (data) => {
    scenesStore.setCurrent(data.responseData.currentProgramSceneName)
    if (data.responseData.scenes) {
      scenesStore.setList(data.responseData.scenes)
    }
  })

  ObsWebsocket.addEventListener('CurrentProgramSceneChanged', (data) => {
    scenesStore.setCurrent(data.eventData.sceneName)
  })
})

function changeScene(sceneName) {
  ObsWebsocket.request('SetCurrentProgramScene', {
    sceneName
  })
}
</script>

<template>
  <main>
    <div class="flex flex-col mt-1">
      <Card
        v-for="scene in scenesList"
        class="cursor-pointer"
        :selected="scene.sceneName === currentSceneName"
        @click="changeScene(scene.sceneName)"
      >{{ scene.sceneName }}</Card>
    </div>
  </main>
</template>
