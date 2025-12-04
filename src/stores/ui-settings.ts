import '@/types/view-transitions.d.ts'

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type SkinPreset =
  | 'default'
  | 'blue'
  | 'emerald'
  | 'amber'
  | 'violet'
  | 'rose'
  | 'teal'
  | 'slate'
  | 'ocean'
  | 'sunset'
  | 'aurora'

export const useUiSettingsStore = defineStore('ui-settings', () => {
  const showFooter = ref(true)
  const showTabBar = ref(true)
  const mobileHeaderFixed = ref(true)
  const mobileTabBarFixed = ref(true)
  const skin = ref<SkinPreset>('default')
  const theme = ref<'light' | 'dark' | 'system'>('system')

  function setShowFooter(value: boolean) {
    showFooter.value = value
  }

  function setShowTabBar(value: boolean) {
    showTabBar.value = value
  }

  function setMobileHeaderFixed(value: boolean) {
    mobileHeaderFixed.value = value
  }

  function setMobileTabBarFixed(value: boolean) {
    mobileTabBarFixed.value = value
  }

  function setSkin(value: SkinPreset) {
    skin.value = value
    applySkin(value)
  }

  function applySkin(skinValue: SkinPreset) {
    const root = document.documentElement
    if (skinValue === 'default') {
      root.removeAttribute('data-skin')
    } else {
      root.dataset.skin = skinValue
    }
  }

  function applyTheme(themeValue: 'light' | 'dark' | 'system') {
    const root = document.documentElement
    const isDark =
      themeValue === 'dark' ||
      (themeValue === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    root.classList.remove('light', 'dark')
    root.classList.add(isDark ? 'dark' : 'light')
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
   * 普通主题切换
   */
  function setTheme(value: 'light' | 'dark' | 'system') {
    theme.value = value
    applyTheme(value)
  }

  /**
   * 带动画的主题切换（使用 View Transitions API）
   */
  async function setThemeWithTransition(
    value: 'light' | 'dark' | 'system',
    event?: MouseEvent | { clientX: number; clientY: number }
  ) {
    // 计算将要变成的主题
    const willBeDark =
      value === 'dark' ||
      (value === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)

    // 不支持 View Transitions 或用户偏好减少动画时，直接切换
    if (!supportsViewTransitions() || prefersReducedMotion()) {
      setTheme(value)
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
        theme.value = value
        applyTheme(value)
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
      setTheme(value)
    } finally {
      document.documentElement.classList.remove('transitioning-to-light')
    }
  }

  function resetSettings() {
    setShowFooter(true)
    setShowTabBar(true)
    setMobileHeaderFixed(true)
    setMobileTabBarFixed(true)
    setSkin('default')
    setTheme('system')
  }

  function init() {
    applySkin(skin.value)
    applyTheme(theme.value || 'system')
  }

  watch(skin, (value) => applySkin(value))
  watch(theme, (value) => applyTheme(value || 'system'))

  return {
    showFooter,
    showTabBar,
    mobileHeaderFixed,
    mobileTabBarFixed,
    skin,
    theme,
    setShowFooter,
    setShowTabBar,
    setMobileHeaderFixed,
    setMobileTabBarFixed,
    setSkin,
    setTheme,
    setThemeWithTransition,
    resetSettings,
    init,
  }
}, {
  persist: {
    key: 'ui-settings',
  },
})
