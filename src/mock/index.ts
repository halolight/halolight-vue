import Mock from 'mockjs'

import { registerAnalyticsMocks } from './modules/analytics'
import { registerCalendarMocks } from './modules/calendar'
import { registerDashboardMocks } from './modules/dashboard'
import { registerFileMocks } from './modules/files'
import { registerMessageMocks } from './modules/messages'
import { registerNotificationMocks } from './modules/notifications'
import { registerSecurityMocks } from './modules/security'
import { registerSettingsMocks } from './modules/settings'
import { registerUserMocks } from './modules/users'

export const setupMock = () => {
  // 配置 Mock 延迟
  Mock.setup({ timeout: '200-600' })

  // 注册所有 Mock 模块
  registerDashboardMocks()
  registerUserMocks()
  registerMessageMocks()
  registerFileMocks()
  registerCalendarMocks()
  registerNotificationMocks()
  registerSecurityMocks()
  registerSettingsMocks()
  registerAnalyticsMocks()

  console.log('[Mock] Mock.js 已启用')
}
