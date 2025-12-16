import Mock from 'mockjs'

let settings = {
  theme: 'system',
  skin: 'default',
  navigation: 'side',
  showFooter: true,
  showTabBar: true,
  mobileHeaderFixed: true,
  mobileTabBarFixed: true,
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
}

export const registerSettingsMocks = () => {
  // 获取设置
  Mock.mock(/\/api\/settings$/, 'get', () => ({
    code: 200,
    message: 'success',
    data: settings,
  }))

  // 更新设置
  Mock.mock(/\/api\/settings$/, 'post', (options: { body?: string }) => {
    if (options?.body) {
      const payload = JSON.parse(options.body)
      settings = { ...settings, ...payload }
    }
    return { code: 200, message: '保存成功', data: settings }
  })

  // 重置设置
  Mock.mock(/\/api\/settings\/reset$/, 'post', () => {
    settings = {
      theme: 'system',
      skin: 'default',
      navigation: 'side',
      showFooter: true,
      showTabBar: true,
      mobileHeaderFixed: true,
      mobileTabBarFixed: true,
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
    }
    return { code: 200, message: '重置成功', data: settings }
  })
}
