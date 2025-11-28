import api from './client'

import type { SecurityReport } from '@/types/security'

export const fetchSecurityReport = async (): Promise<SecurityReport> => api.get('/security/report')
