import Mock from 'mockjs'

const events = Mock.mock({
  'list|5': [
    {
      'id|+1': 1,
      title: '@ctitle(6, 12)',
      date: '@date("yyyy-MM-dd")',
      type: () => Mock.Random.pick(['会议', '发布', '提醒']),
    },
  ],
}).list

export const registerCalendarMocks = () => {
  Mock.mock(/\/api\/calendar\/events/, 'get', { list: events })
}
