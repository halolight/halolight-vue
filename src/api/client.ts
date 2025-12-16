import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

import {
  adaptBackendCurrentUserResponse,
  adaptBackendLoginResponse,
} from './adapters'
import type {
  BackendCurrentUserResponse,
  BackendLoginResponse,
  BackendRefreshTokenResponse,
} from './backend-types'
import { mockRoles } from './mock-data'
import type {
  AccountWithToken,
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from './types'

// ============================================================================
// 配置常量
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
const IS_MOCK_MODE = import.meta.env.VITE_MOCK === 'true'
const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const MOCK_TOKEN_KEY = 'token'

// ============================================================================
// Token 存储工具函数
// ============================================================================

const getAccessToken = () => Cookies.get(ACCESS_TOKEN_KEY)
const getRefreshToken = () => Cookies.get(REFRESH_TOKEN_KEY)
const getMockToken = () => Cookies.get(MOCK_TOKEN_KEY)

const setTokens = (accessToken: string, refreshToken?: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 7 })
  if (refreshToken) {
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 30 })
  }
}

const setMockToken = (token: string) => {
  Cookies.set(MOCK_TOKEN_KEY, token, { expires: 7 })
}

const clearTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY)
  Cookies.remove(REFRESH_TOKEN_KEY)
  Cookies.remove(MOCK_TOKEN_KEY)
}

// ============================================================================
// API 客户端实例
// ============================================================================

// API 响应格式
interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ============================================================================
// Token 刷新机制
// ============================================================================

let isRefreshing = false
let refreshPromise: Promise<BackendRefreshTokenResponse> | null = null

interface PendingRequest {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}
const pendingRequests: PendingRequest[] = []

function enqueueRequest(resolve: (token: string) => void, reject: (error: unknown) => void) {
  pendingRequests.push({ resolve, reject })
}

function flushPendingRequests(error: unknown | null, token?: string) {
  pendingRequests.forEach((request) => {
    if (error) {
      request.reject(error)
    } else if (token) {
      request.resolve(token)
    }
  })
  pendingRequests.length = 0
}

async function refreshAccessToken(): Promise<BackendRefreshTokenResponse> {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  try {
    const response = await axios.post<BackendRefreshTokenResponse>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const { accessToken, refreshToken: newRefreshToken } = response.data

    setTokens(accessToken, newRefreshToken)

    return response.data
  } catch (error) {
    clearTokens()

    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }

    throw error
  }
}

// ============================================================================
// 请求拦截器
// ============================================================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (IS_MOCK_MODE) {
      const token = getMockToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } else {
      const token = getAccessToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// ============================================================================
// 响应拦截器
// ============================================================================

api.interceptors.response.use(
  (response) => {
    const body = response.data as ApiResponse
    // 如果响应体包含 code 和 data 字段，解包返回 data
    if (body && typeof body === 'object' && 'code' in body && 'data' in body) {
      if (body.code !== 200) {
        return Promise.reject(new Error(body.message || '请求失败'))
      }
      return body.data
    }
    // 否则直接返回原始数据
    return response.data
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Mock 模式使用旧逻辑
    if (IS_MOCK_MODE) {
      if (error.response?.status === 401) {
        clearTokens()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
      return Promise.reject(error)
    }

    // 真实 API 模式：实现 token 刷新
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      clearTokens()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        enqueueRequest(
          (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(api(originalRequest))
          },
          (err: unknown) => {
            reject(err)
          }
        )
      })
    }

    isRefreshing = true
    refreshPromise = refreshAccessToken()

    try {
      const { accessToken } = await refreshPromise

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
      }

      flushPendingRequests(null, accessToken)

      return api(originalRequest)
    } catch (refreshError) {
      flushPendingRequests(refreshError)
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  }
)

// ============================================================================
// Mock 数据和函数（仅用于 Mock 模式）
// ============================================================================

// 默认角色定义，确保类型安全
const defaultAdminRole = mockRoles[0] ?? {
  id: 'admin',
  name: 'admin',
  label: '管理员',
  permissions: [],
}

const defaultManagerRole = mockRoles[1] ?? {
  id: 'manager',
  name: 'manager',
  label: '管理员',
  permissions: [],
}

const defaultEditorRole = mockRoles[2] ?? {
  id: 'editor',
  name: 'editor',
  label: '编辑',
  permissions: [],
}

const defaultViewerRole = mockRoles[3] ?? {
  id: 'viewer',
  name: 'viewer',
  label: '访客',
  permissions: [],
}

const mockAccounts: AccountWithToken[] = [
  {
    id: 'acc-admin',
    email: 'admin@halolight.h7ml.cn',
    name: '主账号（管理员）',
    avatar: '/avatars/1.png',
    role: defaultAdminRole,
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    token: 'mock_token_acc-admin',
  },
  {
    id: 'acc-ops',
    email: 'ops@halolight.h7ml.cn',
    name: '日常运营账号',
    avatar: '/avatars/2.png',
    role: defaultManagerRole,
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    token: 'mock_token_acc-ops',
  },
  {
    id: 'acc-editor',
    email: 'editor@halolight.h7ml.cn',
    name: '内容编辑账号',
    avatar: '/avatars/3.png',
    role: defaultEditorRole,
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    token: 'mock_token_acc-editor',
  },
]

const buildToken = (accountId: string) => `mock_token_${accountId}`

const findAccountByEmail = (email: string) =>
  mockAccounts.find((account) => account.email === email)

const findAccountByToken = (token: string) =>
  mockAccounts.find((account) => account.token === token)

// ============================================================================
// Mock API 函数（Mock 模式使用）
// ============================================================================

const mockLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const account = findAccountByEmail(data.email)
  if (!account || data.password !== '123456') {
    throw new Error('邮箱或密码错误')
  }

  const token = buildToken(account.id)
  const hydratedAccount: AccountWithToken = { ...account, token }

  return {
    user: hydratedAccount,
    token,
    expiresIn: 86400,
    accounts: mockAccounts.map((item) => (item.id === account.id ? hydratedAccount : item)),
  }
}

const mockRegister = async (data: RegisterRequest): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (data.password !== data.confirmPassword) {
    throw new Error('两次密码输入不一致')
  }

  const accountId = `acc-${Date.now()}`
  const newAccount: AccountWithToken = {
    id: accountId,
    email: data.email,
    name: data.name,
    avatar: '/avatars/4.png',
    role: defaultViewerRole,
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    token: buildToken(accountId),
  }

  mockAccounts.push(newAccount)

  return {
    user: newAccount,
    token: newAccount.token,
    expiresIn: 86400,
    accounts: [...mockAccounts],
  }
}

const mockGetCurrentUser = async (): Promise<CurrentUserResponse | null> => {
  const token = getMockToken()
  if (!token) return null

  const account = findAccountByToken(token)
  if (!account) return null

  return {
    user: account,
    accounts: [...mockAccounts],
  }
}

// ============================================================================
// Auth API
// ============================================================================

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    if (IS_MOCK_MODE) {
      const result = await mockLogin(data)
      setMockToken(result.token)
      return result
    }

    // 真实 API 调用 - 响应拦截器已经unwrap了data
    const response = (await api.post('/auth/login', {
      email: data.email,
      password: data.password,
    })) as BackendLoginResponse

    const loginResponse = adaptBackendLoginResponse(response)

    // 存储 tokens
    setTokens(loginResponse.token, loginResponse.refreshToken)

    return loginResponse
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    if (IS_MOCK_MODE) {
      const result = await mockRegister(data)
      setMockToken(result.token)
      return result
    }

    // 真实 API 调用 - 响应拦截器已经unwrap了data
    const response = (await api.post('/auth/register', {
      email: data.email,
      name: data.name,
      password: data.password,
    })) as BackendLoginResponse

    const loginResponse = adaptBackendLoginResponse(response)

    // 存储 tokens
    setTokens(loginResponse.token, loginResponse.refreshToken)

    return loginResponse
  },

  forgotPassword: async (email: string): Promise<void> => {
    if (IS_MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log('发送重置密码邮件到:', email)
      return
    }

    await api.post('/auth/forgot-password', { email })
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    if (IS_MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log('重置密码:', token, password)
      return
    }

    await api.post('/auth/reset-password', { token, password })
  },

  logout: async (): Promise<void> => {
    if (IS_MOCK_MODE) {
      clearTokens()
      return
    }

    try {
      await api.post('/auth/logout')
    } finally {
      clearTokens()
    }
  },

  getCurrentUser: async (): Promise<CurrentUserResponse | null> => {
    if (IS_MOCK_MODE) {
      return mockGetCurrentUser()
    }

    const token = getAccessToken()
    if (!token) return null

    try {
      // 响应拦截器已经unwrap了data
      const response = (await api.get('/auth/me')) as BackendCurrentUserResponse

      return adaptBackendCurrentUserResponse(response)
    } catch (error) {
      console.error('获取当前用户失败:', error)
      return null
    }
  },

  getAccounts: async (): Promise<AccountWithToken[]> => {
    if (IS_MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return [...mockAccounts]
    }

    // 真实 API 暂不支持多账号
    return []
  },
}

export default api
