import Mock from 'mockjs'

const messages = Mock.mock({
  'data|6': [
    {
      'id|+1': 1,
      title: '@ctitle(8, 16)',
      sender: '@cname()',
      time: '@time("HH:mm")',
      status: () => Mock.Random.pick(['未读', '已读', '归档']),
    },
  ],
}).data

export const registerMessageMocks = () => {
  Mock.mock(/\/api\/messages/, 'get', { list: messages })
}
