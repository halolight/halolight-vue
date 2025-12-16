import type { SecurityReport } from '@/types/security'

import api from './client'

export const fetchSecurityReport = async (): Promise<SecurityReport> => api.get('/security/report')
