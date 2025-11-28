<script setup lang="ts">
import { Calendar, Clock, Video } from 'lucide-vue-next'

import { useDashboardCalendar } from '@/composables/useDashboardData'

const { data, isLoading } = useDashboardCalendar()

function getIcon(type: string) {
  switch (type) {
    case 'meeting': return Video
    case 'reminder': return Clock
    default: return Calendar
  }
}

function formatTime(dateStr: string, allDay?: boolean) {
  if (allDay) return '全天'
  const date = new Date(dateStr)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return '今天'
  if (date.toDateString() === tomorrow.toDateString()) return '明天'
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="isLoading" class="text-center text-muted-foreground py-4">
      加载中...
    </div>
    <template v-else>
      <div
        v-for="event in data"
        :key="event.id"
        class="flex items-start gap-3"
      >
        <div
          class="w-1 h-full min-h-[40px] rounded-full"
          :style="{ backgroundColor: event.color }"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ event.title }}</p>
          <p v-if="event.description" class="text-xs text-muted-foreground truncate">
            {{ event.description }}
          </p>
          <div class="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <component :is="getIcon(event.type ?? 'default')" class="h-3 w-3" />
            <span>{{ formatDate(event.start) }}</span>
            <span>{{ formatTime(event.start, event.allDay) }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
