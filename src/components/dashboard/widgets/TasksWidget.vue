<script setup lang="ts">
import { CheckCircle2, Circle, Clock } from 'lucide-vue-next'

import { Badge } from '@/components/ui/badge'
import { useDashboardTasks } from '@/composables/useDashboardData'

const { data, isLoading } = useDashboardTasks()

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed': return CheckCircle2
    case 'in-progress': return Clock
    default: return Circle
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case 'completed': return 'text-green-500'
    case 'in-progress': return 'text-blue-500'
    default: return 'text-muted-foreground'
  }
}

function getPriorityVariant(priority: string) {
  switch (priority) {
    case 'high': return 'destructive'
    case 'medium': return 'default'
    default: return 'secondary'
  }
}

function getPriorityLabel(priority: string) {
  switch (priority) {
    case 'high': return '高'
    case 'medium': return '中'
    default: return '低'
  }
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="isLoading" class="text-center text-muted-foreground py-4">
      加载中...
    </div>
    <template v-else>
      <div
        v-for="task in data"
        :key="task.id"
        class="flex items-center gap-3"
      >
        <div :class="getStatusClass(task.status ?? 'pending')">
          <component :is="getStatusIcon(task.status ?? 'pending')" class="h-4 w-4" />
        </div>
        <p
          :class="[
            'flex-1 text-sm truncate',
            task.status === 'completed' && 'line-through text-muted-foreground'
          ]"
        >
          {{ task.title }}
        </p>
        <Badge :variant="getPriorityVariant(task.priority ?? 'low')" class="text-xs shrink-0">
          {{ getPriorityLabel(task.priority ?? 'low') }}
        </Badge>
      </div>
    </template>
  </div>
</template>
