import Mock from 'mockjs'

const Random = Mock.Random

export const registerSecurityMocks = () => {
  // 安全报告
  Mock.mock(/\/api\/security\/report/, 'get', () => {
    const issueCount = Random.integer(3, 8)
    const issues = []
    for (let i = 0; i < issueCount; i++) {
      issues.push({
        id: Random.guid(),
        title: Random.ctitle(6, 14),
        severity: Random.pick(['low', 'medium', 'high', 'critical']),
        status: Random.pick(['fixed', 'pending', 'in_progress']),
        description: Random.cparagraph(1, 2),
        createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      })
    }
    return {
      code: 200,
      message: 'success',
      data: {
        issues,
        lastScan: Random.datetime('yyyy-MM-dd HH:mm:ss'),
        score: Random.integer(78, 98),
        totalScans: Random.integer(50, 200),
        vulnerabilities: {
          critical: Random.integer(0, 2),
          high: Random.integer(0, 5),
          medium: Random.integer(2, 10),
          low: Random.integer(5, 20),
        },
      },
    }
  })

  // 安全日志
  Mock.mock(/\/api\/security\/logs(\?.*)?$/, 'get', () => {
    const count = Random.integer(20, 50)
    const list = []
    const actions = ['登录成功', '登录失败', '密码修改', '权限变更', 'API访问', '数据导出']
    for (let i = 0; i < count; i++) {
      list.push({
        id: Random.guid(),
        action: Random.pick(actions),
        user: Random.cname(),
        ip: `${Random.integer(1, 255)}.${Random.integer(1, 255)}.${Random.integer(1, 255)}.${Random.integer(1, 255)}`,
        userAgent: Random.pick(['Chrome', 'Firefox', 'Safari', 'Edge']),
        status: Random.pick(['success', 'failed', 'blocked']),
        createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      })
    }
    return { code: 200, message: 'success', data: { list, total: list.length } }
  })
}
