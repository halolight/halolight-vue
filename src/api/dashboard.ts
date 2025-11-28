import type { DashboardSummary } from '@/types/dashboard'

import api from './client'

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  // second generic parameter ensures the resolved type matches interceptor-unwrapped payload
  return api.get<DashboardSummary, DashboardSummary>('/dashboard/summary')
}
