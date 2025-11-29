import { beforeEach,describe, expect, it } from 'vitest'

import { primaryNav, secondaryNav } from '@/config/menu'
import { DEFAULT_TDK, getRouteTdk, ROUTE_TDK } from '@/config/tdk'

describe('tdk config', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.title = ''
  })

  it('returns exact match entry', () => {
    const entry = getRouteTdk('/')
    expect(entry).toBe(ROUTE_TDK['/'])
    expect(entry.title).toBe('仪表盘')
  })

  it('returns prefix match for nested route', () => {
    const entry = getRouteTdk('/users/123')
    expect(entry).toBe(ROUTE_TDK['/users'])
  })

  it('falls back to default when missing', () => {
    const entry = getRouteTdk('/unknown/path')
    expect(entry).toBe(DEFAULT_TDK)
  })
})

describe('menu config', () => {
  it('has primary and secondary navigation items', () => {
    expect(primaryNav.length).toBeGreaterThan(0)
    expect(secondaryNav.length).toBeGreaterThan(0)
  })

  it('each item has title, path, and icon', () => {
    const allNav = [...primaryNav, ...secondaryNav]
    allNav.forEach((item) => {
      expect(item.title).toBeTruthy()
      // 父级菜单可能没有 to 属性
      if (item.to) {
        expect(item.to.startsWith('/')).toBe(true)
      }
      expect(item.icon).toBeDefined()
    })
  })
})
