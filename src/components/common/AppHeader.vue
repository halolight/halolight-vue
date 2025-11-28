<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, Menu, MoonStar, Search, SunMedium } from 'lucide-vue-next'

import { useAuthStore } from '@/stores/auth'
import { useLayoutStore } from '@/stores/layout'

const route = useRoute()
const auth = useAuthStore()
const layout = useLayoutStore()

const greeting = computed(() => {
  const hours = new Date().getHours()
  if (hours < 12) return '早安，保持高效'
  if (hours < 18) return '下午好，继续前进'
  return '晚上好，回顾今天'
})

const routeLabel = computed(() => (route.meta?.label as string) || 'Dashboard')
</script>

<template>
  <header class="app-header">
    <button class="icon-button" @click="layout.toggleSidebar">
      <Menu :size="18" />
    </button>

    <div class="header-search">
      <Search :size="16" />
      <input placeholder="搜索仪表盘、用户、文档..." />
    </div>

    <div class="header-meta" style="gap: 14px">
      <div>
        <div class="breadcrumbs">
          <span>Home</span>
          <span>/</span>
          <span class="route-chip">{{ routeLabel }}</span>
        </div>
        <div class="muted" style="font-size: 12px">{{ greeting }}</div>
      </div>
      <button class="icon-button" title="切换主题" @click="layout.toggleTheme">
        <SunMedium v-if="layout.theme === 'dark'" :size="18" />
        <MoonStar v-else :size="18" />
      </button>
      <button class="icon-button" title="通知中心">
        <Bell :size="18" />
      </button>
      <div class="user-badge">
        <div class="user-avatar">{{ auth.initials }}</div>
        <div class="user-meta">
          <span class="name">{{ auth.user?.name ?? '访客' }}</span>
          <span class="role">{{ greeting }}</span>
        </div>
      </div>
    </div>
  </header>
</template>
