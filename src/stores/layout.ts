import '@/types/view-transitions.d.ts'

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

export const useLayoutStore = defineStore('layout', () => {
  // State
  const sidebarCollapsed = ref(false)
  const mobileSidebarOpen = ref(false)
  const theme = ref<Theme>('system')
  const showFooter = ref(true)

  // Getters
  const resolvedTheme = computed(() => {
    if (theme.value !== 'system') return theme.value
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const isDark = computed(() => resolvedTheme.value === 'dark')

  // Actions
  function setSidebarCollapsed(value: boolean) {
    sidebarCollapsed.value = value
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function openMobileSidebar() {
    mobileSidebarOpen.value = true
    sidebarCollapsed.value = false
  }

  function closeMobileSidebar() {
    mobileSidebarOpen.value = false
  }

  function setMobileSidebarOpen(value: boolean) {
    mobileSidebarOpen.value = value
  }

  function applyTheme() {
    if (typeof document === 'undefined') return
    const resolved = resolvedTheme.value
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(resolved)
    document.documentElement.dataset.theme = resolved
  }

  /**
   * 检查是否支持 View Transitions API
   */
  function supportsViewTransitions(): boolean {
    return (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      typeof document.startViewTransition === 'function'
    )
  }

  /**
   * 检查用户是否偏好减少动画
   */
  function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * 使用 View Transitions API 设置主题（带圆形扩散动画）
   */
  async function setThemeWithTransition(
    newTheme: Theme,
    event?: MouseEvent | { clientX: number; clientY: number }
  ) {
    // 计算将要变成的主题
    const willBeDark =
      newTheme === 'dark' ||
      (newTheme === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)

    // 不支持 View Transitions 或用户偏好减少动画时，直接切换
    if (!supportsViewTransitions() || prefersReducedMotion()) {
      setTheme(newTheme)
      return
    }

    // 获取动画起点坐标
    const x = event?.clientX ?? window.innerWidth / 2
    const y = event?.clientY ?? window.innerHeight / 2

    // 计算最大半径（从点击位置到屏幕最远角的距离）
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const clipPathStart = `circle(0px at ${x}px ${y}px)`
    const clipPathEnd = `circle(${maxRadius}px at ${x}px ${y}px)`

    // 切换到浅色模式时，添加标记类
    if (!willBeDark) {
      document.documentElement.classList.add('transitioning-to-light')
    }

    try {
      // 使用 View Transition API 包装状态更新
      const transition = document.startViewTransition(() => {
        theme.value = newTheme
        applyTheme()
        localStorage.setItem('halolight-theme', newTheme)
      })

      await transition.ready

      // 执行 clip-path 动画
      const animation = document.documentElement.animate(
        {
          clipPath: willBeDark ? [clipPathStart, clipPathEnd] : [clipPathEnd, clipPathStart],
        },
        {
          duration: 400,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: willBeDark ? '::view-transition-new(root)' : '::view-transition-old(root)',
        }
      )

      await animation.finished
    } catch {
      // 发生错误时回退到普通切换
      setTheme(newTheme)
    } finally {
      document.documentElement.classList.remove('transitioning-to-light')
    }
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme
    applyTheme()
    localStorage.setItem('halolight-theme', newTheme)
  }

  function toggleTheme() {
    setTheme(resolvedTheme.value === 'dark' ? 'light' : 'dark')
  }

  /**
   * 带动画的主题切换
   */
  async function toggleThemeWithTransition(event?: MouseEvent) {
    const newTheme = resolvedTheme.value === 'dark' ? 'light' : 'dark'
    await setThemeWithTransition(newTheme, event)
  }

  function initTheme() {
    const cached = localStorage.getItem('halolight-theme') as Theme | null
    theme.value = cached || 'system'
    applyTheme()

    if (typeof window !== 'undefined') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (theme.value === 'system') applyTheme()
      })
    }
  }

  return {
    // State
    sidebarCollapsed,
    mobileSidebarOpen,
    theme,
    showFooter,
    // Getters
    resolvedTheme,
    isDark,
    // Actions
    toggleSidebar,
    setTheme,
    setThemeWithTransition,
    toggleTheme,
    toggleThemeWithTransition,
    applyTheme,
    initTheme,
    openMobileSidebar,
    closeMobileSidebar,
    setMobileSidebarOpen,
    setSidebarCollapsed,
  }
})
