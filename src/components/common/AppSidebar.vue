<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, Menu } from 'lucide-vue-next'

import { primaryNav, secondaryNav } from '@/config/menu'
import { useAuthStore } from '@/stores/auth'
import { useLayoutStore } from '@/stores/layout'

const route = useRoute()
const router = useRouter()
const layout = useLayoutStore()
const auth = useAuthStore()

const activePath = computed(() => route.path)

const logout = () => {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-mark">HL</div>
      <div style="flex:1">
        <div class="brand-name">Halolight Vue</div>
        <div class="muted" style="font-size: 12px">Admin Pro</div>
      </div>
      <button class="icon-button" title="折叠" @click="layout.toggleSidebar">
        <Menu v-if="layout.sidebarCollapsed" :size="18" />
        <ChevronLeft v-else :size="18" />
      </button>
    </div>

    <div class="nav-group">
      <span class="nav-label">Workspace</span>
      <div class="nav-hint">仪表盘、用户、消息、文件</div>
      <RouterLink
        v-for="item in primaryNav"
        :key="item.to"
        :to="item.to"
        class="nav-link"
        :class="{ active: activePath === item.to }"
      >
        <component :is="item.icon" :size="18" />
        <span>{{ item.title }}</span>
        <span v-if="item.badge" class="badge">{{ item.badge }}</span>
      </RouterLink>
    </div>

    <div class="nav-group">
      <span class="nav-label">System</span>
      <div class="nav-hint">配置、审计、日历、分析</div>
      <RouterLink
        v-for="item in secondaryNav"
        :key="item.to"
        :to="item.to"
        class="nav-link"
        :class="{ active: activePath === item.to }"
      >
        <component :is="item.icon" :size="18" />
        <span>{{ item.title }}</span>
        <span v-if="item.badge" class="badge">{{ item.badge }}</span>
      </RouterLink>
    </div>

    <div class="nav-group" style="margin-top: auto">
      <span class="nav-label">Account</span>
      <div class="nav-link" @click="logout">
        <span>退出登录</span>
      </div>
    </div>
  </aside>
</template>
