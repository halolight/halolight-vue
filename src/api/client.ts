import axios from 'axios'

// API 响应格式
interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
})

// 响应拦截器：自动解包 { code, message, data } 格式
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
  (error) => {
    return Promise.reject(error)
  }
)

export default api
