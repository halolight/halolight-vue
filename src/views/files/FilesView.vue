<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { FileBox, FolderOpen, RefreshCw } from 'lucide-vue-next'

import { fetchFiles } from '@/api/files'

const { data, isLoading, isRefetching, refetch } = useQuery({
  queryKey: ['files'],
  queryFn: fetchFiles,
})
</script>

<template>
  <div class="page-header">
    <div>
      <div class="page-eyebrow">Files</div>
      <h1 class="page-title" style="margin: 0">文件空间</h1>
      <p class="muted">Mock.js 返回 /api/files，包含名称、大小、更新时间。</p>
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
        <FolderOpen :size="16" /> 最新文件
      </div>
      <span class="section-meta">{{ isLoading ? '加载中...' : 'Mock 数据' }}</span>
    </header>

    <div class="list">
      <div v-for="file in data?.list" :key="file.id" class="list-item">
        <div>
          <div style="font-weight: 700">{{ file.name }}</div>
          <div class="muted">{{ file.owner }} · {{ file.updatedAt }}</div>
        </div>
        <div style="text-align: right">
          <span class="pill">{{ file.size }}</span>
        </div>
      </div>
    </div>

    <div class="card" style="box-shadow: none; background: var(--panel)">
      <div style="display: flex; gap: 8px; align-items: center">
        <FileBox :size="16" />
        <div class="muted">接后端时，改写 fetchFiles，关闭 VITE_USE_MOCK 即可。</div>
      </div>
    </div>
  </section>
</template>
