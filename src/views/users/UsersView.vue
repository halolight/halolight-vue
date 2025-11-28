<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { BadgeCheck, RefreshCw, Shield } from 'lucide-vue-next'

import { fetchUsers } from '@/api/users'

const { data, isLoading, isRefetching, refetch } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
})
</script>

<template>
  <div class="page-header">
    <div>
      <div class="page-eyebrow">Users</div>
      <h1 class="page-title" style="margin: 0">用户管理</h1>
      <p class="muted">Mock.js 返回 /api/users，展示角色和状态。</p>
    </div>
    <div class="page-actions">
      <button class="btn" :disabled="isRefetching" @click="() => refetch()">
        <RefreshCw :size="16" /> {{ isRefetching ? '刷新中' : '刷新' }}
      </button>
    </div>
  </div>

  <section class="card section" style="padding: 18px">
    <header class="section-header">
      <div class="pill section-title">
        <BadgeCheck :size="16" /> 成员列表
      </div>
      <span class="section-meta">{{ isLoading ? '加载中...' : 'Mock 数据' }}</span>
    </header>

    <div class="list">
      <div v-for="user in data?.list" :key="user.id" class="list-item">
        <div>
          <div style="font-weight: 700">{{ user.name }}</div>
          <div class="muted">{{ user.email }}</div>
        </div>
        <div style="text-align: right">
          <span class="pill" style="margin-right: 8px">{{ user.role }}</span>
          <span class="pill" :class="{ 'stat-change': user.status === '活跃' }">{{ user.status }}</span>
        </div>
      </div>
    </div>

    <div class="card" style="box-shadow: none; background: var(--panel)">
      <div style="display: flex; gap: 8px; align-items: center">
        <Shield :size="16" />
        <div class="muted">替换成真实接口时，修改 fetchUsers 并关闭 VITE_USE_MOCK。</div>
      </div>
    </div>
  </section>
</template>
