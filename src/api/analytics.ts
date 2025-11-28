import type { AnalyticsSummary } from '@/types/analytics'

import api from './client'

export const fetchAnalytics = async (): Promise<AnalyticsSummary> => api.get('/analytics')
