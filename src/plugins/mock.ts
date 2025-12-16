/**
 * Mock 插件
 * 在 Vue 应用启动时自动加载 mock 数据
 */

import type { App } from 'vue'

import { config } from '@/config'

export const MockPlugin = {
  install: async (_app: App) => {
    // 仅在开发环境且开启 mock 时加载
    if (config.mock && config.isDev) {
      try {
        // 动态导入 mock 模块
        const { setupMock } = await import('@/mock')
        const { setupMockFetch } = await import('@/lib/mock-fetch')

        // 先注册 mock 规则
        setupMock()

        // 再设置 fetch 拦截
        setupMockFetch()

        console.log('[Mock] Mock 服务已启动')
      } catch (error) {
        console.error('[Mock] 加载失败:', error)
      }
    }
  },
}

/**
 * 异步初始化 mock（用于需要等待 mock 完成的场景）
 */
export async function initMock(): Promise<void> {
  if (config.mock && config.isDev) {
    const { setupMock } = await import('@/mock')
    const { setupMockFetch } = await import('@/lib/mock-fetch')
    setupMock()
    setupMockFetch()
    console.log('[Mock] Mock 服务已启动')
  }
}
