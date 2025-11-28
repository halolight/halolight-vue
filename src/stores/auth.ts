import { defineStore } from 'pinia'

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
      await new Promise((resolve) => setTimeout(resolve, 600))
      this.user = { name: 'Halolight Admin', email: payload.email, role: 'Administrator' }
      this.token = 'mock-token'
      this.loading = false
      return this.user
    },
    logout() {
      this.user = null
      this.token = ''
    },
  },
})
