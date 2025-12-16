import Mock from 'mockjs'

const Random = Mock.Random

const eventTypes = ['meeting', 'task', 'reminder', 'personal']
const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export const registerCalendarMocks = () => {
  // 获取日历事件
  Mock.mock(/\/api\/calendar\/events(\?.*)?$/, 'get', () => {
    const count = Random.integer(10, 20)
    const list = []
    for (let i = 0; i < count; i++) {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() + Random.integer(-7, 14))
      startDate.setHours(Random.integer(8, 18))

      const endDate = new Date(startDate)
      endDate.setHours(startDate.getHours() + Random.integer(1, 3))

      const isAllDay = Random.boolean(1, 10, false)
      const attendeeCount = Random.integer(0, 5)
      const attendees = []
      for (let j = 0; j < attendeeCount; j++) {
        attendees.push({
          id: Random.guid(),
          name: Random.cname(),
          avatar: Random.image('40x40', Random.color(), '#fff', Random.first()),
        })
      }

      list.push({
        id: Random.guid(),
        title: Random.ctitle(3, 8),
        description: Random.cparagraph(1, 2),
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        allDay: isAllDay,
        color: Random.pick(colors),
        type: Random.pick(eventTypes),
        location: Random.ctitle(3, 6),
        attendees,
      })
    }
    return { code: 200, message: 'success', data: { list, total: list.length } }
  })

  // 创建日历事件
  Mock.mock('/api/calendar/events', 'post', () => ({
    code: 200,
    message: '创建成功',
    data: { id: Random.guid(), createdAt: new Date().toISOString() },
  }))

  // 更新日历事件
  Mock.mock(/\/api\/calendar\/events\/[a-zA-Z0-9-]+$/, 'put', () => ({
    code: 200,
    message: '更新成功',
    data: { updatedAt: new Date().toISOString() },
  }))

  // 删除日历事件
  Mock.mock(/\/api\/calendar\/events\/[a-zA-Z0-9-]+$/, 'delete', () => ({
    code: 200,
    message: '删除成功',
    data: null,
  }))
}
