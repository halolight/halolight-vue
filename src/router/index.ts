import { createRouter, createWebHistory } from 'vue-router'

// 布局组件保持静态导入（首屏必需）
import AdminLayout from '@/layouts/AdminLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '@/stores/auth'

// 视图组件使用懒加载优化首屏性能
const DashboardView = () => import('@/views/dashboard/DashboardView.vue')
const LoginView = () => import('@/views/auth/LoginView.vue')
const RegisterView = () => import('@/views/auth/RegisterView.vue')
const ForgotPasswordView = () => import('@/views/auth/ForgotPasswordView.vue')
const ResetPasswordView = () => import('@/views/auth/ResetPasswordView.vue')
const MessagesView = () => import('@/views/messages/MessagesView.vue')
const UsersView = () => import('@/views/users/UsersView.vue')
const FilesView = () => import('@/views/files/FilesView.vue')
const CalendarView = () => import('@/views/calendar/CalendarView.vue')
const SecurityView = () => import('@/views/security/SecurityView.vue')
const SettingsView = () => import('@/views/settings/SettingsView.vue')
const AnalyticsView = () => import('@/views/analytics/AnalyticsView.vue')
const ProfileView = () => import('@/views/dashboard/ProfileView.vue')
const NotificationsView = () => import('@/views/dashboard/NotificationsView.vue')
const TermsView = () => import('@/views/legal/TermsView.vue')
const PrivacyView = () => import('@/views/legal/PrivacyView.vue')
const UserDetailView = () => import('@/views/users/UserDetailView.vue')
const UserDetailProfileView = () => import('@/views/users/UserDetailProfileView.vue')
const UserDetailSecurityView = () => import('@/views/users/UserDetailSecurityView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 认证相关路由
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
      path: '/register',
      component: AuthLayout,
      meta: { guest: true },
      children: [
        {
          path: '',
          name: 'register',
          component: RegisterView,
        },
      ],
    },
    {
      path: '/forgot-password',
      component: AuthLayout,
      meta: { guest: true },
      children: [
        {
          path: '',
          name: 'forgot-password',
          component: ForgotPasswordView,
        },
      ],
    },
    {
      path: '/reset-password',
      component: AuthLayout,
      meta: { guest: true },
      children: [
        {
          path: '',
          name: 'reset-password',
          component: ResetPasswordView,
        },
      ],
    },
    // 法律页面（无需认证）
    {
      path: '/terms',
      name: 'terms',
      component: TermsView,
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyView,
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
          children: [
            {
              path: ':id',
              component: UserDetailView,
              meta: { label: '用户详情' },
              children: [
                {
                  path: '',
                  redirect: { name: 'user-profile' },
                },
                {
                  path: 'profile',
                  name: 'user-profile',
                  component: UserDetailProfileView,
                  meta: { label: '资料' },
                },
                {
                  path: 'security',
                  name: 'user-security',
                  component: UserDetailSecurityView,
                  meta: { label: '安全' },
                },
              ],
            },
          ],
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
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          meta: { label: '个人资料' },
        },
        {
          path: 'notifications',
          name: 'notifications',
          component: NotificationsView,
          meta: { label: '通知中心' },
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
