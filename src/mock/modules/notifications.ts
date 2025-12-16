import Mock from 'mockjs'

const Random = Mock.Random

export const registerNotificationMocks = () => {
  // 获取通知列表
  Mock.mock(/\/api\/notifications(\?.*)?$/, 'get', () => {
    const count = Random.integer(10, 20)
    const list = []
    const types = ['user', 'system', 'task', 'alert']
    for (let i = 0; i < count; i++) {
      list.push({
        id: Random.guid(),
        type: Random.pick(types),
        title: Random.ctitle(4, 10),
        content: Random.cparagraph(1, 2),
        read: Random.boolean(1, 3, false), // 更多未读
        createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
        link: Random.pick(['/users', '/messages', '/dashboard', null]),
      })
    }
    return { code: 200, message: 'success', data: { list, total: list.length } }
  })

  // 未读通知数量
  Mock.mock('/api/notifications/unread-count', 'get', () => ({
    code: 200,
    message: 'success',
    data: Random.integer(0, 15),
  }))

  // 标记单个通知已读
  Mock.mock(/\/api\/notifications\/[a-zA-Z0-9-]+\/read/, 'put', () => ({
    code: 200,
    message: 'success',
    data: null,
  }))

  // 标记所有通知已读
  Mock.mock('/api/notifications/read-all', 'put', () => ({
    code: 200,
    message: 'success',
    data: null,
  }))

  // 删除通知
  Mock.mock(/\/api\/notifications\/[a-zA-Z0-9-]+$/, 'delete', () => ({
    code: 200,
    message: '删除成功',
    data: null,
  }))
}
