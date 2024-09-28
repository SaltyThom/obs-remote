<script setup>
import { inject, ref, onMounted } from 'vue'
import Card from '@/components/Card.vue'

const currentSceneName = ref()
const scenesList = ref([])
const ObsWebsocket = inject('ObsWebsocket')

onMounted(() => {
  ObsWebsocket.request('GetSceneList', (data) => {
    currentSceneName.value = data.responseData.currentProgramSceneName
    if (data.responseData.scenes) {
      data.responseData.scenes.forEach((scene) => {
        scenesList.value.push(scene)
      })
    }
  })

  ObsWebsocket.addEventListener('CurrentProgramSceneChanged', (data) => {
    currentSceneName.value = data.eventData.sceneName
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
        :class="{ 'bg-emerald-600 text-emerald-100': scene.sceneName === currentSceneName }"
        class="cursor-pointer"
        @click="changeScene(scene.sceneName)"
      >{{ scene.sceneName }}</Card>
    </div>
  </main>
</template>
