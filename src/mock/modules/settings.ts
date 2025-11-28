import Mock from 'mockjs'

let settings = {
  theme: 'dark',
  navigation: 'side',
  showFooter: true,
  enableTabBar: true,
}

export const registerSettingsMocks = () => {
  Mock.mock(/\/api\/settings$/, 'get', settings)

  Mock.mock(/\/api\/settings$/, 'post', (options: { body?: string }) => {
    if (options?.body) {
      const payload = JSON.parse(options.body)
      settings = { ...settings, ...payload }
    }
    return settings
  })
}
