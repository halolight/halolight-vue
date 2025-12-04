<script setup lang="ts">
import { GripVertical, X } from 'lucide-vue-next'
import type { Component } from 'vue'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { DashboardWidget } from '@/stores/dashboard'

import CalendarWidget from './CalendarWidget.vue'
import ChartBarWidget from './ChartBarWidget.vue'
import ChartLineWidget from './ChartLineWidget.vue'
import ChartPieWidget from './ChartPieWidget.vue'
import NotificationsWidget from './NotificationsWidget.vue'
import QuickActionsWidget from './QuickActionsWidget.vue'
import RecentUsersWidget from './RecentUsersWidget.vue'
import StatsWidget from './StatsWidget.vue'
import TasksWidget from './TasksWidget.vue'

interface Props {
  widget: DashboardWidget
  isEditing: boolean
  isMobile?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  remove: []
}>()

const widgetComponents: Record<string, Component> = {
  stats: StatsWidget,
  'chart-line': ChartLineWidget,
  'chart-bar': ChartBarWidget,
  'chart-pie': ChartPieWidget,
  'recent-users': RecentUsersWidget,
  notifications: NotificationsWidget,
  tasks: TasksWidget,
  calendar: CalendarWidget,
  'quick-actions': QuickActionsWidget,
}
</script>

<template>
  <Card
    :class="cn(
      'h-full flex flex-col overflow-hidden transition-all duration-200',
      isEditing && !isMobile && 'ring-2 ring-primary/30 ring-offset-2 ring-offset-background'
    )"
  >
    <CardHeader
      :class="cn(
        'flex flex-row items-center justify-between space-y-0 pb-2',
        props.widget.type === 'stats' && 'pb-0'
      )"
    >
      <div class="flex items-center gap-2">
        <!-- Drag handle - only show in edit mode on desktop -->
        <div
          v-if="isEditing && !isMobile"
          class="drag-handle cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-muted"
        >
          <GripVertical class="h-4 w-4 text-muted-foreground" />
        </div>
        <CardTitle class="text-sm font-medium">{{ widget.title }}</CardTitle>
      </div>
      <!-- Remove button - only show in edit mode -->
      <Button
        v-if="isEditing"
        variant="ghost"
        size="icon"
        class="h-6 w-6 text-muted-foreground hover:text-destructive"
        @click="emit('remove')"
      >
        <X class="h-4 w-4" />
      </Button>
    </CardHeader>
    <CardContent :class="cn('flex-1', widget.type === 'stats' && 'pt-0')">
      <component
        :is="widgetComponents[widget.type]"
        v-if="widgetComponents[widget.type]"
        :widget="widget"
      />
      <div v-else class="h-full flex items-center justify-center text-muted-foreground">
        未知部件类型
      </div>
    </CardContent>
  </Card>
</template>
