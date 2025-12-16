import Cookies from 'js-cookie'
import { defineStore } from 'pinia'

import { authApi } from '@/api/client'
import type { AccountWithToken, LoginRequest, RegisterRequest, User } from '@/api/types'

const IS_MOCK_MODE = import.meta.env.VITE_MOCK === 'true'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: '',
    accounts: [] as AccountWithToken[],
    activeAccountId: null as string | null,
    loading: false,
    error: '',
  }),
  getters: {
    isAuthenticated: (state) => {
      // 优先检查Cookie中的token（真实API模式）或state中的token（Mock模式）
      if (IS_MOCK_MODE) {
        return Boolean(state.token || Cookies.get('token'))
      }
      return Boolean(state.token || Cookies.get('accessToken'))
    },
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
    async login(payload: LoginRequest) {
      this.loading = true
      this.error = ''
      try {
        const response = await authApi.login(payload)

        this.user = response.user
        this.token = response.token
        this.accounts = response.accounts
        this.activeAccountId = response.user.id

        return response.user
      } catch (e) {
        this.error = e instanceof Error ? e.message : '登录失败'
        throw e
      } finally {
        this.loading = false
      }
    },

    async register(payload: RegisterRequest) {
      this.loading = true
      this.error = ''
      try {
        const response = await authApi.register(payload)

        this.user = response.user
        this.token = response.token
        this.accounts = response.accounts
        this.activeAccountId = response.user.id

        return response.user
      } catch (e) {
        this.error = e instanceof Error ? e.message : '注册失败'
        throw e
      } finally {
        this.loading = false
      }
    },

    async switchAccount(accountId: string) {
      const account = this.accounts.find((item) => item.id === accountId)
      if (!account) {
        this.error = '账号不存在'
        throw new Error('账号不存在')
      }

      // 多账号切换仅在Mock模式下支持
      if (!IS_MOCK_MODE) {
        this.error = '多账号切换功能仅在Mock模式下可用'
        throw new Error('多账号切换功能仅在Mock模式下可用')
      }

      this.user = account
      this.token = account.token
      this.activeAccountId = account.id
      this.error = ''

      // 更新Cookie
      Cookies.set('token', account.token, { expires: 7 })
    },

    async loadAccounts() {
      this.loading = true
      try {
        const accounts = await authApi.getAccounts()
        if (accounts.length > 0) {
          this.accounts = accounts
          // 如果没有当前激活账号，使用第一个
          if (!this.activeAccountId && accounts.length > 0) {
            const firstAccount = accounts[0]
            if (firstAccount) {
              this.user = firstAccount
              this.token = firstAccount.token
              this.activeAccountId = firstAccount.id
            }
          }
        }
      } catch (e) {
        this.error = e instanceof Error ? e.message : '加载账号失败'
      } finally {
        this.loading = false
      }
    },

    async getCurrentUser() {
      this.loading = true
      try {
        const response = await authApi.getCurrentUser()
        if (response) {
          this.user = response.user
          this.accounts = response.accounts
          this.activeAccountId = response.user.id

          // 同步token：从Cookie读取最新的token
          if (IS_MOCK_MODE) {
            this.token = Cookies.get('token') || response.user.token
          } else {
            this.token = Cookies.get('accessToken') || ''
          }

          return response.user
        }
        return null
      } catch (e) {
        this.error = e instanceof Error ? e.message : '获取用户信息失败'
        return null
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await authApi.logout()
      } catch (e) {
        console.error('退出登录失败:', e)
      } finally {
        this.user = null
        this.token = ''
        this.accounts = []
        this.activeAccountId = null
        this.error = ''
      }
    },

    clearError() {
      this.error = ''
    },
  },
  persist: {
    key: 'halolight-auth',
    // 不持久化token，避免与Cookie不同步
    pick: ['user', 'accounts', 'activeAccountId'],
  },
})

