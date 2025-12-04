import { defineStore } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// 页面状态缓存
interface PageState {
  scrollY: number
  formData?: Record<string, unknown>
  customState?: Record<string, unknown>
  timestamp: number
}

interface PageCacheState {
  cache: Map<string, PageState>
}

// Pinia store for page cache
export const usePageCacheStore = defineStore('page-cache', {
  state: (): PageCacheState => ({
    cache: new Map(),
  }),
  actions: {
    setPageState(path: string, state: Partial<PageState>) {
      const existing = this.cache.get(path) || { scrollY: 0, timestamp: Date.now() }
      this.cache.set(path, { ...existing, ...state, timestamp: Date.now() })
    },
    getPageState(path: string): PageState | undefined {
      return this.cache.get(path)
    },
    clearPageState(path: string) {
      this.cache.delete(path)
    },
    clearAllCache() {
      this.cache.clear()
    },
  },
})

// Hook: 自动保存和恢复滚动位置
export function useScrollRestore() {
  const route = useRoute()
  const store = usePageCacheStore()
  const isRestoring = ref(false)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const handleScroll = () => {
    if (!isRestoring.value) {
      store.setPageState(route.path, { scrollY: window.scrollY })
    }
  }

  const throttledScroll = () => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(handleScroll, 100)
  }

  onMounted(() => {
    // 恢复滚动位置
    const pageState = store.getPageState(route.path)
    if (pageState && pageState.scrollY > 0) {
      isRestoring.value = true
      requestAnimationFrame(() => {
        window.scrollTo(0, pageState.scrollY)
        setTimeout(() => {
          isRestoring.value = false
        }, 100)
      })
    }

    // 监听滚动事件
    window.addEventListener('scroll', throttledScroll)
  })

  onUnmounted(() => {
    if (timeoutId) clearTimeout(timeoutId)
    window.removeEventListener('scroll', throttledScroll)
  })

  // 监听路由变化，恢复新页面的滚动位置
  watch(
    () => route.path,
    (newPath) => {
      const pageState = store.getPageState(newPath)
      if (pageState && pageState.scrollY > 0) {
        isRestoring.value = true
        requestAnimationFrame(() => {
          window.scrollTo(0, pageState.scrollY)
          setTimeout(() => {
            isRestoring.value = false
          }, 100)
        })
      }
    }
  )
}

// Hook: 保存和恢复表单状态
export function useFormCache<T extends Record<string, unknown>>(
  formKey: string,
  initialValues: T
): [
  { value: T },
  (values: T) => void,
  () => void,
] {
  const route = useRoute()
  const store = usePageCacheStore()
  const cacheKey = `${route.path}:${formKey}`

  // 从缓存获取初始值
  const getCachedValues = (): T => {
    const pageState = store.getPageState(cacheKey)
    if (pageState?.formData) {
      return pageState.formData as T
    }
    return initialValues
  }

  const values = ref<T>(getCachedValues())

  // 保存表单值到缓存
  const saveValues = (newValues: T) => {
    values.value = newValues
    store.setPageState(cacheKey, { formData: newValues })
  }

  // 清除缓存
  const clearCache = () => {
    values.value = initialValues
    store.clearPageState(cacheKey)
  }

  return [values as { value: T }, saveValues, clearCache]
}

// Hook: 保存和恢复自定义状态
export function useStateCache<T>(
  key: string,
  initialValue: T
): [
  { value: T },
  (value: T) => void,
] {
  const route = useRoute()
  const store = usePageCacheStore()
  const cacheKey = `${route.path}:${key}`

  // 从缓存获取初始值
  const getCachedValue = (): T => {
    const pageState = store.getPageState(cacheKey)
    if (pageState?.customState?.[key] !== undefined) {
      return pageState.customState[key] as T
    }
    return initialValue
  }

  const value = ref<T>(getCachedValue())

  // 保存到缓存
  const setValue = (newValue: T) => {
    value.value = newValue
    const pageState = store.getPageState(cacheKey) || { scrollY: 0, timestamp: Date.now() }
    store.setPageState(cacheKey, {
      customState: { ...pageState.customState, [key]: newValue },
    })
  }

  return [value as { value: T }, setValue]
}
