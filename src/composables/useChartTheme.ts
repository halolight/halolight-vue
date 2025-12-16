import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

import { useUiSettingsStore } from '@/stores/ui-settings'

// Convert CSS color to hex (works with oklch, rgb, hsl, etc.)
function cssColorToHex(cssColor: string): string {
  // Create a temporary element to compute the color
  const temp = document.createElement('div')
  temp.style.color = cssColor
  document.body.appendChild(temp)
  const computed = getComputedStyle(temp).color
  document.body.removeChild(temp)

  // Parse rgb(r, g, b) format
  const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (match && match[1] && match[2] && match[3]) {
    const r = parseInt(match[1], 10)
    const g = parseInt(match[2], 10)
    const b = parseInt(match[3], 10)
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }
  return '#6366f1' // fallback
}

// Get CSS variable value
function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

// Get chart color from CSS variable
function getChartColor(index: number): string {
  const cssValue = getCssVar(`--chart-${index}`)
  if (!cssValue) return ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'][index - 1] || '#6366f1'
  return cssColorToHex(cssValue)
}

// Get primary and accent colors
function getPrimaryColor(): string {
  const cssValue = getCssVar('--primary')
  if (!cssValue) return '#6366f1'
  return cssColorToHex(cssValue)
}

function getForegroundColor(): string {
  const cssValue = getCssVar('--foreground')
  if (!cssValue) return '#0f172a'
  return cssColorToHex(cssValue)
}

function getMutedForegroundColor(): string {
  const cssValue = getCssVar('--muted-foreground')
  if (!cssValue) return '#64748b'
  return cssColorToHex(cssValue)
}

function getBorderColor(): string {
  const cssValue = getCssVar('--border')
  if (!cssValue) return '#e2e8f0'
  return cssColorToHex(cssValue)
}

export function useChartTheme() {
  const uiSettings = useUiSettingsStore()
  const updateKey = ref(0)

  // Force update when theme or skin changes
  const triggerUpdate = async () => {
    // Wait for next tick to ensure DOM is updated
    await nextTick()
    // Additional delay for CSS to fully compute
    setTimeout(() => {
      updateKey.value++
    }, 100)
  }

  // Watch for theme and skin changes
  watch(() => uiSettings.theme, triggerUpdate, { immediate: false })
  watch(() => uiSettings.skin, triggerUpdate, { immediate: false })

  // Also listen for class changes on document element (for dark mode)
  let observer: MutationObserver | null = null

  onMounted(() => {
    observer = new MutationObserver(() => {
      triggerUpdate()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-skin'],
    })
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  const chartColors = computed(() => {
    void updateKey.value // Dependency for reactivity
    return [
      getChartColor(1),
      getChartColor(2),
      getChartColor(3),
      getChartColor(4),
      getChartColor(5),
    ]
  })

  const primaryColor = computed(() => {
    void updateKey.value
    return getPrimaryColor()
  })

  const textColor = computed(() => {
    void updateKey.value
    return getForegroundColor()
  })

  const mutedColor = computed(() => {
    void updateKey.value
    return getMutedForegroundColor()
  })

  const borderColor = computed(() => {
    void updateKey.value
    return getBorderColor()
  })

  return {
    chartColors,
    primaryColor,
    textColor,
    mutedColor,
    borderColor,
    updateKey,
  }
}
