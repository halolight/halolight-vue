import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import router from '@/router'
import { useAuthStore } from '@/stores/auth'

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

beforeEach(async () => {
  vi.stubGlobal('localStorage', createMockStorage())
  setActivePinia(createPinia())
  // reset router to /login to avoid leaking state between tests
  await router.replace('/')
  await router.isReady()
})

describe('router guards', () => {
  it('redirects unauthenticated users to login with redirect param', async () => {
    await router.push('/users')
    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('/users')
  })

  it('allows protected routes when authenticated', async () => {
    const auth = useAuthStore()
    auth.token = 'mock-token'
    await router.push('/users')
    expect(router.currentRoute.value.path).toBe('/users')
  })

  it('prevents accessing guest routes when authenticated', async () => {
    const auth = useAuthStore()
    auth.token = 'mock-token'
    await router.push('/login')
    expect(router.currentRoute.value.name).toBe('dashboard')
  })
})
