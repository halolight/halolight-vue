/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 基础配置
  readonly VITE_API_URL: string
  readonly VITE_MOCK: string

  // 演示账号配置
  readonly VITE_DEMO_EMAIL: string
  readonly VITE_DEMO_PASSWORD: string
  readonly VITE_SHOW_DEMO_HINT: string

  // WebSocket 配置
  readonly VITE_WS_URL: string

  // 应用配置
  readonly VITE_APP_TITLE: string
  readonly VITE_BRAND_NAME: string

  // 可选配置
  readonly VITE_GA_ID?: string
  readonly VITE_SENTRY_DSN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
