<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LogIn, ShieldCheck, Sparkles } from 'lucide-vue-next'

import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const error = ref('')

const form = reactive({
  email: 'admin@halolight.dev',
  password: '123456',
})

const handleSubmit = async () => {
  error.value = ''
  try {
    await auth.login({ email: form.email, password: form.password })
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (err) {
    console.error(err)
    error.value = '登录失败，请稍后再试'
  }
}
</script>

<template>
  <div class="card auth-panel">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px">
      <div class="brand-mark">HL</div>
      <div>
        <div class="muted" style="text-transform: uppercase; letter-spacing: 0.8px">Halolight Vue</div>
        <h2 style="margin: 4px 0 0">后台管理登录</h2>
      </div>
    </div>

    <p class="muted" style="margin: 0 0 18px">
      基于 Next.js 版本的设计稿，已迁移为 Vue 3 + Vite + Pinia 结构，继续享受 Admin Pro 能力。
    </p>

    <form class="grid" style="gap: 12px" @submit.prevent="handleSubmit">
      <label class="field">
        <span class="label">邮箱</span>
        <input v-model="form.email" class="input" type="email" placeholder="you@halolight.dev" required />
      </label>

      <label class="field">
        <span class="label">密码</span>
        <input v-model="form.password" class="input" type="password" placeholder="•••••••" required />
      </label>

      <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center">
        <span class="pill" style="display: inline-flex; align-items: center; gap: 6px">
          <ShieldCheck :size="14" /> Mock 登录
        </span>
        <span class="pill" style="display: inline-flex; align-items: center; gap: 6px">
          <Sparkles :size="14" /> 支持主题与路由守卫
        </span>
      </div>

      <button class="btn primary" type="submit">
        <LogIn :size="16" />
        {{ auth.loading ? '登录中...' : '进入控制台' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>
