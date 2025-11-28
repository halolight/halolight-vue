import Mock from 'mockjs'

const Random = Mock.Random

export const registerMessageMocks = () => {
  // 获取消息列表
  Mock.mock(/\/api\/messages(\?.*)?$/, 'get', () => {
    const count = Random.integer(10, 30)
    const list = []
    for (let i = 0; i < count; i++) {
      list.push({
        id: Random.guid(),
        sender: {
          id: Random.guid(),
          name: Random.cname(),
          avatar: Random.image('40x40', Random.color(), '#fff', Random.first()),
        },
        content: Random.cparagraph(1, 3),
        createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
        read: Random.boolean(),
      })
    }
    return { code: 200, message: 'success', data: { list, total: list.length } }
  })

  // 获取会话列表
  Mock.mock(/\/api\/conversations(\?.*)?$/, 'get', () => {
    const count = Random.integer(5, 15)
    const list = []
    for (let i = 0; i < count; i++) {
      const type = Random.pick(['private', 'group'])
      const memberCount = type === 'group' ? Random.integer(2, 8) : 1
      const members = []
      for (let j = 0; j < memberCount; j++) {
        members.push({
          id: Random.guid(),
          name: Random.cname(),
          avatar: Random.image('40x40', Random.color(), '#fff', Random.first()),
        })
      }
      list.push({
        id: Random.guid(),
        type,
        name: type === 'group' ? Random.ctitle(3, 6) : Random.cname(),
        avatar: Random.image('50x50', Random.color(), '#fff', Random.first()),
        lastMessage: Random.csentence(5, 15),
        lastMessageTime: Random.datetime('yyyy-MM-dd HH:mm:ss'),
        unreadCount: Random.integer(0, 10),
        online: Random.boolean(),
        members,
      })
    }
    return { code: 200, message: 'success', data: { list, total: list.length } }
  })

  // 未读消息数量
  Mock.mock('/api/messages/unread-count', 'get', () => ({
    code: 200,
    message: 'success',
    data: Random.integer(0, 20),
  }))

  // 发送消息
  Mock.mock('/api/messages', 'post', (options: { body: string }) => {
    const { content } = JSON.parse(options.body)
    return {
      code: 200,
      message: 'success',
      data: {
        id: Random.guid(),
        sender: { id: Random.guid(), name: '我' },
        content,
        createdAt: new Date().toISOString(),
        read: true,
      },
    }
  })

  // 标记消息已读
  Mock.mock(/\/api\/messages\/[a-zA-Z0-9-]+\/read/, 'put', () => ({
    code: 200,
    message: 'success',
    data: null,
  }))
}
