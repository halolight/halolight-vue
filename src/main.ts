import '@/assets/main.css'

import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'

import App from './App.vue'
import { config } from './config'
import { setupMockFetch } from './lib/mock-fetch'
import { setupMock } from './mock'
import queryClient from './plugins/query-client'
import router from './router'

// 初始化 Mock（仅在开发环境且开启 mock 时）
if (config.mock && config.isDev) {
  setupMock()
  setupMockFetch()
}

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersistedstate)

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')
