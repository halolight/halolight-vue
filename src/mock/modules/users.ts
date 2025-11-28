import Mock from 'mockjs'

const users = Mock.mock({
  'list|8': [
    {
      'id|+1': 1,
      name: '@cname() '
        .trim(),
      email: '@first()@halolight.dev',
      role: () => Mock.Random.pick(['管理员', '运营', '观察者']),
      status: () => Mock.Random.pick(['活跃', '禁用']),
    },
  ],
}).list

export const registerUserMocks = () => {
  Mock.mock(/\/api\/users/, 'get', { list: users })
}
