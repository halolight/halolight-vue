import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useLayoutStore } from '@/stores/layout'

function createMockStorage() {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
  vi.stubGlobal('localStorage', createMockStorage())
  document.documentElement.dataset.theme = ''
})

describe('layout store', () => {
  it('toggles sidebar collapsed state', () => {
    const layout = useLayoutStore()
    expect(layout.sidebarCollapsed).toBe(false)
    layout.toggleSidebar()
    expect(layout.sidebarCollapsed).toBe(true)
    layout.setSidebarCollapsed(false)
    expect(layout.sidebarCollapsed).toBe(false)
  })

  it('switches theme and writes dataset', () => {
    const layout = useLayoutStore()
    layout.setTheme('dark')
    expect(layout.resolvedTheme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')

    layout.toggleTheme()
    expect(layout.resolvedTheme).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
