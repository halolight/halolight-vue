import { defineStore } from 'pinia'

import { config } from '@/config'

interface User {
  name: string
  email: string
  role: string
}

interface Credentials {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: '',
    loading: false,
    error: '',
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    initials: (state) => {
      if (!state.user) return 'HL'
      return state.user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    },
  },
  actions: {
    async login(payload: Credentials) {
      this.loading = true
      this.error = ''
      try {
        await new Promise((resolve) => setTimeout(resolve, 600))
        // 模拟验证（从环境变量读取演示账号）
        const demoEmail = config.demoEmail
        const demoPassword = config.demoPassword
        if (payload.email !== demoEmail || payload.password !== demoPassword) {
          throw new Error('邮箱或密码错误')
        }
        this.user = { name: config.brandName + ' Admin', email: payload.email, role: 'Administrator' }
        this.token = 'mock-token'
        return this.user
      } catch (e) {
        this.error = e instanceof Error ? e.message : '登录失败'
        throw e
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
      this.token = ''
      this.error = ''
    },
    clearError() {
      this.error = ''
    },
  },
  persist: {
    key: 'halolight-auth',
    pick: ['user', 'token'],
  },
})
