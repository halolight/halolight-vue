import type { Component } from 'vue'

import {
  BarChart3,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  MessagesSquare,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-vue-next'

export interface NavItem {
  title: string
  to: string
  icon: Component
  badge?: string
}

export const primaryNav: NavItem[] = [
  { title: '总览仪表盘', to: '/', icon: LayoutDashboard },
  { title: '用户管理', to: '/users', icon: Users, badge: 'Auth' },
  { title: '消息中心', to: '/messages', icon: MessagesSquare },
  { title: '文件空间', to: '/files', icon: FileText },
]

export const secondaryNav: NavItem[] = [
  { title: '活动日历', to: '/calendar', icon: CalendarCheck },
  { title: '安全审计', to: '/security', icon: ShieldCheck },
  { title: '系统设置', to: '/settings', icon: Settings },
  { title: '分析报告', to: '/analytics', icon: BarChart3 },
]
