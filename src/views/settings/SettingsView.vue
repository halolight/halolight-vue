<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { Check, Loader2, Save } from 'lucide-vue-next'

import { fetchSettings, updateSettings } from '@/api/settings'

const queryClient = useQueryClient()

const { data, isLoading } = useQuery({
  queryKey: ['settings'],
  queryFn: fetchSettings,
})

const mutation = useMutation({
  mutationFn: updateSettings,
  onSuccess: (next) => {
    queryClient.setQueryData(['settings'], next)
  },
})

const handleToggle = (key: 'showFooter' | 'enableTabBar') => {
  mutation.mutate({ [key]: !(data?.value?.[key] ?? false) })
}

const handleTheme = (theme: 'light' | 'dark' | 'system') => {
  mutation.mutate({ theme })
}

const handleNav = (navigation: 'side' | 'top') => {
  mutation.mutate({ navigation })
}
</script>

<template>
  <div class="page-header">
    <div>
      <div class="page-eyebrow">Settings</div>
      <h1 class="page-title" style="margin: 0">系统设置</h1>
      <p class="muted">Mock.js 返回 /api/settings，支持简单更新以模拟后端存储。</p>
    </div>
    <div class="page-actions">
      <button class="btn primary" :disabled="!!mutation.isPending">
        <Save :size="16" /> 自动保存
      </button>
    </div>
  </div>

  <section class="card section" style="padding: 18px">
    <header class="section-header">
      <div class="pill section-title">外观与导航</div>
      <span class="section-meta">{{ isLoading ? '加载中...' : 'Mock 数据' }}</span>
    </header>

    <div class="list">
      <div class="list-item">
        <div>
          <div style="font-weight: 700">主题</div>
          <div class="muted">light / dark / system</div>
        </div>
        <div style="display: flex; gap: 8px">
          <button class="btn" @click="() => handleTheme('light')">Light</button>
          <button class="btn" @click="() => handleTheme('dark')">Dark</button>
          <button class="btn" @click="() => handleTheme('system')">System</button>
        </div>
      </div>

      <div class="list-item">
        <div>
          <div style="font-weight: 700">导航布局</div>
          <div class="muted">侧边或顶部导航</div>
        </div>
        <div style="display: flex; gap: 8px">
          <button class="btn" @click="() => handleNav('side')">Side</button>
          <button class="btn" @click="() => handleNav('top')">Top</button>
        </div>
      </div>

      <div class="list-item">
        <div>
          <div style="font-weight: 700">显示页脚</div>
          <div class="muted">footer 展示开关</div>
        </div>
        <button class="btn" @click="() => handleToggle('showFooter')">
          <Check :size="14" /> {{ data?.showFooter ? '已开启' : '已关闭' }}
        </button>
      </div>

      <div class="list-item">
        <div>
          <div style="font-weight: 700">Tab Bar</div>
          <div class="muted">多标签导航开关</div>
        </div>
        <button class="btn" @click="() => handleToggle('enableTabBar')">
          <Check :size="14" /> {{ data?.enableTabBar ? '已开启' : '已关闭' }}
        </button>
      </div>
    </div>

    <div v-if="mutation.isPending" class="muted" style="display: inline-flex; align-items: center; gap: 6px">
      <Loader2 class="spin" :size="14" /> 保存中...
    </div>
  </section>
</template>
