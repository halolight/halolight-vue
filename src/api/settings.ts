import type { SettingsPayload, SettingsState } from '@/types/settings'

import api from './client'

export const fetchSettings = async (): Promise<SettingsState> => api.get('/settings')

export const updateSettings = async (payload: SettingsPayload): Promise<SettingsState> =>
  api.post('/settings', payload)
