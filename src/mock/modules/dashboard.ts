import Mock from 'mockjs'

const Random = Mock.Random

export const registerDashboardMocks = () => {
  // 仪表盘统计数据
  Mock.mock('/api/dashboard/summary', 'get', () => ({
    code: 200,
    message: 'success',
    data: {
      revenue: Random.integer(100000, 500000),
      uptime: Random.float(99, 100, 1, 2),
      activeUsers: Random.integer(5000, 20000),
      tickets: Random.integer(10, 100),
      conversion: Random.float(5, 20, 1, 1),
      totalUsers: Random.integer(10000, 50000),
      totalRevenue: Random.integer(500000, 5000000),
      pendingTasks: Random.integer(5, 50),
      recentOrders: Random.integer(50, 500),
      userGrowth: Random.float(-5, 20, 1, 1),
      revenueGrowth: Random.float(-10, 30, 1, 1),
      activity: generateActivity(),
    },
  }))

  // 访问趋势
  Mock.mock('/api/dashboard/visits', 'get', () => {
    const list = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      list.push({
        date: d.toISOString().split('T')[0],
        visits: Random.integer(1000, 8000),
        uniqueVisitors: Random.integer(500, 5000),
        pageViews: Random.integer(3000, 20000),
      })
    }
    return { code: 200, message: 'success', data: list }
  })

  // 销售趋势
  Mock.mock('/api/dashboard/sales', 'get', () => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    const data = months.map((month) => ({
      month,
      sales: Random.integer(50000, 200000),
      profit: Random.integer(10000, 50000),
    }))
    return { code: 200, message: 'success', data }
  })

  // 热门产品
  Mock.mock('/api/dashboard/products', 'get', () => {
    const list = []
    for (let i = 0; i < 10; i++) {
      list.push({
        id: Random.guid(),
        name: Random.ctitle(3, 8),
        category: Random.ctitle(2, 4),
        price: Random.float(10, 1000, 2, 2),
        sales: Random.integer(100, 5000),
        stock: Random.integer(0, 500),
        image: Random.image('80x80', Random.color(), '#fff', Random.first()),
      })
    }
    return { code: 200, message: 'success', data: list }
  })

  // 最近订单
  Mock.mock('/api/dashboard/orders', 'get', () => {
    const list = []
    for (let i = 0; i < 10; i++) {
      list.push({
        id: Random.guid(),
        orderNo: `ORD${Random.string('number', 10)}`,
        customer: Random.cname(),
        amount: Random.float(100, 10000, 2, 2),
        status: Random.pick(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
        createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      })
    }
    return { code: 200, message: 'success', data: list }
  })

  // 用户活动
  Mock.mock('/api/dashboard/activities', 'get', () => {
    const actions = ['登录系统', '创建订单', '更新资料', '上传文件', '发表评论', '分享内容']
    const list = []
    for (let i = 0; i < 20; i++) {
      list.push({
        id: Random.guid(),
        user: Random.cname(),
        avatar: Random.image('40x40', Random.color(), '#fff', Random.first()),
        action: Random.pick(actions),
        target: Random.ctitle(3, 6),
        time: Random.datetime('yyyy-MM-dd HH:mm:ss'),
      })
    }
    return { code: 200, message: 'success', data: list }
  })

  // 系统概览
  Mock.mock('/api/dashboard/overview', 'get', () => ({
    code: 200,
    message: 'success',
    data: {
      cpu: Random.integer(20, 90),
      memory: Random.integer(30, 85),
      disk: Random.integer(40, 75),
      network: Random.integer(10, 60),
      uptime: Random.integer(86400, 8640000),
      requests: Random.integer(10000, 100000),
      errors: Random.integer(0, 100),
      responseTime: Random.integer(50, 500),
    },
  }))

  // 流量来源
  Mock.mock('/api/dashboard/pie', 'get', () => ({
    code: 200,
    message: 'success',
    data: [
      { name: '直接访问', value: Random.integer(200, 800) },
      { name: '搜索引擎', value: Random.integer(150, 700) },
      { name: '社交媒体', value: Random.integer(80, 400) },
      { name: '邮件营销', value: Random.integer(50, 200) },
    ],
  }))

  // 待办任务
  Mock.mock('/api/dashboard/tasks', 'get', () => {
    const count = Random.integer(5, 8)
    const list = []
    for (let i = 0; i < count; i++) {
      list.push({
        id: Random.guid(),
        title: Random.ctitle(4, 10),
        status: Random.pick(['pending', 'in_progress', 'done']),
      })
    }
    return { code: 200, message: 'success', data: list }
  })
}

function generateActivity() {
  const actions = ['上线', '通过', '同步', '安全', '更新', '创建']
  const list = []
  for (let i = 0; i < 5; i++) {
    list.push({
      id: Random.guid(),
      title: Random.ctitle(5, 12),
      user: Random.cname(),
      time: Random.pick(['2 分钟前', '16 分钟前', '25 分钟前', '1 小时前', '3 小时前']),
      status: Random.pick(actions),
    })
  }
  return list
}
