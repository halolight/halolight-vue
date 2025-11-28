import Mock from 'mockjs'

const issues = Mock.mock({
  'list|5': [
    {
      'id|+1': 1,
      title: '@ctitle(6, 14)',
      severity: () => Mock.Random.pick(['低', '中', '高']),
      status: () => Mock.Random.pick(['已修复', '待处理']),
    },
  ],
}).list

export const registerSecurityMocks = () => {
  Mock.mock(/\/api\/security\/report/, 'get', {
    issues,
    lastScan: Mock.Random.datetime('yyyy-MM-dd HH:mm'),
    score: Mock.Random.integer(78, 98),
  })
}
