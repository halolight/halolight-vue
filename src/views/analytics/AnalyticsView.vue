<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { BarChart3, Globe, RefreshCw, TrendingUp } from 'lucide-vue-next'

import { fetchAnalytics } from '@/api/analytics'

const { data, isLoading, isRefetching, refetch } = useQuery({
  queryKey: ['analytics'],
  queryFn: fetchAnalytics,
})

const analytics = computed(() => data.value)
const trafficTotal = computed(() => analytics.value?.traffic.reduce((sum, item) => sum + item.value, 0) ?? 0)
</script>

<template>
  <div class="page-header">
    <div>
      <div class="page-eyebrow">Analytics</div>
      <h1 class="page-title" style="margin: 0">分析报告</h1>
      <p class="muted">Mock.js 返回 /api/analytics，包含 KPI、流量来源、区域分布。</p>
    </div>
    <div class="page-actions">
      <button class="btn" :disabled="isRefetching" @click="() => refetch()">
        <RefreshCw :size="16" /> {{ isRefetching ? '刷新中' : '刷新' }}
      </button>
    </div>
  </div>

  <section class="grid two-col" style="gap: 12px">
    <article class="card section" style="padding: 18px">
      <header class="section-header">
        <div class="pill section-title">
          <TrendingUp :size="16" /> 核心指标
        </div>
        <span class="section-meta">{{ isLoading ? '加载中...' : 'Mock 数据' }}</span>
      </header>

      <div class="grid" style="gap: 10px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))">
        <div v-for="kpi in analytics?.kpis" :key="kpi.label" class="card" style="background: var(--panel); box-shadow: none">
          <div class="muted">{{ kpi.label }}</div>
          <div class="stat-value">{{ kpi.value }}</div>
          <div class="stat-change">{{ kpi.change }}</div>
        </div>
      </div>
    </article>

    <article class="card section" style="padding: 18px">
      <header class="section-header">
        <div class="pill section-title">
          <BarChart3 :size="16" /> 流量来源
        </div>
        <span class="section-meta">总量：{{ trafficTotal }}</span>
      </header>
      <div class="list">
        <div v-for="item in analytics?.traffic" :key="item.source" class="list-item">
          <div style="font-weight: 700">{{ item.source }}</div>
          <span class="pill">{{ item.value }}</span>
        </div>
      </div>
    </article>

    <article class="card section" style="grid-column: span 2; padding: 18px">
      <header class="section-header">
        <div class="pill section-title">
          <Globe :size="16" /> 区域分布
        </div>
        <span class="section-meta">按省份</span>
      </header>
      <div class="list">
        <div v-for="region in analytics?.regions" :key="region.name" class="list-item">
          <div style="font-weight: 700">{{ region.name }}</div>
          <span class="pill">{{ region.users }} 用户</span>
        </div>
      </div>
    </article>
  </section>
</template>
