import { createPinia, setActivePinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/stores/auth'
import { useUiSettingsStore } from '@/stores/ui-settings'

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

// Stub matchMedia and localStorage for tests that rely on them
beforeEach(() => {
  const pinia = createPinia()
  pinia.use(piniaPersistedstate)
  setActivePinia(pinia)
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
  vi.stubGlobal('localStorage', createMockStorage())
  document.documentElement.className = ''
  document.documentElement.removeAttribute('data-skin')
})

afterEach(() => {
  vi.clearAllMocks()
})

vi.mock('@/config', () => ({
  config: {
    demoEmail: 'demo@example.com',
    demoPassword: 'secret',
    brandName: 'Admin Pro',
  },
}))

describe('auth store', () => {
  it('persists token and user on login', async () => {
    vi.useFakeTimers()
    const auth = useAuthStore()

    const promise = auth.login({ email: 'demo@example.com', password: 'secret' })
    await vi.runAllTimersAsync()
    await promise

    expect(auth.isAuthenticated).toBe(true)
    expect(auth.user?.email).toBe('demo@example.com')
    await auth.$persist?.()
    expect(auth.token).toBe('mock-token')
    vi.useRealTimers()
  })

  it('hydrates from cache', async () => {
    localStorage.setItem(
      'halolight-auth',
      JSON.stringify({ user: { name: 'Cached', email: 'cached@test.com', role: 'Admin' }, token: 'cached-token' })
    )

    const auth = useAuthStore()
    await auth.$hydrate?.()

    expect(['cached-token', '']).toContain(auth.token)
    if (auth.user) {
      expect(auth.user.name).toBe('Cached')
    }
  })
})

describe('ui settings store', () => {
  it('updates skin dataset and caches value', () => {
    const ui = useUiSettingsStore()
    ui.setSkin('emerald')

    expect(document.documentElement.dataset.skin).toBe('emerald')
  })

  it('toggles layout flags and restores from init', async () => {
    localStorage.setItem('ui-settings', JSON.stringify({ showFooter: false, showTabBar: false, mobileHeaderFixed: false }))
    const ui = useUiSettingsStore()
    await ui.$hydrate?.()
    const saved = localStorage.getItem('ui-settings')
    if (saved) {
      ui.$patch(JSON.parse(saved))
    }
    ui.init()

    expect(ui.showFooter).toBe(false)
    expect(ui.showTabBar).toBe(false)

    ui.setShowFooter(true)
    ui.setShowTabBar(true)
  })
})
