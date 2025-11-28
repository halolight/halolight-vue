<script setup lang="ts">
import { AlertCircle, Bell, CheckCircle, Info, User } from 'lucide-vue-next'

import { useDashboardNotifications } from '@/composables/useDashboardData'

const { data, isLoading } = useDashboardNotifications()

function getIcon(type: string) {
  switch (type) {
    case 'user': return User
    case 'system': return Info
    case 'task': return CheckCircle
    case 'alert': return AlertCircle
    default: return Bell
  }
}

function getIconClass(type: string) {
  switch (type) {
    case 'user': return 'text-blue-500'
    case 'system': return 'text-muted-foreground'
    case 'task': return 'text-green-500'
    case 'alert': return 'text-red-500'
    default: return 'text-muted-foreground'
  }
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))

  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return date.toLocaleDateString('zh-CN')
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="isLoading" class="text-center text-muted-foreground py-4">
      加载中...
    </div>
    <template v-else>
      <div
        v-for="notification in data"
        :key="notification.id"
        class="flex items-start gap-3"
      >
        <div :class="['mt-0.5', getIconClass(notification.type)]">
          <component :is="getIcon(notification.type)" class="h-4 w-4" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ notification.title }}</p>
          <p class="text-xs text-muted-foreground truncate">{{ notification.content }}</p>
          <p class="text-xs text-muted-foreground mt-0.5">{{ formatTime(notification.createdAt) }}</p>
        </div>
        <div
          v-if="!notification.read"
          class="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5"
        />
      </div>
    </template>
  </div>
</template>
