<script setup lang="ts">
import { GridItem, GridLayout } from 'grid-layout-plus'
import {
  BarChart3,
  Bell,
  Calendar,
  LineChart,
  PieChart,
  Plus,
  RotateCcw,
  Save,
  Settings,
  Sparkles,
  Users,
  Zap,
} from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useDashboardRefresh } from '@/composables/useDashboardData'
import { cn } from '@/lib/utils'
import { type DashboardLayout, useDashboardStore,type WidgetType } from '@/stores/dashboard'

import WidgetCard from './widgets/WidgetCard.vue'

const dashboardStore = useDashboardStore()
const refreshDashboard = useDashboardRefresh()

const containerRef = ref<HTMLDivElement | null>(null)
const containerWidth = ref(0)
const isRefreshing = ref(false)
const isSheetOpen = ref(false)

// Responsive columns
const columns = computed(() => {
  if (containerWidth.value < 640) return 1
  if (containerWidth.value < 1024) return 6
  return 12
})

const isMobile = computed(() => columns.value === 1)
const rowHeight = computed(() => (isMobile.value ? 140 : 90))
const canEditLayout = computed(
  () => !isMobile.value && dashboardStore.isEditing && columns.value === 12
)

// Responsive layout adjustment
const responsiveLayout = computed(() => {
  const baseLayout = dashboardStore.layouts
  const cols = columns.value

  if (cols === 1) {
    // Mobile: stack vertically
    let currentY = 0
    return baseLayout.map((item) => {
      const next = { ...item, x: 0, y: currentY, w: 1, h: item.h }
      currentY += item.h
      return next
    })
  }

  // Tablet/Desktop: adjust widths
  return baseLayout.map((item) => {
    const width = Math.min(item.w, cols)
    const maxX = Math.max(cols - width, 0)
    const x = Math.min(item.x, maxX)
    return { ...item, w: width, x }
  })
})

// Helper to get layout for a widget
function getWidgetLayout(widgetId: string) {
  return responsiveLayout.value.find((l) => l.i === widgetId)
}

// Widget templates for adding
const widgetTemplates = [
  { type: 'stats' as WidgetType, title: '核心指标', icon: Sparkles, desc: 'KPI 统计概览' },
  { type: 'chart-line' as WidgetType, title: '访问趋势', icon: LineChart, desc: '趋势折线图' },
  { type: 'chart-bar' as WidgetType, title: '销售统计', icon: BarChart3, desc: '柱状对比图' },
  { type: 'chart-pie' as WidgetType, title: '流量来源', icon: PieChart, desc: '饼图占比' },
  { type: 'recent-users' as WidgetType, title: '最近用户', icon: Users, desc: '最新注册用户' },
  { type: 'notifications' as WidgetType, title: '通知中心', icon: Bell, desc: '系统通知列表' },
  { type: 'tasks' as WidgetType, title: '待办事项', icon: Zap, desc: '任务清单' },
  { type: 'calendar' as WidgetType, title: '今日日程', icon: Calendar, desc: '日历事件' },
  { type: 'quick-actions' as WidgetType, title: '快捷操作', icon: Settings, desc: '常用入口' },
]

// Handle resize
function updateWidth() {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.offsetWidth
  }
}

onMounted(() => {
  updateWidth()
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(updateWidth)
    if (containerRef.value) {
      observer.observe(containerRef.value)
    }
    onUnmounted(() => observer.disconnect())
  } else {
    window.addEventListener('resize', updateWidth)
    onUnmounted(() => window.removeEventListener('resize', updateWidth))
  }
})

// Handle layout change
function handleLayoutUpdate(newLayout: DashboardLayout[]) {
  if (!dashboardStore.isEditing || columns.value !== 12) return
  dashboardStore.setLayouts(newLayout)
}

// Handle refresh
async function handleRefresh() {
  isRefreshing.value = true
  await refreshDashboard()
  setTimeout(() => {
    isRefreshing.value = false
  }, 500)
}

// Handle add widget
function handleAddWidget(type: WidgetType, title: string) {
  dashboardStore.addWidget(type, title)
  isSheetOpen.value = false
}

// Handle remove widget
function handleRemoveWidget(id: string) {
  dashboardStore.removeWidget(id)
}

// Handle reset
function handleReset() {
  dashboardStore.resetToDefault()
}

// Handle save
function handleSave() {
  dashboardStore.setIsEditing(false)
}
</script>

<template>
  <div ref="containerRef" class="flex flex-col h-full space-y-4">
    <!-- Toolbar -->
    <div class="flex items-center justify-between flex-wrap gap-2 shrink-0">
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="isRefreshing"
          @click="handleRefresh"
        >
          <RotateCcw :class="cn('h-4 w-4 mr-1', isRefreshing && 'animate-spin')" />
          {{ isRefreshing ? '刷新中...' : '刷新' }}
        </Button>
      </div>

      <div class="flex items-center gap-2">
        <template v-if="dashboardStore.isEditing">
          <!-- Add Widget Sheet -->
          <Sheet v-model:open="isSheetOpen">
            <SheetTrigger as-child>
              <Button variant="outline" size="sm">
                <Plus class="h-4 w-4 mr-1" />
                部件
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>添加部件</SheetTitle>
                <SheetDescription>选择要添加到仪表盘的部件</SheetDescription>
              </SheetHeader>
              <div class="grid gap-3 mt-4">
                <Button
                  v-for="template in widgetTemplates"
                  :key="template.type"
                  variant="outline"
                  class="h-auto justify-start py-3"
                  @click="handleAddWidget(template.type, template.title)"
                >
                  <component :is="template.icon" class="h-5 w-5 mr-3 shrink-0" />
                  <div class="text-left">
                    <p class="font-medium">{{ template.title }}</p>
                    <p class="text-xs text-muted-foreground">{{ template.desc }}</p>
                  </div>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Button variant="outline" size="sm" @click="handleReset">
            <RotateCcw class="h-4 w-4 mr-1" />
            重置
          </Button>

          <Button size="sm" @click="handleSave">
            <Save class="h-4 w-4 mr-1" />
            保存
          </Button>
        </template>

        <Button
          v-else
          variant="outline"
          size="sm"
          @click="dashboardStore.setIsEditing(true)"
        >
          <Settings class="h-4 w-4 mr-1" />
          自定义
        </Button>
      </div>
    </div>

    <!-- Grid Layout Container -->
    <div class="flex-1 min-h-0 overflow-auto">
      <GridLayout
        v-if="containerWidth > 0 && dashboardStore.hasWidgets"
        v-model:layout="responsiveLayout"
        :col-num="columns"
        :row-height="rowHeight"
        :margin="isMobile ? [8, 12] : [12, 12]"
        :is-draggable="canEditLayout"
        :is-resizable="canEditLayout"
        :vertical-compact="true"
        :use-css-transforms="true"
        @layout-updated="handleLayoutUpdate"
      >
        <GridItem
          v-for="widget in dashboardStore.widgets"
          :key="widget.id"
          :i="widget.id"
          :x="getWidgetLayout(widget.id)?.x ?? 0"
          :y="getWidgetLayout(widget.id)?.y ?? 0"
          :w="getWidgetLayout(widget.id)?.w ?? 4"
          :h="getWidgetLayout(widget.id)?.h ?? 4"
          :min-w="getWidgetLayout(widget.id)?.minW ?? 2"
          :min-h="getWidgetLayout(widget.id)?.minH ?? 2"
          drag-allow-from=".drag-handle"
        >
          <WidgetCard
            :widget="widget"
            :is-editing="dashboardStore.isEditing"
            :is-mobile="isMobile"
            @remove="handleRemoveWidget(widget.id)"
          />
        </GridItem>
      </GridLayout>

      <!-- Empty State -->
      <Card
        v-if="!dashboardStore.hasWidgets"
        class="p-8 text-center"
      >
      <div class="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Plus class="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-medium">没有部件</h3>
      <p class="mt-2 text-muted-foreground">
        点击「自定义」按钮添加仪表盘部件
      </p>
      <Button class="mt-4" @click="dashboardStore.setIsEditing(true)">
        <Settings class="h-4 w-4 mr-2" />
        开始自定义
      </Button>
      </Card>
    </div>
  </div>
</template>

<style>
/* grid-layout-plus styles */
.vue-grid-layout {
  position: relative;
}

.vue-grid-item {
  transition: all 200ms ease;
  transition-property: left, top;
}

.vue-grid-item.vue-grid-placeholder {
  background: hsl(var(--primary) / 0.2);
  border: 2px dashed hsl(var(--primary));
  border-radius: 0.5rem;
}

.vue-grid-item > .vue-resizable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: 0;
  right: 0;
  cursor: se-resize;
}

/* Ensure widgets never inherit tinted backgrounds from grid items */
.vue-grid-item {
  background-color: transparent !important;
}

/* Force cards to use their own surface color even if grid item was tinted */
.vue-grid-item .card {
  background-color: hsl(var(--card)) !important;
  color: hsl(var(--card-foreground));
}

/* Drag handle */
.drag-handle {
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}
</style>
