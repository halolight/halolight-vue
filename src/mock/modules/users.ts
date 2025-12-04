import Mock from 'mockjs'

const Random = Mock.Random

// 角色列表
const roles = [
  { id: 'admin', name: 'admin', label: '超级管理员', permissions: ['*'] },
  { id: 'manager', name: 'manager', label: '管理员', permissions: ['dashboard:view', 'users:view', 'users:edit'] },
  { id: 'editor', name: 'editor', label: '编辑', permissions: ['dashboard:view', 'documents:*'] },
  { id: 'viewer', name: 'viewer', label: '访客', permissions: ['dashboard:view'] },
]

function getRandomRole() {
  return roles[Math.floor(Math.random() * roles.length)]
}

export const registerUserMocks = () => {
  // 获取用户列表
  Mock.mock(/\/api\/users(\?.*)?$/, 'get', () => {
    const count = Random.integer(20, 50)
    const list = []
    for (let i = 0; i < count; i++) {
      list.push({
        id: Random.guid(),
        name: Random.cname(),
        email: Random.email('halolight.dev'),
        phone: `1${Random.pick(['3', '5', '7', '8', '9'])}${Random.string('number', 9)}`,
        avatar: Random.image('100x100', Random.color(), '#fff', Random.first()),
        role: getRandomRole(),
        status: Random.pick(['active', 'inactive', 'suspended']),
        department: Random.ctitle(2, 4) + '部',
        position: Random.ctitle(2, 3),
        createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
        lastLoginAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      })
    }
    return {
      code: 200,
      message: 'success',
      data: { list, total: list.length, page: 1, pageSize: 10 },
    }
  })

  // 获取单个用户
  Mock.mock(/\/api\/users\/[a-zA-Z0-9-]+$/, 'get', () => ({
    code: 200,
    message: 'success',
    data: {
      id: Random.guid(),
      name: Random.cname(),
      email: Random.email('halolight.dev'),
      phone: `1${Random.pick(['3', '5', '7', '8', '9'])}${Random.string('number', 9)}`,
      avatar: Random.image('100x100', Random.color(), '#fff', Random.first()),
      role: getRandomRole(),
      status: Random.pick(['active', 'inactive', 'suspended']),
      department: Random.ctitle(2, 4) + '部',
      position: Random.ctitle(2, 3),
      bio: Random.cparagraph(1, 3),
      createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      lastLoginAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    },
  }))

  // 用户登录
  Mock.mock('/api/user/login', 'post', (options: { body: string }) => {
    const { email, password } = JSON.parse(options.body)
    if (email && password) {
      return {
        code: 200,
        message: '登录成功',
        data: {
          user: {
            id: Random.guid(),
            name: Random.cname(),
            email,
            avatar: Random.image('100x100', '#4A90E2', '#fff', 'A'),
            role: roles[0],
          },
          token: Random.guid(),
          expiresIn: 86400,
        },
      }
    }
    return { code: 401, message: '邮箱或密码错误', data: null }
  })

  // 获取当前用户
  Mock.mock('/api/user/current', 'get', () => ({
    code: 200,
    message: 'success',
    data: {
      id: Random.guid(),
      name: Random.cname(),
      email: 'admin@halolight.h7ml.cn',
      avatar: Random.image('100x100', '#4A90E2', '#fff', 'A'),
      role: roles[0],
      permissions: ['*'],
    },
  }))

  // 创建/更新/删除用户
  Mock.mock('/api/users', 'post', () => ({
    code: 200,
    message: '创建成功',
    data: { id: Random.guid(), createdAt: Random.datetime() },
  }))

  Mock.mock(/\/api\/users\/[a-zA-Z0-9-]+$/, 'put', () => ({
    code: 200,
    message: '更新成功',
    data: { updatedAt: new Date().toISOString() },
  }))

  Mock.mock(/\/api\/users\/[a-zA-Z0-9-]+$/, 'delete', () => ({
    code: 200,
    message: '删除成功',
    data: null,
  }))

  // 角色列表
  Mock.mock('/api/roles', 'get', () => ({ code: 200, message: 'success', data: roles }))
}
