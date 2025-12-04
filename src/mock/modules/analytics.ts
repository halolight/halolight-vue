import Mock from 'mockjs'

const Random = Mock.Random

export const registerAnalyticsMocks = () => {
  // 分析概览
  Mock.mock(/\/api\/analytics$/, 'get', () => {
    const kpis = [
      { label: '转化率', value: `${Random.float(5, 20, 1, 1)}%`, change: `${Random.pick(['+', '-'])}${Random.float(0.1, 5, 1, 1)}%` },
      { label: '新用户', value: Random.integer(1000, 10000).toLocaleString(), change: `${Random.pick(['+', '-'])}${Random.float(1, 15, 1, 1)}%` },
      { label: 'MRR', value: `¥${Random.integer(100, 500)}k`, change: `${Random.pick(['+', '-'])}${Random.float(5, 30, 1, 1)}%` },
      { label: '活跃用户', value: Random.integer(5000, 20000).toLocaleString(), change: `${Random.pick(['+', '-'])}${Random.float(2, 12, 1, 1)}%` },
    ]

    const traffic = [
      { source: 'Direct', value: Random.integer(25, 45) },
      { source: 'Search', value: Random.integer(20, 40) },
      { source: 'Referral', value: Random.integer(10, 25) },
      { source: 'Social', value: Random.integer(5, 20) },
    ]

    const regionCount = Random.integer(5, 10)
    const regions = []
    for (let i = 0; i < regionCount; i++) {
      regions.push({
        name: Random.province(),
        users: Random.integer(400, 5000),
        growth: Random.float(-10, 30, 1, 1),
      })
    }

    return {
      code: 200,
      message: 'success',
      data: { kpis, traffic, regions },
    }
  })

  // 用户分析
  Mock.mock(/\/api\/analytics\/users/, 'get', () => {
    const days = 30
    const data = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      data.push({
        date: d.toISOString().split('T')[0],
        newUsers: Random.integer(50, 500),
        activeUsers: Random.integer(1000, 5000),
        churned: Random.integer(10, 100),
      })
    }
    return { code: 200, message: 'success', data }
  })

  // 收入分析
  Mock.mock(/\/api\/analytics\/revenue/, 'get', () => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    const data = months.map((month) => ({
      month,
      revenue: Random.integer(80000, 300000),
      cost: Random.integer(30000, 100000),
      profit: Random.integer(50000, 200000),
    }))
    return { code: 200, message: 'success', data }
  })
}
