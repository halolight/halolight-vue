import api from './client'

import type { AnalyticsSummary } from '@/types/analytics'

export const fetchAnalytics = async (): Promise<AnalyticsSummary> => api.get('/analytics')
