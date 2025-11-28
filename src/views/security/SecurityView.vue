<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-vue-next'

import { fetchSecurityReport } from '@/api/security'

const { data, isLoading, isRefetching, refetch } = useQuery({
  queryKey: ['security'],
  queryFn: fetchSecurityReport,
})
</script>

<template>
  <div class="page-header">
    <div>
      <div class="page-eyebrow">Security</div>
      <h1 class="page-title" style="margin: 0">安全审计</h1>
      <p class="muted">Mock.js 返回 /api/security/report，包含扫描结果与安全分数。</p>
    </div>
    <div class="page-actions">
      <button class="btn" :disabled="isRefetching" @click="() => refetch()">
        <RefreshCw :size="16" /> {{ isRefetching ? '扫描中' : '刷新' }}
      </button>
    </div>
  </div>

  <section class="card section" style="padding: 18px">
    <header class="section-header">
      <div class="pill section-title">
        <ShieldCheck :size="16" /> 安全评分
      </div>
      <span class="section-meta">{{ isLoading ? '加载中...' : 'Mock 数据' }}</span>
    </header>

    <div class="list-item" style="border: none; padding: 0 0 8px">
      <div>
        <div style="font-weight: 700">当前得分</div>
        <div class="muted">上次扫描：{{ data?.lastScan }}</div>
      </div>
      <div class="stat-value">{{ data?.score ?? '—' }}</div>
    </div>

    <div class="list" style="margin-top: 10px">
      <div v-for="issue in data?.issues" :key="issue.id" class="list-item">
        <div>
          <div style="font-weight: 700">{{ issue.title }}</div>
          <div class="muted">严重度：{{ issue.severity }}</div>
        </div>
        <span class="pill" :class="{ 'stat-change': issue.status === '已修复' }">
          <AlertTriangle :size="14" /> {{ issue.status }}
        </span>
      </div>
    </div>
  </section>
</template>
