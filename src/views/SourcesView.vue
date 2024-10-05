<script setup>
import { inject, ref, computed, onMounted } from 'vue'
import { useScenesStore } from '@/stores/scenes'
import Card from '@/components/Card.vue'

const scenesStore = useScenesStore()
const sourcesList = ref([])
const ObsWebsocket = inject('ObsWebsocket')

const currentSceneName = computed(() => scenesStore.scenes.current)

onMounted(() => {
  ObsWebsocket.request('GetSceneItemList', {
    sceneName: currentSceneName.value
  },
  (data) => {
    if (data.responseData.sceneItems) {
      data.responseData.sceneItems.forEach((source) => {
        source.childrenIsOpen = false
        source.children = []
        sourcesList.value.unshift(source)
      })
    }
  })
})

function toggleGroup(position, source) {
  if (source.isGroup) {
    // Close all other group
    sourcesList.value.forEach((s, p) => {
      if (p != position) s.childrenIsOpen = false
    })

    // Invert state of actual group
    source.childrenIsOpen = !source.childrenIsOpen

    // Load children of current group
    ObsWebsocket.request('GetGroupSceneItemList', {
      sceneName: source.sourceName
    }, (data) => {
      if (data.responseData.sceneItems && data.responseData.sceneItems.length > 0) {
        // Remove all previous children
        while (sourcesList.value[position].children.length > 0) sourcesList.value[position].children.pop()

        // Add children loaded
        data.responseData.sceneItems.forEach((childSource) => {
          sourcesList.value[position].children.push(childSource)
        })
      }
    })
  }
}

function toggleSourceEnabled(source) {
  ObsWebsocket.request('SetSceneItemEnabled', {
    sceneName: currentSceneName.value,
    sceneItemId: source.sceneItemId,
    sceneItemEnabled: !source.sceneItemEnabled
  },
  (data) => {
    if (data && 100 === data.requestStatus.code) {
      source.sceneItemEnabled = !source.sceneItemEnabled
    }
  })
}
</script>

<template>
  <main>
    <div class="flex flex-col mt-1">
      <Card
        v-for="(source, position) in sourcesList"
        class="flex flex-col"
        :class="{ 'cursor-pointer': source.isGroup }"
        @click="toggleGroup(position, source)"
      >
        <div class="flex flex-row px-1">
          <img
            v-if="source.isGroup"
            class="size-4 mt-3 mr-2"
            src="@/assets/icons/folder.png"
            alt="Group"
          />
          <span class="flex-1 p-2">{{ source.sourceName }}</span>
          <div
            class="p-2 mt-1 cursor-pointer"
            @click="toggleSourceEnabled(source)"
          >
            <img
              v-if="source.sceneItemEnabled"
              class="size-4"
              src="@/assets/icons/show.png"
              alt="Show"
            />
            <img
              v-else
              class="size-4"
              src="@/assets/icons/hide.png"
              alt="Hide"
            />
          </div>
        </div>
        <div v-if="source.children.length > 0 && source.childrenIsOpen">
          <Card
            v-for="child in source.children"
            class="flex flew-col bg-slate-700"
          >
            <span class="flex-1 p-2">{{ child.sourceName }}</span>
          </Card>
        </div>
      </Card>
    </div>
  </main>
</template>
