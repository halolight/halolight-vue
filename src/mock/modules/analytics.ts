import Mock from 'mockjs'

const analytics = {
  kpis: [
    { label: '转化率', value: '12.4%', change: '+1.2%' },
    { label: '新用户', value: '3,280', change: '+6.1%' },
    { label: 'MRR', value: '¥186k', change: '+18.6%' },
  ],
  traffic: [
    { source: 'Direct', value: 38 },
    { source: 'Search', value: 32 },
    { source: 'Referral', value: 18 },
    { source: 'Social', value: 12 },
  ],
  regions: Mock.mock({ 'list|5': [{ name: '@province()', users: '@integer(400, 3200)' }] }).list,
}

export const registerAnalyticsMocks = () => {
  Mock.mock(/\/api\/analytics$/, 'get', analytics)
}
