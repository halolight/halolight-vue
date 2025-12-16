import { describe, expect, it } from 'vitest'
import { createApp, nextTick, ref } from 'vue'

import { useTdk } from '@/composables/useTdk'

describe('useTdk composable', () => {
  it('updates title and meta tags', async () => {
    const entry = ref({
      title: '测试页面',
      description: '描述 A',
      keywords: 'a,b,c',
    })

    document.title = 'Initial'
    document.head.innerHTML = ''

    const app = createApp({
      setup() {
        useTdk(entry)
        return {}
      },
      template: '<div />',
    })
    app.mount(document.createElement('div'))

    await nextTick()
    expect(document.title).toBe('测试页面 - Admin Pro')
    expect((document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content).toBe('描述 A')
    expect((document.querySelector('meta[name="keywords"]') as HTMLMetaElement)?.content).toBe('a,b,c')

    entry.value = {
      title: '更新后的标题',
      description: '描述 B',
      keywords: 'd,e',
    }
    await nextTick()

    expect(document.title).toBe('更新后的标题 - Admin Pro')
    expect((document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content).toBe('描述 B')
    expect((document.querySelector('meta[name="keywords"]') as HTMLMetaElement)?.content).toBe('d,e')
  })
})
