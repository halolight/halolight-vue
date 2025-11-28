<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { CalendarDays, RefreshCw } from 'lucide-vue-next'

import { fetchCalendarEvents } from '@/api/calendar'

const { data, isLoading, isRefetching, refetch } = useQuery({
  queryKey: ['calendar'],
  queryFn: fetchCalendarEvents,
})
</script>

<template>
  <div class="page-header">
    <div>
      <div class="page-eyebrow">Calendar</div>
      <h1 class="page-title" style="margin: 0">活动日历</h1>
      <p class="muted">Mock.js 返回 /api/calendar/events，列出会议/发布/提醒。</p>
    </div>
    <div class="page-actions">
      <button class="btn" :disabled="isRefetching" @click="() => refetch()">
        <RefreshCw :size="16" /> {{ isRefetching ? '同步中' : '刷新' }}
      </button>
    </div>
  </div>

  <section class="card section" style="padding: 18px">
    <header class="section-header">
      <div class="pill section-title">
        <CalendarDays :size="16" /> 日程
      </div>
      <span class="section-meta">{{ isLoading ? '加载中...' : 'Mock 数据' }}</span>
    </header>

    <div class="list">
      <div v-for="event in data?.list" :key="event.id" class="list-item">
        <div>
          <div style="font-weight: 700">{{ event.title }}</div>
          <div class="muted">{{ event.date }}</div>
        </div>
        <span class="pill">{{ event.type }}</span>
      </div>
    </div>
  </section>
</template>
