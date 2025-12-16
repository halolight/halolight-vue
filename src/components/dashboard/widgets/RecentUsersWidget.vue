<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useDashboardUsers } from '@/composables/useDashboardData'

const { data, isLoading } = useDashboardUsers()

function getStatusLabel(status: string) {
  switch (status) {
    case 'active': return '在线'
    case 'inactive': return '离线'
    case 'suspended': return '已禁用'
    default: return status
  }
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'active': return 'default'
    case 'inactive': return 'secondary'
    case 'suspended': return 'destructive'
    default: return 'outline'
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
        v-for="user in data"
        :key="user.id"
        class="flex items-center gap-3"
      >
        <Avatar class="h-8 w-8">
          <AvatarImage v-if="user.avatar" :src="user.avatar" :alt="user.name" />
          <AvatarFallback>{{ user.name.slice(0, 1) }}</AvatarFallback>
        </Avatar>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ user.name }}</p>
          <p class="text-xs text-muted-foreground truncate">{{ user.email }}</p>
        </div>
        <Badge :variant="getStatusVariant(user.status)" class="text-xs">
          {{ getStatusLabel(user.status) }}
        </Badge>
      </div>
    </template>
  </div>
</template>
