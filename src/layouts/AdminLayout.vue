<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'

const layout = useLayoutStore()
</script>

<template>
  <div class="app-shell" :class="{ 'is-collapsed': layout.sidebarCollapsed }">
    <AppSidebar />
    <div class="shell-main">
      <AppHeader />
      <main class="page-area">
        <RouterView />
      </main>
    </div>
  </div>
</template>
