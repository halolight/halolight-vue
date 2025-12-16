export interface SettingsState {
  theme: 'light' | 'dark' | 'system'
  navigation: 'side' | 'top'
  showFooter: boolean
  enableTabBar: boolean
}

export type SettingsPayload = Partial<SettingsState>
