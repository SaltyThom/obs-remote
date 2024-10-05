<script setup>
import { ref, onMounted } from 'vue'
import Card from '@/components/Card.vue'

const audioInputsList = ref([])

onMounted(() => {
  ObsWebsocket.request('GetInputList', (data) => {
    if (data && data.responseData && data.responseData.inputs) {
      data.responseData.inputs.forEach((input) => {
        input.volume = undefined
        input.muted = undefined

        ObsWebsocket.request('GetInputMute', { inputName: input.inputName },
        (d) => {
          if (d && d.responseData) {
            input.muted = d.responseData.inputMuted

            ObsWebsocket.request('GetInputVolume', { inputName: input.inputName },
            (d) => {
              if (d && d.responseData) {
                input.volume = d.responseData.inputVolumeMul
                audioInputsList.value.push(input)
              }
            })
          }
        })
      })
    }
  })
})

function toggleMuted(input) {
  ObsWebsocket.request('ToggleInputMute', { inputName: input.inputName },
  (data) => {
    input.muted = data.responseData.inputMuted
  })
}

function changeVolume(input) {
  ObsWebsocket.request('SetInputVolume', {
    inputName: input.inputName,
    inputVolumeMul: parseFloat(input.volume)
  })
}
</script>

<template>
  <main>
    <div class="flex flex-col mt-1">
      <Card
        v-for="input in audioInputsList"
        class="flex flex-col px-1"
      >
        <div class="flex flex-row">
          <span class="flex-1 p-2">{{ input.inputName }}</span>
          <div
            class="p-2 mt-1 cursor-pointer"
            @click="toggleMuted(input)"
          >
            <img
              v-if="input.muted"
              class="size-4"
              src="@/assets/icons/mute.png"
              alt="Muted"
            />
            <img
              v-else
              class="size-4"
              src="@/assets/icons/sound.png"
              alt="Sound"
            />
          </div>
        </div>
        <div>
          <input type="range" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" min="0" max="1" step="0.01" v-model="input.volume" @change="changeVolume(input)">
        </div>
      </Card>
    </div>
  </main>
</template>
