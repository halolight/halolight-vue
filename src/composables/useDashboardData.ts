import { useQuery, useQueryClient } from '@tanstack/vue-query'

import {
  mockCalendarEvents,
  mockNotifications,
  mockUsers,
} from '@/api/mock-data'

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper to generate random number in range
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

// Helper to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]
    arr[i] = arr[j] as T
    arr[j] = temp as T
  }
  return arr
}

// Stats data - generates random stats each time
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      await delay(300)
      return {
        totalUsers: randomInt(8000, 15000),
        userChange: randomInt(-5, 20),
        totalRevenue: randomInt(300000, 600000),
        revenueChange: randomInt(-10, 25),
        totalOrders: randomInt(1000, 3000),
        orderChange: randomInt(-8, 15),
        conversionRate: (Math.random() * 3 + 2).toFixed(1),
        conversionChange: randomInt(-2, 5),
      }
    },
    staleTime: 0, // Always refetch on invalidation
  })
}

// Visit trend data (for line chart)
export function useDashboardVisits() {
  return useQuery({
    queryKey: ['dashboard', 'visits'],
    queryFn: async () => {
      await delay(300)
      // Generate 7 days of data
      const data = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        data.push({
          date: date.toISOString().split('T')[0],
          visits: randomInt(2000, 5000),
          pageViews: randomInt(5000, 13000),
        })
      }
      return data
    },
    staleTime: 0,
  })
}

// Sales data (for bar chart) - generates random data each time
export function useDashboardSales() {
  return useQuery({
    queryKey: ['dashboard', 'sales'],
    queryFn: async () => {
      await delay(300)
      const months = ['1月', '2月', '3月', '4月', '5月', '6月']
      return months.map((month) => ({
        month,
        sales: randomInt(1500, 6000),
        orders: randomInt(100, 400),
      }))
    },
    staleTime: 0,
  })
}

// Pie chart data (traffic sources) - generates random data each time
export function useDashboardPie() {
  return useQuery({
    queryKey: ['dashboard', 'pie'],
    queryFn: async () => {
      await delay(300)
      return [
        { name: '直接访问', value: randomInt(200, 500) },
        { name: '搜索引擎', value: randomInt(400, 800) },
        { name: '社交媒体', value: randomInt(150, 350) },
        { name: '外部链接', value: randomInt(100, 250) },
        { name: '邮件营销', value: randomInt(80, 200) },
      ]
    },
    staleTime: 0,
  })
}

// Recent users - shuffles and picks random users each time
export function useDashboardUsers() {
  return useQuery({
    queryKey: ['dashboard', 'users'],
    queryFn: async () => {
      await delay(300)
      return shuffleArray(mockUsers).slice(0, 5)
    },
    staleTime: 0,
  })
}

// Notifications - shuffles each time
export function useDashboardNotifications() {
  return useQuery({
    queryKey: ['dashboard', 'notifications'],
    queryFn: async () => {
      await delay(300)
      return shuffleArray(mockNotifications).slice(0, 5)
    },
    staleTime: 0,
  })
}

// Tasks - randomizes status each time
export function useDashboardTasks() {
  const statuses = ['completed', 'in-progress', 'pending'] as const
  const priorities = ['high', 'medium', 'low'] as const
  const taskTitles = [
    '完成用户模块开发',
    '代码评审 - API 模块',
    '更新项目文档',
    '修复登录页面 Bug',
    '优化数据库查询',
    '设计新功能原型',
    '编写单元测试',
    '部署生产环境',
  ]

  return useQuery({
    queryKey: ['dashboard', 'tasks'],
    queryFn: async () => {
      await delay(300)
      return shuffleArray(taskTitles)
        .slice(0, 5)
        .map((title, index) => ({
          id: String(index + 1),
          title,
          status: statuses[randomInt(0, 2)],
          priority: priorities[randomInt(0, 2)],
        }))
    },
    staleTime: 0,
  })
}

// Calendar events - generates dynamic dates
export function useDashboardCalendar() {
  return useQuery({
    queryKey: ['dashboard', 'calendar'],
    queryFn: async () => {
      await delay(300)
      const today = new Date()
      const events = mockCalendarEvents.map((event, index) => {
        const eventDate = new Date(today)
        eventDate.setDate(today.getDate() + index)
        eventDate.setHours(randomInt(9, 18), randomInt(0, 59))
        return {
          ...event,
          start: eventDate.toISOString(),
        }
      })
      return shuffleArray(events).slice(0, 4)
    },
    staleTime: 0,
  })
}

// Refresh all dashboard data
export function useDashboardRefresh() {
  const queryClient = useQueryClient()

  const refresh = async () => {
    await queryClient.invalidateQueries({
      predicate: (query) =>
        Array.isArray(query.queryKey) && query.queryKey[0] === 'dashboard',
    })
  }

  return refresh
}
