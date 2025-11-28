<script setup lang="ts">
import { BarChart3, ShieldCheck, TrendingDown, TrendingUp, Users, Zap } from 'lucide-vue-next'
import { computed } from 'vue'

import { Badge } from '@/components/ui/badge'
import { useDashboardStats } from '@/composables/useDashboardData'

const { data, isLoading } = useDashboardStats()

const stats = computed(() => [
  {
    key: 'revenue',
    title: 'MRR (本月)',
    value: `¥${((data.value?.totalRevenue ?? 0) / 1000).toFixed(0)}k`,
    change: data.value?.revenueChange ?? 0,
    icon: BarChart3,
  },
  {
    key: 'users',
    title: '活跃用户',
    value: (data.value?.totalUsers ?? 0).toLocaleString(),
    change: data.value?.userChange ?? 0,
    icon: Users,
  },
  {
    key: 'orders',
    title: '总订单',
    value: (data.value?.totalOrders ?? 0).toLocaleString(),
    change: data.value?.orderChange ?? 0,
    icon: Zap,
  },
  {
    key: 'conversion',
    title: '转化率',
    value: `${data.value?.conversionRate ?? 0}%`,
    change: data.value?.conversionChange ?? 0,
    icon: ShieldCheck,
  },
])

function formatChange(change: number) {
  const prefix = change >= 0 ? '+' : ''
  return `${prefix}${change}%`
}
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="stat in stats"
      :key="stat.key"
      class="space-y-1"
    >
      <div class="flex items-center gap-2 text-muted-foreground">
        <component :is="stat.icon" class="h-4 w-4" />
        <span class="text-xs">{{ stat.title }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span v-if="isLoading" class="text-lg font-bold text-muted-foreground">...</span>
        <span v-else class="text-lg font-bold">{{ stat.value }}</span>
        <Badge
          :variant="stat.change >= 0 ? 'default' : 'destructive'"
          class="text-xs gap-0.5"
        >
          <TrendingUp v-if="stat.change >= 0" class="h-3 w-3" />
          <TrendingDown v-else class="h-3 w-3" />
          {{ formatChange(stat.change) }}
        </Badge>
      </div>
    </div>
  </div>
</template>
