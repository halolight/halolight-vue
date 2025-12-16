<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Globe,
  Loader2,
  RefreshCw,
  TrendingUp,
  Users,
} from 'lucide-vue-next'
import { computed } from 'vue'

import { fetchAnalytics } from '@/api/analytics'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

const { data, isLoading, isRefetching, refetch } = useQuery({
  queryKey: ['analytics'],
  queryFn: fetchAnalytics,
})

const analytics = computed(() => data.value)

const kpis = computed(() => analytics.value?.kpis ?? [])
const traffic = computed(() => analytics.value?.traffic ?? [])
const regions = computed(() => analytics.value?.regions ?? [])

const trafficTotal = computed(() =>
  traffic.value.reduce((sum, item) => sum + item.value, 0)
)

const topRegion = computed(() => {
  if (regions.value.length === 0) return null
  return regions.value.reduce((prev, current) =>
    prev.users > current.users ? prev : current
  )
})

function getChangeIcon(change: string) {
  if (change.includes('+')) return ArrowUp
  if (change.includes('-')) return ArrowDown
  return Activity
}

function getChangeColor(change: string): string {
  if (change.includes('+')) return 'text-green-500'
  if (change.includes('-')) return 'text-red-500'
  return 'text-gray-500'
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">分析报告</h1>
        <p class="text-muted-foreground mt-1">查看关键指标和数据分析</p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" :disabled="isRefetching" @click="() => refetch()">
          <RefreshCw :class="cn('h-4 w-4 mr-2', isRefetching && 'animate-spin')" />
          {{ isRefetching ? '刷新中' : '刷新' }}
        </Button>
      </div>
    </div>

    <!-- 核心指标 -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <TrendingUp class="h-5 w-5" />
          核心指标 (KPI)
        </CardTitle>
        <CardDescription>关键业务指标和增长趋势</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex items-center justify-center py-8">
          <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card
            v-for="kpi in kpis"
            :key="kpi.label"
            class="border-muted bg-muted/30"
          >
            <CardContent class="pt-6">
              <div class="space-y-2">
                <p class="text-sm text-muted-foreground">{{ kpi.label }}</p>
                <p class="text-2xl font-bold">{{ kpi.value }}</p>
                <div class="flex items-center gap-1">
                  <component
                    :is="getChangeIcon(kpi.change)"
                    :class="cn('h-3 w-3', getChangeColor(kpi.change))"
                  />
                  <span :class="cn('text-xs font-medium', getChangeColor(kpi.change))">
                    {{ kpi.change }}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- 流量来源 -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <BarChart3 class="h-5 w-5" />
            流量来源
          </CardTitle>
          <CardDescription>
            按渠道统计 · 总量 {{ trafficTotal }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="isLoading" class="flex items-center justify-center py-8">
            <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(item, index) in traffic"
              :key="item.source"
              class="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg',
                    index === 0 && 'bg-blue-500/10 text-blue-500',
                    index === 1 && 'bg-green-500/10 text-green-500',
                    index === 2 && 'bg-yellow-500/10 text-yellow-500',
                    index === 3 && 'bg-purple-500/10 text-purple-500',
                    index > 3 && 'bg-gray-500/10 text-gray-500'
                  )"
                >
                  <BarChart3 class="h-4 w-4" />
                </div>
                <div>
                  <p class="font-medium">{{ item.source }}</p>
                  <p class="text-xs text-muted-foreground">
                    {{ ((item.value / trafficTotal) * 100).toFixed(1) }}%
                  </p>
                </div>
              </div>
              <Badge variant="outline" class="font-mono">
                {{ item.value.toLocaleString() }}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 区域分布 -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Globe class="h-5 w-5" />
            区域分布
          </CardTitle>
          <CardDescription>
            按省份统计 · 最高 {{ topRegion?.name ?? '-' }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="isLoading" class="flex items-center justify-center py-8">
            <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(region, index) in regions"
              :key="region.name"
              class="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg',
                    index === 0 && 'bg-red-500/10 text-red-500',
                    index === 1 && 'bg-orange-500/10 text-orange-500',
                    index === 2 && 'bg-amber-500/10 text-amber-500',
                    index > 2 && 'bg-gray-500/10 text-gray-500'
                  )"
                >
                  <Users class="h-4 w-4" />
                </div>
                <div>
                  <p class="font-medium">{{ region.name }}</p>
                  <p class="text-xs text-muted-foreground">省份/地区</p>
                </div>
              </div>
              <Badge variant="outline" class="font-mono">
                {{ region.users.toLocaleString() }} 用户
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 数据摘要 -->
    <Card class="border-primary/20 bg-primary/5">
      <CardContent class="pt-6">
        <div class="flex items-start gap-4">
          <div class="rounded-lg bg-primary/10 p-3">
            <Activity class="h-6 w-6 text-primary" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold mb-1">数据分析说明</h3>
            <p class="text-sm text-muted-foreground">
              以上数据来自 Mock.js 模拟接口。在生产环境中，这些数据将从真实的分析 API 获取，
              包括实时用户行为、转化率、留存率等核心业务指标。您可以通过修改
              <code class="px-1 py-0.5 rounded bg-muted text-xs">fetchAnalytics</code>
              函数来对接真实的数据源。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
