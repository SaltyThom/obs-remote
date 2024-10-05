import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useScenesStore = defineStore('scenes', () => {
  const scenes = reactive({
    current: undefined,
    list: []
  })

  function setCurrent(scene) {
    scenes.current = scene
  }

  function setList(list) {
    while (scenes.list.length > 0) scenes.list.pop()

    list.forEach((scene) => {
      scenes.list.push(scene)
    })
  }

  return { scenes, setCurrent, setList }
})
