<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { CheckCheck, Inbox, MailOpen, RefreshCw, Sparkles } from 'lucide-vue-next'

import { fetchMessages } from '@/api/messages'

const { data, isLoading, refetch, isRefetching } = useQuery({
  queryKey: ['messages'],
  queryFn: fetchMessages,
})

const messages = computed(() => data.value?.list ?? [])
const unreadCount = () => messages.value.filter((m) => m.status === '未读').length
</script>

<template>
  <div class="page-header">
    <div>
      <div class="page-eyebrow">Messages</div>
      <h1 class="page-title" style="margin: 0">消息中心</h1>
      <p class="muted">使用 Mock.js 返回的消息列表（/api/messages），数据流由 Vue Query 管理。</p>
    </div>
    <div class="page-actions">
      <button class="btn" :disabled="isRefetching" @click="() => refetch()">
        <RefreshCw :size="16" /> {{ isRefetching ? '刷新中' : '刷新' }}
      </button>
      <span class="pill" style="display: inline-flex; align-items: center; gap: 6px">
        <Inbox :size="14" /> 未读 {{ unreadCount() }}
      </span>
    </div>
  </div>

  <section class="card section" style="padding: 18px">
    <header class="section-header">
      <div class="pill section-title">
        <MailOpen :size="16" /> 最新消息
      </div>
      <span class="section-meta">{{ isLoading ? '加载中...' : 'Mock 数据' }}</span>
    </header>

    <div class="list">
      <div v-for="item in messages" :key="item.id" class="list-item">
        <div>
          <div style="font-weight: 700">{{ item.title }}</div>
          <div class="muted">{{ item.sender }} · {{ item.time }}</div>
        </div>
        <div style="text-align: right">
          <span class="pill" :class="{ 'stat-change': item.status === '未读' }" style="display: inline-flex; gap: 6px; align-items: center">
            <CheckCheck :size="14" /> {{ item.status }}
          </span>
        </div>
      </div>
    </div>

    <div class="card" style="box-shadow: none; background: var(--panel)">
      <div style="display: flex; gap: 8px; align-items: center">
        <Sparkles :size="16" />
        <div class="muted">要接入真实接口，将 `fetchMessages` 改为后端 API，并关闭环境变量 VITE_USE_MOCK。</div>
      </div>
    </div>
  </section>
</template>
