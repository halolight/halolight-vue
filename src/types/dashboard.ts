export interface ActivityItem {
  id: string
  title: string
  user: string
  time: string
  status: string
}

export interface DashboardSummary {
  revenue: number
  uptime: number
  activeUsers: number
  tickets: number
  conversion: number
  activity: ActivityItem[]
}
