import { createRouter, createWebHistory } from 'vue-router'
import { inject } from 'vue'

const router = createRouter({
  linkExactActiveClass: 'bg-slate-900',
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'connect',
      meta: { requireSocket: false },
      component: () => import('../views/ConnectView.vue')
    },
    {
      path: '/scenes',
      name: 'scenes',
      meta: { requireSocket: true },
      component: () => import('../views/ScenesView.vue')
    },
    {
      path: '/sources',
      name: 'sources',
      meta: { requireSocket: true },
      component: () => import('../views/SourcesView.vue')
    },
    {
      path: '/audio',
      name: 'audio',
      meta: { requireSocket: true },
      component: () => import('../views/AudioView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      meta: { requireSocket: true },
      component: () => import('../views/SettingsView.vue')
    },
  ]
})

router.beforeEach((to, from) => {
  const ObsWebsocket = inject('ObsWebsocket')

  if (to.meta.requireSocket && !ObsWebsocket.socket) {
    return { name: 'connect' }
  }
  else if (!to.meta.requireSocket && ObsWebsocket.socket) {
    return { name: from.name }
  }
})

export default router
