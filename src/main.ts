import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import queryClient from './plugins/query-client'
import router from './router'
import { setupMock } from './mock'
import '@/assets/main.css'

if (import.meta.env.VITE_USE_MOCK === 'true') {
  setupMock()
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')
