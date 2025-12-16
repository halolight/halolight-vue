/**
 * 环境变量配置
 * 统一管理所有 VITE_ 前缀的环境变量
 */
export const config = {
  // 基础配置
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  mock: import.meta.env.VITE_MOCK === 'true',

  // 演示账号配置
  demoEmail: import.meta.env.VITE_DEMO_EMAIL || '',
  demoPassword: import.meta.env.VITE_DEMO_PASSWORD || '',
  showDemoHint: import.meta.env.VITE_SHOW_DEMO_HINT === 'true',

  // WebSocket 配置
  wsUrl: import.meta.env.VITE_WS_URL || '',

  // 应用配置
  appTitle: import.meta.env.VITE_APP_TITLE || 'Admin Pro',
  brandName: import.meta.env.VITE_BRAND_NAME || 'Admin Pro',

  // 可选配置
  gaId: import.meta.env.VITE_GA_ID || '',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',

  // 环境判断
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const

export type Config = typeof config
