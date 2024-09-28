<script setup>
import { reactive, ref, onMounted } from 'vue'
import Card from '@/components/Card.vue'
import { useServerStore } from '@/stores/server'


const isPassword = ref(true)
const inputs = reactive ({
  addr: undefined,
  port: 4455,
  password: undefined
})

onMounted(() => {
  const savedCredentials = localStorage.getItem('serverConfig')

  if (savedCredentials) {
    const credentials = JSON.parse(savedCredentials)

    inputs.addr = credentials.addr
    inputs.port = credentials.port
    inputs.password = credentials.password
  }
})

const serverStore = useServerStore()

function onSubmit() {
  serverStore.connect(inputs.addr, inputs.port, inputs.password)
}
</script>

<template>
  <main>
    <div class="flex flex-col">
      <form action="#" method="POST" @submit.prevent="onSubmit">
        <div class="m-2">
          <label for="addr" class="block text-sm font-semibold leading-6">IP du serveur</label>
          <div class="mt-1">
            <input type="text" name="addr" id="addr" autocomplete="given-name" class="block w-full rounded-md border-0 p-1.5 outline-none bg-slate-800 text-slate-400 shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-600" placeholder="192.168.0.10" v-model="inputs.addr" />
          </div>
        </div>
        <div class="m-2">
          <label for="port" class="block text-sm font-semibold leading-6">Port serveur</label>
          <div class="mt-1">
            <input type="text" name="port" id="port" autocomplete="given-name" class="block w-full rounded-md border-0 p-1.5 outline-none bg-slate-800 text-slate-400 shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-600" placeholder="4455" v-model="inputs.port" />
          </div>
        </div>
        <div class="m-2">
          <label for="addr" class="block text-sm font-semibold leading-6">Mot de passe du serveur</label>
          <div class="mt-1 relative">
            <input
              :type="isPassword ? 'password' : 'text'"
              name="addr"
              id="addr"
              autocomplete="none"
              class="block w-full rounded-md border-0 p-1.5 outline-none bg-slate-800 text-slate-400 shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-600"
               v-model="inputs.password"
            />
            <div class="absolute top-2 right-2 cursor-pointer">
              <img
                v-if="isPassword"
                class="size-5"
                src="@/assets/icons/show.png"
                alt="Show"
                @click="isPassword = false"
              />
              <img
                v-else
                class="size-5"
                src="@/assets/icons/hide.png"
                alt="Hide"
                @click="isPassword = true"
              />
            </div>
          </div>
        </div>
        <div class="mx-2 my-4 text-right">
          <input type="submit" class="rounded-md bg-blue-700 text-blue-300 py-1 px-3 hover:bg-blue-900 cursor-pointer" value="Connexion" />
        </div>
      </form>
    </div>
  </main>
</template>
