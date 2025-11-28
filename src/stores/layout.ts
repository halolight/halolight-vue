import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'

const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark'
  const cached = localStorage.getItem('halolight-theme') as Theme | null
  if (cached === 'light' || cached === 'dark') return cached
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyThemeToDocument = (theme: Theme) => {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme
}

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    sidebarCollapsed: false,
    theme: getPreferredTheme() as Theme,
  }),
  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    setTheme(theme: Theme) {
      this.theme = theme
      applyThemeToDocument(theme)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('halolight-theme', theme)
      }
    },
    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark')
    },
    applyTheme() {
      applyThemeToDocument(this.theme)
    },
  },
})
