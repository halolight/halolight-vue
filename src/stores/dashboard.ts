import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type WidgetType =
  | 'stats'
  | 'chart-line'
  | 'chart-bar'
  | 'chart-pie'
  | 'recent-users'
  | 'notifications'
  | 'tasks'
  | 'calendar'
  | 'quick-actions'

export interface DashboardWidget {
  id: string
  type: WidgetType
  title: string
  config?: Record<string, unknown>
}

export interface DashboardLayout {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
}

const defaultWidgets: DashboardWidget[] = [
  { id: 'stats-1', type: 'stats', title: '核心指标' },
  { id: 'chart-line-1', type: 'chart-line', title: '访问趋势' },
  { id: 'chart-bar-1', type: 'chart-bar', title: '销售统计' },
  { id: 'chart-pie-1', type: 'chart-pie', title: '流量来源' },
  { id: 'recent-users-1', type: 'recent-users', title: '最近用户' },
  { id: 'notifications-1', type: 'notifications', title: '通知中心' },
  { id: 'tasks-1', type: 'tasks', title: '待办事项' },
  { id: 'calendar-1', type: 'calendar', title: '今日日程' },
  { id: 'quick-actions-1', type: 'quick-actions', title: '快捷操作' },
]

const defaultLayouts: DashboardLayout[] = [
  { i: 'stats-1', x: 0, y: 0, w: 12, h: 2, minW: 6, minH: 2 },
  { i: 'chart-line-1', x: 0, y: 2, w: 8, h: 4, minW: 4, minH: 3 },
  { i: 'chart-bar-1', x: 8, y: 2, w: 4, h: 4, minW: 3, minH: 3 },
  { i: 'chart-pie-1', x: 0, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
  { i: 'recent-users-1', x: 4, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
  { i: 'notifications-1', x: 8, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
  { i: 'tasks-1', x: 0, y: 10, w: 4, h: 4, minW: 3, minH: 3 },
  { i: 'calendar-1', x: 4, y: 10, w: 4, h: 4, minW: 3, minH: 3 },
  { i: 'quick-actions-1', x: 8, y: 10, w: 4, h: 4, minW: 3, minH: 3 },
]

export const useDashboardStore = defineStore('dashboard', () => {
  const widgets = ref<DashboardWidget[]>([...defaultWidgets])
  const layouts = ref<DashboardLayout[]>([...defaultLayouts])
  const isEditing = ref(false)

  // Computed
  const widgetCount = computed(() => widgets.value.length)
  const hasWidgets = computed(() => widgets.value.length > 0)

  // Actions
  function setIsEditing(value: boolean) {
    isEditing.value = value
  }

  function setLayouts(newLayouts: DashboardLayout[]) {
    layouts.value = newLayouts
  }

  function addWidget(type: WidgetType, title: string, config?: Record<string, unknown>) {
    const id = `${type}-${Date.now()}`
    const newWidget: DashboardWidget = { id, type, title, config }

    // Find the bottom-most position
    const maxY = layouts.value.reduce((max, l) => Math.max(max, l.y + l.h), 0)

    const newLayout: DashboardLayout = {
      i: id,
      x: 0,
      y: maxY,
      w: 4,
      h: type === 'stats' ? 2 : type === 'quick-actions' ? 4 : 4,
      minW: 3,
      minH: type === 'stats' ? 2 : type === 'quick-actions' ? 3 : 3,
    }

    widgets.value = [...widgets.value, newWidget]
    layouts.value = [...layouts.value, newLayout]
  }

  function removeWidget(id: string) {
    widgets.value = widgets.value.filter((w) => w.id !== id)
    layouts.value = layouts.value.filter((l) => l.i !== id)
  }

  function resetToDefault() {
    widgets.value = [...defaultWidgets]
    layouts.value = [...defaultLayouts]
  }

  function getLayoutForWidget(widgetId: string): DashboardLayout | undefined {
    return layouts.value.find((l) => l.i === widgetId)
  }

  return {
    // State
    widgets,
    layouts,
    isEditing,
    // Computed
    widgetCount,
    hasWidgets,
    // Actions
    setIsEditing,
    setLayouts,
    addWidget,
    removeWidget,
    resetToDefault,
    getLayoutForWidget,
  }
}, {
  persist: {
    key: 'dashboard-storage',
  },
})
