import Mock from 'mockjs'

import { registerDashboardMocks } from './modules/dashboard'
import { registerMessageMocks } from './modules/messages'
import { registerUserMocks } from './modules/users'
import { registerFileMocks } from './modules/files'
import { registerCalendarMocks } from './modules/calendar'
import { registerSecurityMocks } from './modules/security'
import { registerSettingsMocks } from './modules/settings'
import { registerAnalyticsMocks } from './modules/analytics'

export const setupMock = () => {
  Mock.setup({ timeout: '200-600' })
  registerDashboardMocks()
  registerMessageMocks()
  registerUserMocks()
  registerFileMocks()
  registerCalendarMocks()
  registerSecurityMocks()
  registerSettingsMocks()
  registerAnalyticsMocks()
}
