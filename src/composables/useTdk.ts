import type { MaybeRefOrGetter } from 'vue'
import { onMounted, watch } from 'vue'
import { toValue } from 'vue'

import type { TdkEntry } from '@/config/tdk'

import { useTitle } from './useTitle'

/**
 * 更新或创建 meta 标签
 * @param name meta 标签的 name 属性
 * @param content meta 标签的 content 属性
 */
function updateMetaTag(name: string, content: string): void {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null

  if (!meta) {
    meta = document.createElement('meta')
    meta.name = name
    document.head.appendChild(meta)
  }

  if (meta.content !== content) {
    meta.content = content
  }
}

/**
 * 管理页面 TDK（Title, Description, Keywords）
 * @param entry TDK 配置（可以是 ref 或 getter）
 */
export function useTdk(entry: MaybeRefOrGetter<TdkEntry>) {
  // 使用 useTitle 管理标题
  useTitle(() => toValue(entry).title)

  const updateMeta = () => {
    const { description, keywords } = toValue(entry)
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
  }

  onMounted(() => {
    updateMeta()
  })

  // 监听 entry 变化
  watch(() => toValue(entry), updateMeta, { deep: true })
}
