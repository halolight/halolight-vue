import { defineStore } from 'pinia'

import { config } from '@/config'

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface AccountWithToken extends User {
  token: string
}

interface Credentials {
  email: string
  password: string
  remember?: boolean
}

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

        // 生成账号ID和token
        const accountId = `user-${Date.now()}`
        const token = `mock-token-${accountId}`

        const user: User = {
          id: accountId,
          name: config.brandName + ' Admin',
          email: payload.email,
          role: 'Administrator',
        }

        const accountWithToken: AccountWithToken = {
          ...user,
          token,
        }

        // 模拟多账号数据：返回当前账号和其他可切换的账号
        const mockAccounts: AccountWithToken[] = [
          accountWithToken,
          {
            id: 'user-demo-1',
            name: 'Demo User 1',
            email: 'demo1@example.com',
            role: 'Editor',
            token: 'mock-token-demo-1',
          },
          {
            id: 'user-demo-2',
            name: 'Demo User 2',
            email: 'demo2@example.com',
            role: 'Viewer',
            token: 'mock-token-demo-2',
          },
        ]

        this.user = user
        this.token = token
        this.accounts = mockAccounts
        this.activeAccountId = accountId

        return user
      } catch (e) {
        this.error = e instanceof Error ? e.message : '登录失败'
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

      this.user = {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        avatar: account.avatar,
      }
      this.token = account.token
      this.activeAccountId = account.id
      this.error = ''
    },
    async loadAccounts() {
      this.loading = true
      try {
        // 在真实应用中，这里会从服务器加载账号列表
        // 现在我们只是使用已存储的账号列表
        const { activeAccountId, token, user } = this
        const nextUser =
          this.accounts.find((acc) => acc.id === activeAccountId) ||
          this.accounts.find((acc) => acc.token === token) ||
          user ||
          null

        if (nextUser) {
          this.user = nextUser
          this.activeAccountId = nextUser.id
          this.token = nextUser.token || token
        }
      } catch (e) {
        this.error = e instanceof Error ? e.message : '加载账号失败'
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
      this.token = ''
      this.accounts = []
      this.activeAccountId = null
      this.error = ''
    },
    clearError() {
      this.error = ''
    },
  },
  persist: {
    key: 'halolight-auth',
    pick: ['user', 'token', 'accounts', 'activeAccountId'],
  },
})
