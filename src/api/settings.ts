import api from './client'

import type { SettingsPayload, SettingsState } from '@/types/settings'

export const fetchSettings = async (): Promise<SettingsState> => api.get('/settings')

export const updateSettings = async (payload: SettingsPayload): Promise<SettingsState> =>
  api.post('/settings', payload)
