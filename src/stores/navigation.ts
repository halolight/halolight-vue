import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NavigationSource = 'sidebar' | 'header' | 'tabbar' | 'tabbar-refresh' | 'footer' | 'other'

interface NavigationState {
  path: string
  label?: string
  source: NavigationSource
}

export const useNavigationStore = defineStore('navigation', () => {
  const pendingPath = ref<string | null>(null)
  const label = ref<string | undefined>(undefined)
  const source = ref<NavigationSource>('other')

  function startNavigation(state: NavigationState) {
    pendingPath.value = state.path
    label.value = state.label
    source.value = state.source
  }

  function finishNavigation() {
    pendingPath.value = null
    label.value = undefined
    source.value = 'other'
  }

  return {
    pendingPath,
    label,
    source,
    startNavigation,
    finishNavigation,
  }
})
