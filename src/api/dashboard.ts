import api from './client'

import type { DashboardSummary } from '@/types/dashboard'

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  return api.get('/dashboard/summary')
}
