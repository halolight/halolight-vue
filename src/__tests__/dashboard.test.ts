import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type ComponentPublicInstance,createApp } from 'vue'

import { mockNotifications, mockUsers } from '@/api/mock-data'
import {
  useDashboardCalendar,
  useDashboardNotifications,
  useDashboardPie,
  useDashboardRefresh,
  useDashboardSales,
  useDashboardStats,
  useDashboardTasks,
  useDashboardUsers,
  useDashboardVisits,
} from '@/composables/useDashboardData'

function setupQueryComposable<T>(fn: () => T) {
  const app = createApp({ setup: () => fn(), template: '<div />' })
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity, staleTime: Infinity } },
  })
  app.use(VueQueryPlugin, { queryClient })
  const vm = app.mount(document.createElement('div')) as ComponentPublicInstance
  return { ...vm, queryClient }
}

beforeEach(() => {
  vi.useFakeTimers()
})

describe('dashboard composables', () => {
  it('returns dashboard stats with correct structure', async () => {
    const { queryClient } = setupQueryComposable(useDashboardStats)
    vi.runAllTimers()
    await queryClient.invalidateQueries()
    const data = queryClient.getQueryData(['dashboard', 'stats']) as Record<string, unknown>
    expect(data).toHaveProperty('totalUsers')
    expect(data).toHaveProperty('totalRevenue')
    expect(data).toHaveProperty('totalOrders')
    expect(data).toHaveProperty('conversionRate')
    expect(typeof data.totalUsers).toBe('number')
  })

  it('generates visit data for 7 days', async () => {
    const { queryClient } = setupQueryComposable(useDashboardVisits)
    vi.runAllTimers()
    await queryClient.invalidateQueries()
    const data = queryClient.getQueryData(['dashboard', 'visits']) as Array<{ date: string }>
    expect(data).toHaveLength(7)
    // dates should be in ISO format
    expect(data[0]?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('returns sales data for 6 months', async () => {
    const { queryClient } = setupQueryComposable(useDashboardSales)
    vi.runAllTimers()
    await queryClient.invalidateQueries()
    const data = queryClient.getQueryData(['dashboard', 'sales']) as Array<{ month: string }>
    expect(data).toHaveLength(6)
    expect(data[0]?.month).toBe('1月')
  })

  it('returns pie data', async () => {
    const { queryClient } = setupQueryComposable(useDashboardPie)
    vi.runAllTimers()
    await queryClient.invalidateQueries()
    const data = queryClient.getQueryData(['dashboard', 'pie'])
    expect(Array.isArray(data)).toBe(true)
  })

  it('limits users and notifications to 5 items', async () => {
    const { queryClient: qcUsers } = setupQueryComposable(useDashboardUsers)
    vi.runAllTimers()
    await qcUsers.invalidateQueries()
    const users = qcUsers.getQueryData(['dashboard', 'users']) as typeof mockUsers
    expect(users).toHaveLength(5)

    const { queryClient: qcNoti } = setupQueryComposable(useDashboardNotifications)
    vi.runAllTimers()
    await qcNoti.invalidateQueries()
    const notifications = qcNoti.getQueryData(['dashboard', 'notifications']) as typeof mockNotifications
    expect(notifications).toHaveLength(5)
  })

  it('returns tasks list', async () => {
    const { queryClient } = setupQueryComposable(useDashboardTasks)
    vi.runAllTimers()
    await queryClient.invalidateQueries()
    const data = queryClient.getQueryData(['dashboard', 'tasks']) as Array<{ id: string }>
    expect(data.length).toBeGreaterThan(0)
  })

  it('returns calendar events with correct structure', async () => {
    const { queryClient } = setupQueryComposable(useDashboardCalendar)
    vi.runAllTimers()
    await queryClient.invalidateQueries()
    const data = queryClient.getQueryData(['dashboard', 'calendar']) as Array<{ id: string; title: string; start: string }>
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('id')
    expect(data[0]).toHaveProperty('title')
    expect(data[0]).toHaveProperty('start')
  })

  it('refresh invalidates dashboard queries', async () => {
    // Build shared query client via composable
    const { queryClient } = setupQueryComposable(useDashboardStats)
    vi.runAllTimers()
    await queryClient.invalidateQueries()

    const spy = vi.spyOn(queryClient, 'invalidateQueries')

    // create app using same client and call refresh
    const app = createApp({
      setup() {
        const refresh = useDashboardRefresh()
        refresh()
      },
      template: '<div />',
    })
    app.use(VueQueryPlugin, { queryClient })
    app.mount(document.createElement('div'))

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      predicate: expect.any(Function),
    }))
    const callArg = spy.mock.calls[0]?.[0] as { predicate?: (q: { queryKey: string[] }) => boolean } | undefined
    const predicate = callArg?.predicate
    expect(predicate).toBeDefined()
    expect(predicate?.({ queryKey: ['dashboard', 'stats'] })).toBe(true)
    expect(predicate?.({ queryKey: ['other'] })).toBe(false)
  })
})
