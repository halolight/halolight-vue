import Mock from 'mockjs'

const activity = [
  { id: '1', title: '新建「销售监控」仪表盘', user: '赵璐', time: '2 分钟前', status: '上线' },
  { id: '2', title: '审批通过：文件中心访问申请', user: '王宇', time: '16 分钟前', status: '通过' },
  { id: '3', title: '新增 12 个活跃用户', user: '自动化机器人', time: '25 分钟前', status: '同步' },
  { id: '4', title: '安全审计完成：高风险 0', user: '安全中心', time: '1 小时前', status: '安全' },
]

const summary = {
  revenue: 186000,
  uptime: 99.97,
  activeUsers: 12840,
  tickets: 42,
  conversion: 12.4,
  activity,
}

export const registerDashboardMocks = () => {
  Mock.mock(/\/api\/dashboard\/summary/, 'get', summary)
}
