import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from '@/layouts/AdminLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import MessagesView from '@/views/messages/MessagesView.vue'
import UsersView from '@/views/users/UsersView.vue'
import FilesView from '@/views/files/FilesView.vue'
import CalendarView from '@/views/calendar/CalendarView.vue'
import SecurityView from '@/views/security/SecurityView.vue'
import SettingsView from '@/views/settings/SettingsView.vue'
import AnalyticsView from '@/views/analytics/AnalyticsView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: AuthLayout,
      meta: { guest: true },
      children: [
        {
          path: '',
          name: 'login',
          component: LoginView,
        },
      ],
    },
    {
      path: '/',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
          meta: { label: 'Dashboard' },
        },
        {
          path: 'users',
          name: 'users',
          component: UsersView,
          meta: { label: '用户管理' },
        },
        {
          path: 'messages',
          name: 'messages',
          component: MessagesView,
          meta: { label: '消息中心' },
        },
        {
          path: 'files',
          name: 'files',
          component: FilesView,
          meta: { label: '文件空间' },
        },
        {
          path: 'calendar',
          name: 'calendar',
          component: CalendarView,
          meta: { label: '活动日历' },
        },
        {
          path: 'security',
          name: 'security',
          component: SecurityView,
          meta: { label: '安全审计' },
        },
        {
          path: 'settings',
          name: 'settings',
          component: SettingsView,
          meta: { label: '系统设置' },
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: AnalyticsView,
          meta: { label: '分析报告' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.guest && auth.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }

  next()
})

export default router
