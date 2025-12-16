import {
  BarChart3,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  Lock,
  MessagesSquare,
  Settings,
  ShieldCheck,
  User,
  UserCog,
  Users,
} from 'lucide-vue-next'
import type { Component } from 'vue'

export interface NavItem {
  title: string
  to?: string
  icon?: Component
  badge?: string
  children?: NavItem[]
}

export const primaryNav: NavItem[] = [
  { title: '总览仪表盘', to: '/', icon: LayoutDashboard },
  {
    title: '用户中心',
    icon: Users,
    children: [
      { title: '用户管理', to: '/users', icon: Users },
      {
        title: '用户详情',
        icon: UserCog,
        children: [
          { title: '资料页', to: '/users/demo/profile', icon: User },
          { title: '安全页', to: '/users/demo/security', icon: Lock },
        ],
      },
    ],
  },
  { title: '消息中心', to: '/messages', icon: MessagesSquare },
  { title: '文件空间', to: '/files', icon: FileText },
]

export const secondaryNav: NavItem[] = [
  { title: '活动日历', to: '/calendar', icon: CalendarCheck },
  { title: '安全审计', to: '/security', icon: ShieldCheck },
  { title: '系统设置', to: '/settings', icon: Settings },
  { title: '分析报告', to: '/analytics', icon: BarChart3 },
]
