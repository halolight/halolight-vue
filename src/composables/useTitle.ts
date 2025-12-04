import type { MaybeRefOrGetter } from 'vue'
import { onMounted, onUnmounted, watch } from 'vue'
import { toValue } from 'vue'

export interface UseTitleOptions {
  /** 标题后缀 */
  suffix?: string
  /** 默认标题 */
  defaultTitle?: string
  /** 卸载时是否重置标题 */
  resetOnUnmount?: boolean
}

/**
 * 动态设置页面标题
 * @param title 标题（可以是 ref 或 getter）
 * @param options 配置选项
 */
export function useTitle(
  title: MaybeRefOrGetter<string | undefined>,
  options: UseTitleOptions = {}
) {
  const { suffix = 'Admin Pro', defaultTitle, resetOnUnmount = false } = options

  let previousTitle: string | null = null

  const updateTitle = () => {
    const titleValue = toValue(title)
    const nextTitle = titleValue ? `${titleValue} - ${suffix}` : defaultTitle || suffix

    if (document.title !== nextTitle) {
      if (previousTitle === null) {
        previousTitle = document.title
      }
      document.title = nextTitle
    }
  }

  onMounted(() => {
    updateTitle()
  })

  // 如果 title 是响应式的，监听变化
  watch(() => toValue(title), updateTitle)

  onUnmounted(() => {
    if (resetOnUnmount && previousTitle !== null) {
      document.title = previousTitle
    }
  })
}
